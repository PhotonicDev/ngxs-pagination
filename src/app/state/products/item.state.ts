import { Store, NgxsOnInit, State, Selector, StateContext, Action } from '@ngxs/store';
import { ItemStateModel } from './item.model';
import { GetItemBatch, GetNextItemBatch, SetListLimit, AddItem, UpdateList } from './item.actions';
import { ItemService } from './item.service';
import { first } from 'rxjs/operators';

@State<ItemStateModel>({
  name: 'products',
  defaults: {
    data: [],
    config: { pageSize: 10 },
    isLastPage: false,
  },
})
export class ItemState implements NgxsOnInit {
  constructor(private store: Store, private itemService: ItemService) {}

  @Selector()
  static getItems(state: ItemStateModel) {
    return state.data;
  }

  @Selector()
  static noMorePages({ isLastPage }: ItemStateModel) {
    return isLastPage;
  }
  ngxsOnInit() {
    this.store.dispatch(new GetItemBatch({ pageSize: 10, orderBy: 'desc', filter: {} }));
  }
  @Action(GetItemBatch)
  getItemBatch({ getState, patchState, dispatch }: StateContext<ItemStateModel>, { payload }: GetItemBatch) {
    this.itemService.getItemBatch(payload).subscribe((itemList) => {
      console.log('initial', itemList);
      if (itemList.data.length > 1) {
        dispatch(new UpdateList({ data: itemList.data.reverse(), type: 'append' }));
      } else {
        dispatch(new UpdateList({ ...itemList, type: 'append' }));
      }
    });
    patchState({
      config: { ...payload },
    });
  }
  @Action(AddItem)
  addItem({ getState, patchState, dispatch }: StateContext<ItemStateModel>, { payload }: AddItem) {
    console.log(payload);
    this.itemService.addItem(payload);
  }
  @Action(GetNextItemBatch)
  getNextItemBatch({ getState, patchState, dispatch }: StateContext<ItemStateModel>) {
    const state = getState();

    this.itemService.getNextItemBatch(state.config).pipe(first()).subscribe((itemList) => {
      if (itemList.data.length < state.config.pageSize) {
        dispatch(new SetListLimit(itemList.data.length + state.data.length));
      }
      const data = itemList.data.length > 1 ? itemList.data.reverse() : itemList.data;
      dispatch(new UpdateList({ data, type: 'prepend' }));
    });
  }

  @Action(SetListLimit)
  setListLimit({ getState, patchState }: StateContext<ItemStateModel>, { payload }: SetListLimit) {
    const state = getState();

    const isLastPage = payload - state.config.pageSize;
    patchState({
      isLastPage,
    });
  }
  @Action(UpdateList)
  listUpdate({ getState, patchState, dispatch }: StateContext<ItemStateModel>, { payload }: UpdateList) {
    const state = getState();
    let data = [];
    if (payload.type === 'prepend') {
      data = [ ...payload.data, ...state.data ];
    } else {
      data = [ ...state.data, ...payload.data ];
    }
    patchState({
      data,
    });
  }
}
