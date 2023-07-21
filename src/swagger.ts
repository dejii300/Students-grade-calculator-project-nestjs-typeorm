import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('GPA Calculator API')
        .setDescription('API for computing GPAs of students')
        .setVersion('1.0')
        .addTag('Student')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}