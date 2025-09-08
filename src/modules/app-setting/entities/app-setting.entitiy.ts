import { AppSetting } from '@prisma/client';

export class AppSettingEntity {
  id: bigint;
  key: string;
  type: string;
  value: string | null;

  constructor(appSetting: AppSetting) {
    this.id = appSetting.id;
    this.key = appSetting.key;
    this.type = appSetting.type;
    this.value = appSetting.value;
  }
}
