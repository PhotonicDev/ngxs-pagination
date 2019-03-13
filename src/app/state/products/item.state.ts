import { Store, NgxsOnInit, State, Selector, StateContext, Action } from '@ngxs/store';
import { ItemStateModel, Message } from './item.model';
import { GetItemBatch, GetNextItemBatch, SetListLimit, AddItem, UpdateList } from './item.actions';
import { ItemService } from './item.service';
import { first, tap } from 'rxjs/operators';
import { CommonPageService } from '../common/common.service';

@State<ItemStateModel>({
  name: 'messages',
  defaults: {
    data: [],
    config: { pageSize: 10, orderBy: [ 'dateCreated', 'desc' ], collection: 'messages' },
    isLastPage: false,
  },
})
export class ItemState implements NgxsOnInit {
  constructor(private store: Store, private page: CommonPageService) {}

  @Selector()
  static getItems(state: ItemStateModel) {
    return state.data;
  }

  @Selector()
  static noMorePages({ isLastPage }: ItemStateModel) {
    return isLastPage;
  }
  ngxsOnInit() {
    this.store.dispatch(new GetItemBatch());
  }
  @Action(GetItemBatch)
  getItemBatch({ getState, dispatch }: StateContext<ItemStateModel>) {
    const state = getState();
    return this.page.getItemBatch<Message>(state.config).subscribe((itemList) => {
      dispatch(
        new UpdateList({ data: itemList.data.length > 1 ? itemList.data.reverse() : itemList.data, type: 'append' }),
      );
    });
  }
  @Action(AddItem)
  addItem({ getState }: StateContext<ItemStateModel>, { payload }: AddItem) {
    const state = getState();
    return this.page.addItem<Message>(state.config.collection, payload);
  }
  @Action(GetNextItemBatch)
  getNextItemBatch({ getState, dispatch }: StateContext<ItemStateModel>) {
    const state = getState();

    return this.page.getNextItemBatch<Message>(state.config).pipe(
      first(),
      tap((result: { data: Message[]; isLast: boolean }) => {
        if (result.data.length < state.config.pageSize) {
          dispatch(new SetListLimit(result.data.length + state.data.length));
        }
        const data = result.data.length > 1 ? result.data.reverse() : result.data;
        dispatch(new UpdateList({ data, type: 'prepend' }));
      }),
    );
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
  listUpdate({ getState, patchState }: StateContext<ItemStateModel>, { payload }: UpdateList) {
    const state = getState();
    const data: Message[] =
      payload.type === 'prepend' ? [ ...payload.data, ...state.data ] : [ ...state.data, ...payload.data ];
    patchState({
      data,
    });
  }
}
