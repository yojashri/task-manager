import { Progress } from '@prisma/client'
import { IsString, IsOptional, IsEnum } from 'class-validator'

export class UpdateTaskDto {

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(Progress)
  progress?: Progress
}