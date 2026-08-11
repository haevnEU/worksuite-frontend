export interface ShareableResource {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  language?: string;
  password?: string;
  created_at?: string;
}
