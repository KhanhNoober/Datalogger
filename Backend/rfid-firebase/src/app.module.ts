import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RfidModule } from './RFID/rfid/rfid.module';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: "serviceAccountKey.json",
    }),
    RfidModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
