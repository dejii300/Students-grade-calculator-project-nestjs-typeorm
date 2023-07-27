import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Student } from './student.entity';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StatisticDto } from './dto/createStatistic.dto';
import { CreateStudentDto } from './dto/createStudent.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async saveStudentData(studentData: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(studentData);
    student.gpa = await this.calculateGPA(student);
    return this.studentRepository.save(student);
  }

  async calculateGPA(student: CreateStudentDto): Promise<number> {
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

  async getStatisticalInformation(): Promise<StatisticDto> {
    const allStudents = await this.studentRepository.find();

    let mostFailedSubjects: string[] = [];
    let mostFailedCount = 0;
    let mostAcedSubjects: string[] = [];
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
      const gradeCounts = {
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
    const empty = this.studentRepository.find();
    if (empty) {
      return empty;
    }
    throw new NotFoundException('Nothing is found');
  }

  async findOne(id: number) {
    const found = await this.studentRepository.findOne({ where: { id } });
    if (found) {
      return found;
    }
    throw new NotFoundException('The id you provided does not exist');
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      throw new Error('Student not found.');
    }

    student.mathematics = updateStudentDto.mathematics;
    student.englishLanguage = updateStudentDto.englishLanguage;
    student.biology = updateStudentDto.biology;
    student.chemistry = updateStudentDto.chemistry;
    student.physics = updateStudentDto.physics;
    student.french = updateStudentDto.french;
    student.technicalDrawing = updateStudentDto.technicalDrawing;
    student.workshop = updateStudentDto.workshop;

    const totalGradePoints =
      this.getSubjectGrade(updateStudentDto.mathematics) * 4 +
      this.getSubjectGrade(updateStudentDto.englishLanguage) * 2 +
      this.getSubjectGrade(updateStudentDto.biology) * 3 +
      this.getSubjectGrade(updateStudentDto.chemistry) * 4 +
      this.getSubjectGrade(updateStudentDto.physics) * 4 +
      this.getSubjectGrade(updateStudentDto.french) * 1 +
      this.getSubjectGrade(updateStudentDto.technicalDrawing) * 1 +
      this.getSubjectGrade(updateStudentDto.workshop) * 1;

    const totalUnits = 4 + 2 + 3 + 4 + 4 + 1 + 1 + 1; // Total units of all subjects

    student.gpa = totalUnits !== 0 ? totalGradePoints / totalUnits : 0;

    await this.studentRepository.save(student);
    return student;
  }

  private getSubjectGrade(grade: string): number {
    const gradeMap = {
      A: 5,
      B: 4,
      C: 3,
      D: 2,
      E: 1,
      F: 0,
    };

    return gradeMap[grade] || 0;
  }

  async remove(id: number) {
    const found = await this.studentRepository.delete(id);
    if (found) {
      return found;
    }
    throw new NotFoundException('The id you provided does not exist');
  }
}
