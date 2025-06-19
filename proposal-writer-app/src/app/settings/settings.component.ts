import { Component, OnInit } from '@angular/core';
import { ModuleLoaderService, AppraisenseModule } from '../core/module-loader.service';
import { ConfigurationService } from '../core/configuration.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; // Added TranslateModule

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TranslateModule], // Added TranslateModule
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  modules: AppraisenseModule[] = [];

  constructor(
    private moduleLoader: ModuleLoaderService,
    private configService: ConfigurationService // configService might not be directly used if ModuleLoader handles all saving
  ) { }

  ngOnInit(): void {
    this.loadModules();
    // Optional: Subscribe to config changes if needed for real-time updates on this page
    // this.configService.getModuleConfigChangedObservable().subscribe(() => this.loadModules());
  }

  loadModules(): void {
    this.modules = this.moduleLoader.getAllModules();
    console.log('SettingsComponent: Loaded modules for UI:', this.modules);
  }

  onModuleToggle(module: AppraisenseModule, event: Event): void {
    const isActive = (event.target as HTMLInputElement).checked;
    console.log(`SettingsComponent: Toggling module ${module.id} to ${isActive}`);
    this.moduleLoader.setModuleActive(module.id, isActive);
    // The ModuleLoaderService now internally calls ConfigurationService to save.
    // Refresh local list to ensure UI consistency, though ModuleLoaderService state is the source of truth.
    this.loadModules();
  }
}
