import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTallaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(4)
    nombre:string;
}
