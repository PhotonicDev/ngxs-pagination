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
} from './item.actions';
import { first, tap } from 'rxjs/operators';
import { CommonPageService } from '../common/common.service';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';

@State<ItemStateModel>({
  name: 'messages',
  defaults: {
    data: [],
    config: {
      pageSize: 10,
      orderBy: [ 'dateCreated', 'desc' ],
      collection: 'messages',
    },
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
    return this.page.getItemBatch<Message>(state.config).pipe(
      tap((result: { data: Message[] }) => {
        result.data.forEach((x) => {
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
        // const added = result.data.filter(x => x.type === 'added');
        // const removed = result.data.filter(x => x.type === 'removed');
        // const modified = result.data.filter(x => x.type === 'modified');
        // if (added.length > 0) {
        //   dispatch(new AddedItemChange(added));
        // }
        // if (removed.length > 0) {
        //   dispatch(new RemovedItemChange(added));
        // }
        // if (modified.length > 0) {
        //   dispatch(new ModifiedItemChange(added));
        // }

        // dispatch(
        //   new UpdateList({
        //     data: result.data.length > 1 ? result.data.reverse() : result.data,
        //     type: 'append',
        //   }),
        // );
      }),
    );
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
  @Action(RemoveItem)
  removeItem({ getState }: StateContext<ItemStateModel>, { payload }: RemoveItem) {
    const state = getState();
    return this.page.removeItem(state.config.collection, payload);
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
  @Action(ModifiedItemChange)
  modifiedItemChange(
    { getState, patchState, setState }: StateContext<ItemStateModel>,
    { payload }: ModifiedItemChange,
  ) {
    // const state = getState();
    // const data = ;
    console.log('after modified change', payload);
    setState(
      patch({
        data: updateItem((x) => x.uid === payload.uid, payload),
      }),
    );
  }
  @Action(RemovedItemChange)
  removedItemChange({ getState, patchState, setState }: StateContext<ItemStateModel>, { payload }: RemovedItemChange) {
    // const state = getState();
    // const data = state.data.filter(
    //   x => payload.findIndex(y => x.uid === y.uid) === -1,
    // );
    console.log('after removed change', payload);
    setState(
      patch({
        data: removeItem((x: Message) => x.uid === payload.uid),
      }),
    );
  }
  @Action(AddedItemChange)
  addedItemChange({ getState, setState }: StateContext<ItemStateModel>, { payload }: AddedItemChange) {
    const state = getState();

    console.log('after added change', payload);
    setState(
      patch({
        data: insertItem(payload, payload.index),
      }),
    );
  }
}
