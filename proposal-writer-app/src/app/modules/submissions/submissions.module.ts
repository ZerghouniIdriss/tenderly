import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubmissionsComponent } from './submissions.component';

const routes: Routes = [
  { path: '', component: SubmissionsComponent } // Route within the lazy-loaded module
];

@NgModule({
  declarations: [
    SubmissionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // Use forChild for feature modules
  ]
})
export class SubmissionsModule {
  constructor() {
    console.log('SubmissionsModule loaded');
  }
}
