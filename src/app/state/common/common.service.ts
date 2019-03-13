import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  Query,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { PageConfig } from './common.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonPageService {
  indexList: { [key: string]: QueryDocumentSnapshot<any> } = {};
  constructor(private afs: AngularFirestore) {}

  getItemBatch<T>(config: PageConfig): Observable<{ data: T[] }> {
    return this.afs
      .collection<T>(config.collection, ref => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy(...config.orderBy);
        return q;
      })
      .stateChanges([
        'added',
        'modified',
        'removed',
      ])
      .pipe(
        map(actions => {
          console.log(actions);

          this.indexList[config.collection] =
            actions.length > 0
              ? actions[actions.length - 1].payload.doc
              : this.indexList[config.collection];
          return {
            data: actions.map(a => {
              return {
                uid: a.payload.doc.id,
                type: a.payload.type,
                index: a.payload.newIndex,
                ...a.payload.doc.data(),
              };
            }),
          };
        }),
      );
  }

  getNextItemBatch<T>(
    config: PageConfig,
  ): Observable<{ data: T[]; isLast: boolean }> {
    return this.afs
      .collection<T>(config.collection, ref => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy(...config.orderBy);
        q = q.startAfter(this.indexList[config.collection]);
        return q;
      })
      .snapshotChanges()
      .pipe(
        map(actions => {
          this.indexList[config.collection] =
            actions.length > 0
              ? actions[actions.length - 1].payload.doc
              : this.indexList[config.collection];

          const newData = {
            data: actions.map(a => {
              return {
                uid: a.payload.doc.id,
                type: a.payload.type,
                index: a.payload.newIndex,
                ...a.payload.doc.data(),
              };
            }),
            isLast: actions.length < config.pageSize,
          };
          return newData;
        }),
      );
  }
  addItem<T>(dir: string, item: T): Promise<void> {
    return this.afs.doc<T>(`${dir}/${item['uid']}`).set(item);
  }

  removeItem(dir: string, uid: string): Promise<void> {
    return this.afs.doc(`${dir}/${uid}`).delete();
  }
}
