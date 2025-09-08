import { Sih3Item } from '@prisma/client';

export class Sih3ItemEntity {
  id: bigint;
  logoPath: string | null;
  title: string | null;
  description: string | null;

  constructor(sih3Item: Sih3Item) {
    this.id = sih3Item.id;
    this.logoPath = sih3Item.logoPath;
    this.title = sih3Item.title;
    this.description = sih3Item.description;
  }
}
