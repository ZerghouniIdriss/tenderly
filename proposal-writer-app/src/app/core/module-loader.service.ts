import { Injectable, OnDestroy } from '@angular/core';
import { ConfigurationService, ModuleConfig } from './configuration.service';
import { Subscription } from 'rxjs';

export interface AppraisenseModule {
  id: string;
  name: string;
  active: boolean;
  routePath?: string; // Added routePath
  // Potentially add component, etc. later
}

@Injectable({
  providedIn: 'root'
})
export class ModuleLoaderService implements OnDestroy {
  private modules: Map<string, AppraisenseModule> = new Map();
  private configSubscription: Subscription;

  constructor(private configurationService: ConfigurationService) {
    this.initializeModules();

    // Subscribe to external configuration changes
    this.configSubscription = this.configurationService.getModuleConfigChangedObservable().subscribe(() => {
      console.log('ModuleLoaderService: Detected configuration change. Reloading module states.');
      this.applySavedConfiguration();
    });
  }

  private initializeModules(): void {
    // Define base module structures (could be from a static config, API, etc.)
    const defaultModules: Omit<AppraisenseModule, 'active'>[] = [
      { id: 'opportunities', name: 'Opportunities Management', routePath: 'opportunities' },
      { id: 'analysis', name: 'Document Analysis', routePath: 'analysis' },
      { id: 'proposals', name: 'Proposal Authoring', routePath: 'proposals' },
      { id: 'submissions', name: 'Submission Tracking', routePath: 'submissions' },
      { id: 'knowledgeHub', name: 'Knowledge Hub', routePath: 'knowledge-hub' } // Added Knowledge Hub
    ];

    defaultModules.forEach(mod => {
      this.modules.set(mod.id, { ...mod, active: true }); // Default to active initially
    });

    this.applySavedConfiguration(); // Apply saved active states

    // If no configuration was loaded (e.g., first run), save the current (default) setup.
    const loadedConfigs = this.configurationService.loadModuleConfiguration();
    if (loadedConfigs.length === 0) {
      console.log('ModuleLoaderService: No saved config found, saving initial module states.');
      this.saveCurrentConfiguration();
    }
  }

  private applySavedConfiguration(): void {
    const savedConfigs = this.configurationService.loadModuleConfiguration();
    if (savedConfigs.length > 0) {
      savedConfigs.forEach(config => {
        const existingModule = this.modules.get(config.id);
        if (existingModule) {
          existingModule.active = config.active;
        } else {
          // This case should ideally not happen if defaultModules are comprehensive
          // or if registration is handled more dynamically.
          console.warn(`ModuleLoaderService: Found saved config for unknown module ID: ${config.id}`);
        }
      });
    }
    // For modules not in savedConfig, they retain their default 'active' state from initialization.
    console.log('ModuleLoaderService: Applied module configurations:', this.getAllModules());
  }

  private saveCurrentConfiguration(): void {
    const currentConfigs: ModuleConfig[] = this.getAllModules().map(m => ({
      id: m.id,
      active: m.active
    }));
    this.configurationService.saveModuleConfiguration(currentConfigs);
  }

  // registerModule is still useful if modules can be registered dynamically after init
  // For this setup, initial modules are defined in initializeModules.
  registerModule(module: AppraisenseModule): void {
    // Ensure it doesn't overwrite active status from loaded config without intent
    const existingModule = this.modules.get(module.id);
    if (existingModule) {
      // Preserve active status unless explicitly provided in the module being registered
      const isActive = module.active !== undefined ? module.active : existingModule.active;
      this.modules.set(module.id, { ...module, active: isActive });
    } else {
      this.modules.set(module.id, { ...module, active: module.active !== undefined ? module.active : true });
    }
    // Potentially re-save configuration if a new module is dynamically registered
    // this.saveCurrentConfiguration();
  }

  isModuleActive(moduleId: string): boolean {
    const appModule = this.modules.get(moduleId);
    return appModule ? appModule.active : false;
  }

  setModuleActive(moduleId: string, active: boolean): void {
    const appModule = this.modules.get(moduleId);
    if (appModule) {
      appModule.active = active;
      this.saveCurrentConfiguration(); // Save after updating state
      console.log(`ModuleLoaderService: Module ${moduleId} active state set to ${active}`);
    } else {
      console.warn(`ModuleLoaderService: Attempted to set active state for unknown module ID: ${moduleId}`);
    }
  }

  getAllModules(): AppraisenseModule[] {
    return Array.from(this.modules.values()).sort((a, b) => a.name.localeCompare(b.name)); // Keep sorted for UI
  }

  ngOnDestroy(): void {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
