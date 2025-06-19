import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OpportunitiesComponent } from './opportunities.component';

const routes: Routes = [
  { path: '', component: OpportunitiesComponent } // Route within the lazy-loaded module
];

@NgModule({
  declarations: [
    OpportunitiesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // Use forChild for feature modules
  ]
})
export class OpportunitiesModule {
  constructor() {
    console.log('OpportunitiesModule loaded');
  }
}
