export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  gitlabKey?: string;
  redmineKey?: string;
  createdAt: string;
  avatarUrl?: string;
}
