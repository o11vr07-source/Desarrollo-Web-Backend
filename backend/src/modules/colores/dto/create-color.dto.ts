import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateColorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    nombre : string;
}
