import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateTaskListDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}