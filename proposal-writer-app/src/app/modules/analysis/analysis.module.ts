import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisComponent } from './analysis.component';

const routes: Routes = [
  { path: '', component: AnalysisComponent } // Route within the lazy-loaded module
];

@NgModule({
  declarations: [
    AnalysisComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // Use forChild for feature modules
  ]
})
export class AnalysisModule {
  constructor() {
    console.log('AnalysisModule loaded');
  }
}
