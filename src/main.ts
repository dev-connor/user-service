import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // query parameter 가 숫자면 숫자로 변환 
      },
    }),
  )

  const config = new DocumentBuilder()
    .setTitle("ProtoPie 과제 테스트")
    .setDescription("ProtoPie 과제 테스트")
    .setVersion("1.0")
    .addTag("ProtoPie")
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
