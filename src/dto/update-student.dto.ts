import { ApiProperty } from "@nestjs/swagger";

export class UpdateStudentDto {

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
