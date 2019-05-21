import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StartRequest {
  @IsString()
  readonly userId: string;

  @IsOptional()
  @IsString()
  readonly gameToken?: string;

  @IsOptional()
  @IsNumber()
  readonly rows?: number;

  @IsOptional()
  @IsNumber()
  readonly cols?: number;
}
