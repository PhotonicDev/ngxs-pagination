export interface PageConfig {
  pageSize: number;
  orderBy: [string, 'asc' | 'desc'];
  collection: string;
  filter?: { [key: string]: boolean };
}
export interface ListUpdate<T> {
  data: T;
  type: 'prepend' | 'append';
}
