import { IsString, IsOptional, IsBoolean, IsDateString, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  shortDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  longDescription?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}