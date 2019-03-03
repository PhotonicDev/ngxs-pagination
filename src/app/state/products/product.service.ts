import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AngularFirestore, DocumentSnapshot, Query } from '@angular/fire/firestore';
import { Product, PageConfig } from './product.model';

@Injectable()
export class ProductService {
  index: any;
  constructor(private afs: AngularFirestore) {}

  addProduct(product: Product): Promise<any> {
    return this.afs.collection<Product>('products').add(product);
  }

  removeProduct(id: string): Promise<any> {
    return this.afs.doc<Product>('products/' + id).delete();
  }

  getProductBatch(config: PageConfig): Observable<{ data: Product[]; isLastPage: boolean }> {
    return this.afs
      .collection<Product>('products', (ref) => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy('dateCreated', (config.orderBy || 'desc') as any);
        return q;
      })
      .snapshotChanges()
      .pipe(
        map((actions) => {
          this.index = actions[actions.length - 1].payload.doc;
          console.log('initial batch', actions.length < config.pageSize);

          return {
            data: actions.map((a) => {
              const product = a.payload.doc.data();
              return product;
            }),
            isLastPage: actions.length < config.pageSize,
          };
        }),
      );
  }

  getNextProductBatch(config: PageConfig): Observable<{ data: Product[]; isLastPage: boolean }> {
    return this.afs
      .collection<Product>('products', (ref) => {
        let q: Query = ref;
        q = q.limit(config.pageSize);
        q = q.orderBy('dateCreated', (config.orderBy || 'desc') as any);
        q = q.startAfter(this.index);
        return q;
      })
      .snapshotChanges()
      .pipe(
        map((actions) => {
          this.index = actions.length > 0 ? actions[actions.length - 1].payload.doc : this.index;
          console.log('next batch', actions.length < config.pageSize);

          return {
            data: actions.map((a) => {
              const product = a.payload.doc.data();
              return product;
            }),
            isLastPage: actions.length < config.pageSize,
          };
        }),
      );
  }
}
