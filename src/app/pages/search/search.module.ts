import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductState } from 'src/app/state/products/product.state';
import { NgxsModule } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';

const routesSearch = [
  {
    path: '',
    component: SearchComponent,
  },
];

@NgModule({
  declarations: [ SearchComponent ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([ ProductState ]),
    RouterModule.forChild(routesSearch),
    MatButtonModule,
  ],
})
export class SearchModule {}
