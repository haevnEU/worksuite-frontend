export interface InfoRecord {
  id: number;
  name: string;
}

export interface RedmineInfoMap {
  status: InfoRecord[];
  priority: InfoRecord[];
  activity: InfoRecord[];
}
