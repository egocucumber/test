import { IsMACAddress, IsNotEmpty } from 'class-validator';

export class TerminalHeartbeatDto {
    @IsMACAddress()
    @IsNotEmpty()
    macAddress: string;
}