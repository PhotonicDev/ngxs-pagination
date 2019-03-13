import { PageConfig } from '../common/common.model';

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
