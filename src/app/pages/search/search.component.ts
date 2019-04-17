import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ItemState } from 'src/app/state/item/item.state';
import { Observable } from 'rxjs';
import { AddItem, GetNextItemBatch, RemoveItem, ModifyItem } from 'src/app/state/item/item.actions';
import { Message } from 'src/app/state/item/item.model';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { map, first, filter } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';

export interface MessageId extends Message {
  id: string;
}
@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: [ 'search.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('messageInput') private messageInput: ElementRef<HTMLInputElement>;
  @Select(ItemState.getItems) stateItems$: Observable<Message[]>;
  @Select(ItemState.noMorePages) isLastPage$: Observable<boolean>;
  pageNumber: number;
  message = '';
  editMode = false;
  editedMessage: Message;
  constructor(private store: Store, private afs: AngularFirestore) {}
  ngOnInit() {
    this.scrollToBottom();

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    this.store.dispatch(
      new AddItem({
        message: this.message,
        uid: this.afs.createId(),
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
    this.message = '';
  }
  deleteMessage(item) {
    this.store.dispatch(new RemoveItem(item));
  }
  editMessage(item) {
    this.editMode = true;
    this.message = item.message;
    this.editedMessage = item;
  }
  finishEditing() {
    this.store.dispatch(
      new ModifyItem({
        ...this.editedMessage,
        message: this.message,
      }),
    );
    this.editMode = false;
    this.message = '';
  }
  scrollHandler(e) {
    if (e === 'top') {
      //   this.store.dispatch(new GetNextItemBatch());
    }
  }
  loadMore() {
    this.store.dispatch(new GetNextItemBatch());
  }
  trackByUid(i, item) {
    return i;
  }
}
