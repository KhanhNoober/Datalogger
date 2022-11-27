import { Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin } from 'nestjs-firebase/lib/firebase.decorator';
import { FirebaseAdmin } from 'nestjs-firebase/lib/firebase.interface';

@Injectable()
export class AppService {
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {}

  getHello(): string {
    return 'Hello World!';
  }
}
