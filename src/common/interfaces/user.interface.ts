export interface UserInterface {
  id: bigint;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  role: string | null;
  permissions: string[];
}
