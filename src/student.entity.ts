import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	registrationNumber: string;

	@Column()
	mathematics: string;

	@Column()
	englishLanguage: string;

	@Column()
	biology: string;

	@Column()
	chemistry: string;

	@Column()
	physics: string;

	@Column()
	french: string;

	@Column()
	technicalDrawing: string;

	@Column()
	workshop: string;

	@Column('float')
	gpa: number;
}