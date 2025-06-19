import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProposalsComponent } from './proposals.component';

const routes: Routes = [
  { path: '', component: ProposalsComponent } // Route within the lazy-loaded module
];

@NgModule({
  declarations: [
    ProposalsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // Use forChild for feature modules
  ]
})
export class ProposalsModule {
  constructor() {
    console.log('ProposalsModule loaded');
  }
}
