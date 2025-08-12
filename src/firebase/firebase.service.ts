import { app } from './config';
import { Injectable } from '@nestjs/common';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

@Injectable()
export class FirebaseService {
  async searchGifByUser(phone: string) {
    const firestore = getFirestore(app);
    const isExisting = await getDoc(doc(firestore, 'DBBotWhatsapp', phone));
    if (isExisting.data()) {
      return isExisting.data();
    }
    try {
    } catch (error) {
      throw error;
    }
  }
}
