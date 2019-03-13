import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Message } from './item.model';
import { PageConfig } from '../common/common.model';

@Injectable()
export class ItemService {
  index: any;
  constructor(private afs: AngularFirestore) {}

  addItem(item: Message): Promise<any> {
    return this.afs.doc<Message>(`messages/${item.uid}`).set(item);
  }

  removeItem(id: string): Promise<any> {
    return this.afs.doc<Message>('messages/' + id).delete();
  }

  getItemBatch(config: PageConfig): Observable<{ data: Message[] }> {
    return this.afs
      .collection<Message>('messages', (ref) => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy('dateCreated', (config.orderBy || 'desc') as any);
        return q;
      })
      .stateChanges([ 'added' ])
      .pipe(
        map((actions) => {
          this.index = actions.length > 1 ? actions[actions.length - 1].payload.doc : this.index;
          return {
            data: actions.map((a) => {
              const item = a.payload.doc.data();
              return item;
            }),
          };
        }),
      );
  }

  getNextItemBatch(config: PageConfig): Observable<{ data: Message[]; isLastPage: boolean }> {
    return this.afs
      .collection<Message>('messages', (ref) => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy('dateCreated', 'desc');
        q = q.startAfter(this.index);
        return q;
      })
      .snapshotChanges()
      .pipe(
        map((actions) => {
          this.index = actions.length > 1 ? actions[actions.length - 1].payload.doc : this.index;

          const newData = {
            data: actions.map((a) => {
              const product = a.payload.doc.data();
              return product;
            }),
            isLastPage: actions.length < config.pageSize,
          };
          console.log(newData);

          return newData;
        }),
      );
  }
}
