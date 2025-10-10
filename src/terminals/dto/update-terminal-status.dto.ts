import { IsEnum, IsNotEmpty } from 'class-validator';
import { TerminalStatus } from '@prisma/client';

export class UpdateTerminalStatusDto {
  @IsEnum(TerminalStatus)
  @IsNotEmpty()
  status: TerminalStatus;
}