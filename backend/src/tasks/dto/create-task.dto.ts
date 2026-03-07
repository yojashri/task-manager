import { IsString, IsOptional, IsDateString } from 'class-validator'

export class CreateTaskDto {

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  dueDate?: string
}