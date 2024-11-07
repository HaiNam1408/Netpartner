import { ApiProperty } from "@nestjs/swagger";

export class ImportFileDto {
    @ApiProperty({
      description: "File CSV",
      type: String,
      format: "binary",
      required: true,
    })
    file: string;
  }