import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface ProductStateModel {
  data: Product[];
  config: PageConfig;
  isLastPage: number | boolean;
  isFirstPage: boolean;
  page: number;
}

export interface Product {
  dateCreated: Date;
  delivery?: string;
  description?: string;
  key: string;
  name: string;
  nameQuery: { [key: string]: boolean };
  other?: string;
  post?: string;
  productPhoto?: string;
  productService: string;
  provider: string;
  tags?: string[];
}

export interface PageConfig {
  pageSize: number;
  orderBy?: string;
  filter?: { [key: string]: boolean };
}
