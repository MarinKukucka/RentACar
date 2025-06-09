import { FileParameter } from "../api/api";

export class FinishRentalCommand {
    returnDateTime!: Date;
    odometerEnd!: number;
    notes!: string | undefined;
    files!: FileParameter[] | undefined
}