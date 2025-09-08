import { ContactUs } from '@prisma/client';

export class ContactUsEntity {
  id: bigint;
  type: string | null;
  description: string | null;

  constructor(contactUs: ContactUs) {
    this.id = contactUs.id;
    this.type = contactUs.type;
    this.description = contactUs.description;
  }
}
