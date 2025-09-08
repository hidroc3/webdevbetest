import { Sih3 } from '@prisma/client';

export class Sih3Entity {
  id: bigint;
  title: string | null;
  description: string | null;

  constructor(sih3: Sih3) {
    this.id = sih3.id;
    this.title = sih3.title;
    this.description = sih3.description;
  }
}
