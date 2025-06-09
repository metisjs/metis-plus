import type { UserPermissions } from '@/utils/auth';

export interface CurrentUser {
  name?: string;
  age?: number;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  permissions: UserPermissions;
}
