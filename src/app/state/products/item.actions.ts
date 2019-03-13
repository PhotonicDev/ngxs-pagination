import { Message } from './item.model';
import { ListUpdate, PageConfig } from '../common/common.model';

export class GetItemBatch {
  static readonly type = 'GET_INITIAL_ITEM_BATCH';
}
export class GetNextItemBatch {
  static readonly type = 'GET_NEXT_ITEM_BATCH';
}

export class ChangePage {
  static readonly type = 'CHANGE_PAGE';
  constructor(public payload: 'next' | 'previous') {}
}
export class SetListLimit {
  static readonly type = 'SET_LIST_LIMIT';
  constructor(public payload: number) {}
}

export class AddItem {
  static readonly type = 'ADD_ITEM';
  constructor(public payload: Message) {}
}
export class UpdateList {
  static readonly type = 'UPDATE_LIST';
  constructor(public payload: ListUpdate<Message[]>) {}
}
