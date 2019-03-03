import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProductState } from 'src/app/state/products/product.state';
import { Observable } from 'rxjs';
import { Product } from 'src/app/state/products/product.model';
import { GetNextProductBatch, GetPreviousProductBatch, ChangePage } from 'src/app/state/products/product.actions';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: [ 'search.component.scss' ],
})
export class SearchComponent implements OnInit {
  @Select(ProductState.getProducts) stateProducts$: Observable<Product[]>;
  @Select(ProductState.currentPage) productCurrentPage$: Observable<number>;
  @Select(ProductState.noMorePages) isLastPage$: Observable<boolean>;
  pageNumber: number;
  constructor(private store: Store) {}
  ngOnInit() {
    this.productCurrentPage$.subscribe((num) => {
      this.pageNumber = num;
    });
  }

  next(page: number) {
    this.store.dispatch(new ChangePage('next'));
  }
  previous(page: number) {
    this.store.dispatch(new ChangePage('previous'));
  }
}
