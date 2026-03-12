import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator'
import { Progress } from '@prisma/client'

export class CreateTaskDto {

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  dueDate?: string

  @IsOptional()
  @IsEnum(Progress)
  progress?: Progress

}