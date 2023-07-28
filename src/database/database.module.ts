import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student.entity';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.getOrThrow ('DB_HOST'),
				port: configService.getOrThrow ('DB_PORT'),
				username: configService.getOrThrow ('DB_USERNAME'),
				password: configService.getOrThrow ('DB_PASSWORD'),
				database: configService.getOrThrow ('DB_DATABASE'),
				entities: [Student],
				synchronize: configService.getOrThrow ('DB_SYNCHRONIZE'),
			}),
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
