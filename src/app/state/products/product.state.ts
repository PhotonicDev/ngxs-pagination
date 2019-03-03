import { Store, NgxsOnInit, State, Selector, StateContext, Action } from '@ngxs/store';
import { ProductStateModel } from './product.model';
import {
  GetProductBatch,
  GetNextProductBatch,
  GetPreviousProductBatch,
  ChangePage,
  SetListLimit,
} from './product.actions';
import { ProductService } from './product.service';
import { first } from 'rxjs/operators';

@State<ProductStateModel>({
  name: 'products',
  defaults: {
    data: [],
    config: { pageSize: 2 },
    isLastPage: false,
    isFirstPage: true,
    page: 0,
  },
})
export class ProductState implements NgxsOnInit {
  constructor(private store: Store, private productService: ProductService) {}

  @Selector()
  static getProducts(state: ProductStateModel) {
    const start = state.page * state.config.pageSize;
    let end = start + state.config.pageSize;
    end = state.data.length > end ? end : state.data.length;
    const slice = state.data.slice(start, end);
    console.log(start, end, slice);
    return slice;
  }
  @Selector()
  static currentPage(state: ProductStateModel) {
    return state.page;
  }
  @Selector()
  static noMorePages({ isLastPage, config, page }: ProductStateModel) {
    console.log('isLastPage', isLastPage);

    return typeof isLastPage === 'number' ? isLastPage < config.pageSize * page : false;
  }
  ngxsOnInit() {
    this.store.dispatch(new GetProductBatch({ pageSize: 3, orderBy: 'desc', filter: {} }));
  }
  @Action(GetProductBatch)
  getProductBatch({ getState, patchState }: StateContext<ProductStateModel>, { payload }: GetProductBatch) {
    const state = getState();
    this.productService.getProductBatch(payload).pipe(first()).subscribe((productList) => {
      patchState({
        config: payload,
        data: [ ...state.data, ...productList.data ],
      });
    });
  }
  @Action(GetNextProductBatch)
  getNextProductBatch({ getState, patchState, dispatch }: StateContext<ProductStateModel>) {
    const state = getState();

    this.productService.getNextProductBatch(state.config).pipe(first()).subscribe((productList) => {
      // console.log('next', productList.isLastPage, productList.data.length < state.config.pageSize);
      if (productList.data.length < state.config.pageSize) {
        dispatch(new SetListLimit(productList.data.length + state.data.length));
      }
      patchState({
        data: [ ...state.data, ...productList.data ],
      });
    });
  }

  @Action(SetListLimit)
  setListLimit({ getState, patchState }: StateContext<ProductStateModel>, { payload }: SetListLimit) {
    const state = getState();
    console.log('limit reached', payload);

    const isLastPage = payload - state.config.pageSize;
    patchState({
      isLastPage,
    });
  }

  @Action(ChangePage)
  changePage({ getState, patchState, dispatch }: StateContext<ProductStateModel>, { payload }: ChangePage) {
    const state = getState();
    let page;
    let isFirstPage;
    if (payload === 'previous') {
      page = state.page - 1;
    }
    if (payload === 'next') {
      page = state.page + 1;
    }
    isFirstPage = page === 0;
    if (!state.isLastPage) {
      if (state.data.length < page * state.config.pageSize + state.config.pageSize) {
        dispatch(new GetNextProductBatch());
      }
      // if() {
    }
    patchState({
      page,
      isFirstPage,
    });
    // }
  }
}
