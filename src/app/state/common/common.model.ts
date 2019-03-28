export interface PageConfig {
  pageSize: number;
  orderBy: [string, 'asc' | 'desc'];
  collection: string;
  page: number;
  filter?: { [key: string]: boolean };
}
