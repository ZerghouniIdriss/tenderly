import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'opportunities', loadChildren: () => import('./modules/opportunities/opportunities.module').then(m => m.OpportunitiesModule) },
  { path: 'analysis', loadChildren: () => import('./modules/analysis/analysis.module').then(m => m.AnalysisModule) },
  { path: 'proposals', loadChildren: () => import('./modules/proposals/proposals.module').then(m => m.ProposalsModule) },
  { path: 'submissions', loadChildren: () => import('./modules/submissions/submissions.module').then(m => m.SubmissionsModule) },
  { path: 'knowledge-hub', loadChildren: () => import('./modules/knowledge-hub/knowledge-hub.module').then(m => m.KnowledgeHubModule) },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
