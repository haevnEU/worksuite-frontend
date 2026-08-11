export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  vcsKey?: string;
  redmineKey?: string;
  createdAt: string;
  avatarUrl?: string;
}
