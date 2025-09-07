import { Test, TestingModule } from '@nestjs/testing';
import { AppSettingController } from './app-setting.controller';

describe('AppSettingController', () => {
  let controller: AppSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppSettingController],
    }).compile();

    controller = module.get<AppSettingController>(AppSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
