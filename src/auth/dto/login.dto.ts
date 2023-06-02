import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty({
        message: "Zorunlu alan lütfen doldurunuz !"
    })
    email: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 25, {
        message: "Şifreniz en az 6 karakterden veya en fazla 25 karakterden oluşturulmalıdır."
    })
    password: string
}