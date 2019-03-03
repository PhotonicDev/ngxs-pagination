import { Product, PageConfig } from './product.model';

export class GetProductBatch {
  static readonly type = 'GET_INITIAL_PRODUCT_BATCH';

  constructor(public payload: PageConfig) {}
}
export class GetNextProductBatch {
  static readonly type = 'GET_NEXT_PRODUCT_BATCH';
}

export class AddProduct {
  static readonly type = 'ADD_PRODUCT';

  constructor(public payload: Product) {}
}

export class GetPreviousProductBatch {
  static readonly type = 'GET_PREVIOUS_PRODUCT_BATCH';
}

export class ChangePage {
  static readonly type = 'CHANGE_PAGE';
  constructor(public payload: 'next' | 'previous') {}
}
export class SetListLimit {
  static readonly type = 'SET_LIST_LIMIT';
  constructor(public payload: number) {}
}
