import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
dotenv.config({ path: '.env' });

async function bootstrap() {

  try {

    const app = await NestFactory.create(AppModule);
    await app.listen(3000);

  } catch (error) {

    console.error(error.message, "error");

  }

}

void bootstrap().then(() => console.log("App started")).then((err) => console.error(err, "error"));
