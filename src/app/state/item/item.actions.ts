import { Message } from './item.model';

export class GetItemBatch {
  static readonly type = '[Item] Get initial batch';
}
export class GetNextItemBatch {
  static readonly type = '[Item] Get next batch';
}

export class ChangePage {
  static readonly type = '[Item] Change page';
  constructor(public payload: 'next' | 'previous') {}
}
export class SetListLimit {
  static readonly type = '[Item] Set list limit';
  constructor(public payload: number) {}
}

export class AddItem {
  static readonly type = '[Item] Add item';
  constructor(public payload: Message) {}
}
export class ModifyItem {
  static readonly type = '[Item] Edit item';
  constructor(public payload: Message) {}
}
export class UpdateList {
  static readonly type = '[Item] Update list';
  constructor(public payload: Message[]) {}
}
export class RemoveItem {
  static readonly type = '[Item] Remove item';
  constructor(public payload: Message) {}
}
export class AddedItemChange {
  static readonly type = '[Item] Added item change';
  constructor(public payload: Message) {}
}
export class ModifiedItemChange {
  static readonly type = '[Item] Modified item change';
  constructor(public payload: Message) {}
}
export class RemovedItemChange {
  static readonly type = '[Item] Removed change';
  constructor(public payload: Message) {}
}
