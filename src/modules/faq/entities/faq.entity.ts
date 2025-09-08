import { Faq } from '@prisma/client';

export class FaqEntity {
  id: bigint;
  question: string | null;
  answer: string | null;

  constructor(faq: Faq) {
    this.id = faq.id;
    this.question = faq.question;
    this.answer = faq.answer;
  }
}
