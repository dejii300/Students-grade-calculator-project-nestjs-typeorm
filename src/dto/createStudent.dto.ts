import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  registrationNumber: string;

  @ApiProperty()
  mathematics: string;

  @ApiProperty()
  englishLanguage: string;

  @ApiProperty()
  biology: string;

  @ApiProperty()
  chemistry: string;

  @ApiProperty()
  physics: string;

  @ApiProperty()
  french: string;

  @ApiProperty()
  technicalDrawing: string;

  @ApiProperty()
  workshop: string;
  
  gpa: number;
}
