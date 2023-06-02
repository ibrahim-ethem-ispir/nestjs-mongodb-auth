import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TokenSchema, UserSchema } from './schemas';
import { AuthDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { IJwtPayload } from './interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Token') private tokenModel: mongoose.Model<TokenSchema>,
    @InjectModel('User') private userModel: mongoose.Model<UserSchema>,
    private jwtService: JwtService,
  ) {}

  async userInfo(userId: IJwtPayload) {
    console.log("***** ",userId)

    const user = await this.userModel.findById(userId).select("name surname email")

    return user
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ email });

    if (!user) throw new UnauthorizedException('Geçersiz Kimlik Bilgisi');

    // şifre kontrol
    const comparePassword = await this.compareData(password, user.password);
    console.log('comparePassword : ', comparePassword);
    if (!comparePassword)
      throw new UnauthorizedException('Geçersiz Kimlik Bilgisi');

    // token oluşturma
    let userId = user._id;
    const token = await this.createToken({ userId });

    console.log(userId)
    console.log(typeof userId)

    await this.tokenModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(String(userId)),
      },
      {
        $set: {
          token,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    
    return {
      token,
    };
  }

  async register(dto: AuthDto) {
    const hash = await this.hashData(dto.password);

    console.log('dto : ', dto);

    const userCheck = await this.userModel.findOne({ email: dto.email });

    if (userCheck)
      throw new BadRequestException('Kullanıcı sistemde kayıtlı !');

    dto.password = hash;
    const newUser = new this.userModel({
      ...dto,
    });

    await newUser.save().catch((error) => {
      throw new BadRequestException('Kayıt Oluşturulamadı !');
    });

    return {
      result: 'Kayıt Eklendi ...',
    };
  }

  async hashData(data: string) {
    // password hash
    return await bcrypt.hash(data, 10);
  }

  async compareData(password, comparePassword) {
    return await bcrypt.compare(password, comparePassword);
  }

  async createToken(payload: IJwtPayload) {
    // token oluşturma
    const token = await this.jwtService.sign(payload);

    return token;
  }
}
