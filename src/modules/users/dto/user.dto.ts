import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';
export class UserDto {

    @Length(3,30)
    public readonly username : String

    @IsEmail()
    @IsNotEmpty()
    public readonly email : String

    @IsNotEmpty()
    @Length(8)
    public readonly password : String

    @IsNotEmpty()
    public readonly roles : String[]
}