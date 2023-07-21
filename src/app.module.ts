import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'chimdindu300',
      database: 'myschool',
      entities: [Student],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Student]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class AppModule {}