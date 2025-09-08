import { Test, TestingModule } from '@nestjs/testing';
import { Sih3ItemService } from './sih3-item.service';

describe('Sih3ItemService', () => {
  let service: Sih3ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Sih3ItemService],
    }).compile();

    service = module.get<Sih3ItemService>(Sih3ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
