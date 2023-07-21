import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Student } from './student.entity';
import { UpdateStudentDto } from './update-student.dto';

@Injectable()
export class StudentService {
constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
) {}

async saveStudentData(studentData: Partial<Student>): Promise<Student> {
    const student = this.studentRepository.create(studentData);
    student.gpa = await this.calculateGPA(student);
    return this.studentRepository.save(student);
}

async calculateGPA(student: Student): Promise<number> {
    const gradePoints = {
      A: 5,
      B: 4,
      C: 3,
      D: 2,
      E: 1,
      F: 0,
    };

    const subjectUnits = {
      mathematics: 4,
      englishLanguage: 2,
      biology: 3,
      chemistry: 4,
      physics: 4,
      french: 1,
      technicalDrawing: 1,
      workshop: 1,
    };

    let totalGradePoints = 0;
    let totalUnits = 0;

    for (const subject of Object.keys(subjectUnits)) {
      const grade = student[subject];
    console.log(`Subject: ${subject}, Grade: ${grade}`);
      if (grade && grade in gradePoints) {
        const subjectGradePoints = gradePoints[grade];
        totalGradePoints += subjectGradePoints * subjectUnits[subject];
        totalUnits += subjectUnits[subject];
      } else {
        
        throw new Error(`Invalid grade "${grade}" for subject "${subject}"`);
      }
    }

    if (totalUnits === 0) {
      throw new Error('No subjects with valid units found');
    }

    const gpa = totalGradePoints / totalUnits;

    if (isNaN(gpa)) {
    
      throw new Error('Error calculating GPA');
    }

    return gpa;
  }

async getStatisticalInformation(): Promise<{
    mostFailedSubjects: string[];
  mostAcedSubjects: string[];
}> {
  const allStudents = await this.studentRepository.find();

  let mostFailedSubjects: string[] = []
  let mostFailedCount = 0;
  let mostAcedSubjects: string[] = []
  let mostAcedCount = 0;

  for (const subject of [
    'mathematics',
    'englishLanguage',
    'biology',
    'chemistry',
    'physics',
    'french',
    'technicalDrawing',
    'workshop',
  ]) {
    let gradeCounts = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
    };

    for (const student of allStudents) {
      const grade = student[subject];
      if (grade && grade in gradeCounts) {
        gradeCounts[grade]++;
      }
    }

    if (gradeCounts.F > mostFailedCount) {
      mostFailedSubjects = [subject];
      mostFailedCount = gradeCounts.F;
    } else if (gradeCounts.F === mostFailedCount) {
      mostFailedSubjects.push(subject);
    }

    const totalAced = gradeCounts.A + gradeCounts.B;
    if (totalAced > mostAcedCount) {
      mostAcedSubjects = [subject];
      mostAcedCount = totalAced;
    } else if (totalAced === mostAcedCount) {
      mostAcedSubjects.push(subject);
    }
  }

  if (mostFailedCount === 0) {
    mostFailedSubjects = ['No failed subjects'];
  }

  if (mostAcedCount === 0) {
    mostAcedSubjects = ['No aced subjects'];
  }

  if (mostFailedSubjects.length === 0 || mostAcedSubjects.length === 0) {
    // Handle the case when there are no valid grades for any student
    console.error('No valid grades found for any student');
    throw new Error('No valid grades found for any student');
  }

  return {
    mostFailedSubjects,
    mostAcedSubjects,
  };
}

    async findAll() {
        return this.studentRepository.find();

    }

    async findOne(id: number) {
        return this.studentRepository.findOne({where:{id}});
    }

    async update(id: number, updateStudentDto: UpdateStudentDto) {
    
      const student = await this.studentRepository.findOneBy({id});
      
      student.mathematics = updateStudentDto.mathematics;
      student.englishLanguage = updateStudentDto.englishLanguage;
      student.biology = updateStudentDto.biology;
      student.chemistry = updateStudentDto.chemistry;
      student.physics = updateStudentDto.physics;
      student.french = updateStudentDto.french;
      student.technicalDrawing = updateStudentDto.technicalDrawing;
      student.workshop = updateStudentDto.workshop;
      
      
      
      
      
      
      return this.studentRepository.save(student);
      
    }
    
    async remove(id: number) {
        await this.studentRepository.delete(id)
    }

}