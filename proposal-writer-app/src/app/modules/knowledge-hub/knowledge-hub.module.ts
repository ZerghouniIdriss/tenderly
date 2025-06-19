import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { KnowledgeHubComponent } from './knowledge-hub.component';

const routes: Routes = [
  { path: '', component: KnowledgeHubComponent }
];

@NgModule({
  declarations: [], // Components are standalone, so no declarations here
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(), // Use forChild for feature modules if they need to provide translations
    KnowledgeHubComponent // Import the standalone component
  ]
})
export class KnowledgeHubModule {
  constructor() {
    console.log('KnowledgeHubModule loaded');
  }
}
