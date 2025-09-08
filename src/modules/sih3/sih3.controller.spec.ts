import { Test, TestingModule } from '@nestjs/testing';
import { Sih3Controller } from './sih3.controller';
import { Sih3Service } from './sih3.service';

describe('Sih3Controller', () => {
  let controller: Sih3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Sih3Controller],
      providers: [Sih3Service],
    }).compile();

    controller = module.get<Sih3Controller>(Sih3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
