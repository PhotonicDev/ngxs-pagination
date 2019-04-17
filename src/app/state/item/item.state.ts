import { Store, NgxsOnInit, State, Selector, StateContext, Action } from '@ngxs/store';
import { ItemStateModel, Message } from './item.model';
import {
  GetItemBatch,
  GetNextItemBatch,
  SetListLimit,
  AddItem,
  UpdateList,
  RemoveItem,
  ModifiedItemChange,
  RemovedItemChange,
  AddedItemChange,
  ModifyItem,
} from './item.actions';
import { first, tap } from 'rxjs/operators';
import { CommonPageService } from '../common/common.service';
import { patch, removeItem, insertItem, updateItem } from '@ngxs/store/operators';

@State<ItemStateModel>({
  name: 'messages',
  defaults: {
    data: [],
    config: {
      pageSize: 10,
      orderBy: [ 'dateCreated', 'desc' ],
      collection: 'messages',
      page: 0,
    },
    isLastPage: false,
  },
})
export class ItemState implements NgxsOnInit {
  constructor(private store: Store, private page: CommonPageService) {}

  @Selector()
  static getItems({ data }: ItemStateModel) {
    return [ ...data ].reverse();
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
    const { config } = getState();
    return this.page.getItemBatch<Message>(config).pipe(
      tap(({ data }) => {
        console.log(data);
        data.forEach((x) => {
          console.log(x);
          if (x.type === 'added') {
            dispatch(new AddedItemChange(x));
          }
          if (x.type === 'removed') {
            dispatch(new RemovedItemChange(x));
          }
          if (x.type === 'modified') {
            dispatch(new ModifiedItemChange(x));
          }
        });
      }),
    );
  }

  @Action(GetNextItemBatch)
  getNextItemBatch({ patchState, getState, dispatch }: StateContext<ItemStateModel>) {
    const { config, data } = getState();
    patchState({
      config: {
        ...config,
        page: config.page + 1,
      },
    });
    return this.page.getNextItemBatch<Message>(config, data[data.length - 1].uid).pipe(
      // first(),
      tap((result) => {
        console.log(result);
        result.data.forEach((x) => {
          console.log(x);
          const newIndex = x.newIndex + (config.page + 1) * config.pageSize;
          const newItem = { ...x, newIndex };
          console.log(x.newIndex, config.page, config.pageSize, newItem);

          if (x.type === 'added') {
            dispatch(new AddedItemChange(newItem));
          }
          if (x.type === 'removed') {
            dispatch(new RemovedItemChange(newItem));
          }
          if (x.type === 'modified') {
            dispatch(new ModifiedItemChange(newItem));
          }
        });
      }),
      // tap((result: { data: Message[]; isLast: boolean }) => {
      //   if (result.data.length < config.pageSize) {
      //     dispatch(new SetListLimit(result.data.length + data.length));
      //   }
      //   dispatch(new UpdateList(result.data));
      // }),
    );
  }

  @Action(SetListLimit)
  setListLimit({ getState, patchState }: StateContext<ItemStateModel>, { payload }: SetListLimit) {
    const { config } = getState();

    const isLastPage = payload - config.pageSize;
    patchState({
      isLastPage,
    });
  }

  @Action(UpdateList)
  listUpdate({ getState, patchState }: StateContext<ItemStateModel>, { payload }: UpdateList) {
    const { data } = getState();
    patchState({
      data: [ ...data, ...payload ],
    });
  }

  @Action(ModifyItem)
  modifyItem({ getState }: StateContext<ItemStateModel>, { payload }: ModifyItem) {
    const { config } = getState();
    return this.page.modifyItem(config.collection, payload.uid, payload);
  }

  @Action(ModifiedItemChange)
  modifiedItemChange({ setState }: StateContext<ItemStateModel>, { payload }: ModifiedItemChange) {
    setState(
      patch({
        data: updateItem((x: Message) => x.uid === payload.uid, payload),
      }),
    );
  }

  @Action(RemoveItem)
  removeItem({ getState, setState }: StateContext<ItemStateModel>, { payload }: RemoveItem) {
    const { config } = getState();
    return this.page.removeItem(config.collection, payload.uid).then(() => {
      const item = { ...payload, deleted: true };
      setState(
        patch({
          data: updateItem((x: Message) => x.uid === payload.uid, item),
        }),
      );
    });
  }

  @Action(RemovedItemChange)
  removedItemChange({ setState }: StateContext<ItemStateModel>, { payload }: RemovedItemChange) {
    setState(
      patch({
        data: removeItem((x: Message) => x.uid === payload.uid),
      }),
    );
  }

  @Action(AddItem)
  addItem({ getState }: StateContext<ItemStateModel>, { payload }: AddItem) {
    const { config } = getState();
    return this.page.addItem<Message>(config.collection, payload.uid, payload);
  }

  @Action(AddedItemChange)
  addedItemChange({ setState }: StateContext<ItemStateModel>, { payload }: AddedItemChange) {
    setState(
      patch({
        data: insertItem(payload, payload.newIndex),
      }),
    );
  }
}
