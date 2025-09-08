import { Hero } from '@prisma/client';

export class HeroEntity {
  id: bigint;
  richText: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imagePath: string | null;

  constructor(hero: Hero) {
    this.id = hero.id;
    this.richText = hero.richText;
    this.ctaText = hero.ctaText;
    this.ctaLink = hero.ctaLink;
    this.imagePath = hero.imagePath;
  }
}
