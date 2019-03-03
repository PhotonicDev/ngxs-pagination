import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';

const routesLanding = [
  {
    path: '',
    component: LandingComponent,
  },
];

@NgModule({
  declarations: [ LandingComponent ],
  imports: [ CommonModule, RouterModule.forChild(routesLanding) ],
})
export class LandingModule {}
