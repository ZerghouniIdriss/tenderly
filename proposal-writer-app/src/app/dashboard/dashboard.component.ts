import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleLoaderService, AppraisenseModule } from '../core/module-loader.service';
import { ConfigurationService } from '../core/configuration.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core'; // Added TranslateModule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule], // Added TranslateModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public modulesToDisplay: AppraisenseModule[] = [];
  private configChangeSubscription: Subscription | undefined;

  constructor(
    public moduleLoader: ModuleLoaderService, // Made public for potential direct use or can be private
    private router: Router,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.loadDisplayModules(); // Initial load
    // Subscribe to changes that might affect dashboard (e.g., module activation)
    this.configChangeSubscription = this.configurationService.getModuleConfigChangedObservable().subscribe(() => {
      console.log('DashboardComponent: Detected config change, reloading displayable modules.');
      this.loadDisplayModules();
    });
  }

  loadDisplayModules(): void {
    this.modulesToDisplay = this.moduleLoader.getAllModules();
    // getAllModules in ModuleLoaderService is already sorted by name.
    console.log('DashboardComponent: Loaded modules for display:', this.modulesToDisplay);
  }

  navigateToModule(module: AppraisenseModule): void {
    if (module.active && module.routePath) {
      this.router.navigate(['/', module.routePath]);
    } else {
      console.log(`DashboardComponent: Module ${module.name} is inactive or has no routePath.`);
    }
  }

  ngOnDestroy(): void {
    this.configChangeSubscription?.unsubscribe();
  }
}
