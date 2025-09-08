import { Test, TestingModule } from '@nestjs/testing';
import { Sih3Service } from './sih3.service';

describe('Sih3Service', () => {
  let service: Sih3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Sih3Service],
    }).compile();

    service = module.get<Sih3Service>(Sih3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
