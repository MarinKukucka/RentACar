import { FileParameter } from "../api/api";

export class FinishRentalCommand {
    id!: number; 
    returnDateTime!: Date;
    odometerEnd!: number;
    notes!: string | undefined;
    files!: FileParameter[] | undefined
}