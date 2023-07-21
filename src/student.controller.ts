import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './update-student.dto';

@ApiTags('Student')
@Controller('students')
export class StudentController {
constructor(private readonly studentService: StudentService) {}

    @ApiOperation({ summary: 'Save student data to the database and calculate GPA' })
    @ApiResponse({ status: 201, description: 'Student data saved successfully' })
    @ApiBody({ type: Student })
    @Post()
    async saveStudentData(@Body() studentData: Partial<Student>): Promise<Student> {
        return this.studentService.saveStudentData(studentData);
    }
    

    @ApiOperation({ summary: 'Provides all stored student data' })
    @ApiResponse({ status: 200, description: 'All student data provided successfully' })
    @Get()
    findAll() {
        return this.studentService.findAll();
    }
    
    @ApiOperation({ summary: 'Get each student data by id' })
    @ApiResponse({ status: 200, description: 'Student data provided successfully' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studentService.findOne(+id);
    }

    @ApiOperation({ summary: 'Get statistical information' })
    @ApiResponse({ status: 200, description: 'Statistical information retrieved successfully' })
    @Get('statistical-info')
    async getStatisticalInformation(): Promise<{
        mostFailedSubjects: string[];
        mostAcedSubjects: string[];
    }> {
        return this.studentService.getStatisticalInformation();
    }

    @ApiOperation({ summary: 'Remove each student data from the database' })
    @ApiResponse({ status: 20, description: 'data removed successfully' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.studentService.remove(+id);
    }

    @ApiOperation({ summary: 'Update each student data by id' })
    @ApiResponse({ status: 200, description: 'Student data updated successfully' })
    @Put(':id')
  
    async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
}
}

