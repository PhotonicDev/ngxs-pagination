import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemState } from 'src/app/state/item/item.state';
import { NgxsModule } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatIconModule,
} from '@angular/material';
import { ScrollableDirective } from 'src/app/directives/scrollable.directive';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
const routesSearch = [
  {
    path: '',
    component: SearchComponent,
  },
];

@NgModule({
  declarations: [
    SearchComponent,
    ScrollableDirective,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    VirtualScrollerModule,
    NgxsModule.forFeature([
      ItemState,
    ]),
    RouterModule.forChild(routesSearch),
    MatButtonModule,
  ],
})
export class SearchModule {}
