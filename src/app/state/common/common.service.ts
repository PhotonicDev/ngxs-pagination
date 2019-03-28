import { Injectable } from '@angular/core';
import { AngularFirestore, Query, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { PageConfig } from './common.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonPageService {
  indexList: { [key: string]: any } = {};
  constructor(private afs: AngularFirestore) {}

  getItemBatch<T>(config: PageConfig): Observable<{ data: T[] }> {
    return this.afs
      .collection<T>(config.collection, (ref) => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy(...config.orderBy);
        return q;
      })
      .stateChanges()
      .pipe(
        map((actions) => {
          return {
            data: actions.map((a) => {
              this.indexList[a.payload.doc.id] = a.payload.doc;
              return {
                uid: a.payload.doc.id,
                type: a.payload.type,
                newIndex: a.payload.newIndex,
                oldIndex: a.payload.oldIndex,
                ...a.payload.doc.data(),
              };
            }),
          };
        }),
      );
  }

  getNextItemBatch<T>(config: PageConfig, uid: string): Observable<{ data: T[]; isLast: boolean }> {
    return this.afs
      .collection<T>(config.collection, (ref) => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy(...config.orderBy);
        q = q.startAfter(this.indexList[uid]);
        return q;
      })
      .snapshotChanges()
      .pipe(
        map((actions) => {
          const newData = {
            data: actions.map((a) => {
              this.indexList[a.payload.doc.id] = a.payload.doc;
              return {
                uid: a.payload.doc.id,
                type: a.payload.type,
                newIndex: a.payload.newIndex,
                oldIndex: a.payload.oldIndex,
                ...a.payload.doc.data(),
              };
            }),
            isLast: actions.length < config.pageSize,
          };
          return newData;
        }),
      );
  }
  addItem<T>(dir: string, uid: string, item: T): Promise<void> {
    return this.afs.doc<T>(`${dir}/${uid}`).set(item);
  }

  removeItem<T>(dir: string, uid: string): Promise<void> {
    return this.afs.doc<T>(`${dir}/${uid}`).delete();
  }
  modifyItem<T>(dir: string, uid: string, item: T): Promise<void> {
    return this.afs.doc<T>(`${dir}/${uid}`).update(item);
  }
}
