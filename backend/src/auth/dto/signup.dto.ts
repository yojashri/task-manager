import { IsEmail, IsString, IsOptional, IsIn } from 'class-validator'

export class SignupDto {

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsIn(['student','teacher'])
  role: string

  @IsOptional()
  @IsString()
  teacherId?: string

}