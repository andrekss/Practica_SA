import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ApprovePayrollDto {
  @IsInt()
  @Min(1)
  @Max(3)
  step!: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
