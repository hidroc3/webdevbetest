import { Test, TestingModule } from '@nestjs/testing';
import { Sih3ItemController } from './sih3-item.controller';
import { Sih3ItemService } from './sih3-item.service';

describe('Sih3ItemController', () => {
  let controller: Sih3ItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Sih3ItemController],
      providers: [Sih3ItemService],
    }).compile();

    controller = module.get<Sih3ItemController>(Sih3ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
