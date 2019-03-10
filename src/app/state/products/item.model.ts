export interface ItemStateModel {
  data: Message[];
  config: PageConfig;
  isLastPage: number | boolean;
}

export interface Product {
  dateCreated: any;
  uid?: string;
  name: string;
  productPhoto?: string;
}
export interface Message {
  dateCreated: any;
  uid: string;
  message: string;
}

export interface PageConfig {
  pageSize: number;
  orderBy?: string;
  filter?: { [key: string]: boolean };
}

export interface ListUpdate {
  data: Message[];
  type: 'prepend' | 'append';
}
