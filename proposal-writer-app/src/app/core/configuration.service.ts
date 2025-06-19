import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// AppraisenseModule might be imported if needed for defaults, but ModuleConfig is primary here.
// import { ModuleLoaderService, AppraisenseModule } from './module-loader.service';


export interface ModuleConfig {
  id: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private readonly CONFIG_STORAGE_KEY = 'appModuleConfig';
  // Emits when configuration is saved, so other services can react.
  private moduleConfigChanged = new BehaviorSubject<void>(undefined);

  constructor() {}

  saveModuleConfiguration(configs: ModuleConfig[]): void {
    localStorage.setItem(this.CONFIG_STORAGE_KEY, JSON.stringify(configs));
    this.moduleConfigChanged.next(); // Notify subscribers that config has changed
  }

  loadModuleConfiguration(): ModuleConfig[] {
    const savedConfig = localStorage.getItem(this.CONFIG_STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        // Basic validation to ensure it's an array (though more robust validation might be needed)
        if (Array.isArray(parsedConfig)) {
          return parsedConfig as ModuleConfig[];
        } else {
          console.error('Invalid configuration format in localStorage:', parsedConfig);
          localStorage.removeItem(this.CONFIG_STORAGE_KEY); // Clear invalid config
          return [];
        }
      } catch (error) {
        console.error('Error parsing module configuration from localStorage:', error);
        localStorage.removeItem(this.CONFIG_STORAGE_KEY); // Clear corrupted config
        return [];
      }
    }
    // Default configuration if nothing is saved.
    // ModuleLoaderService will be responsible for providing initial defaults if this returns empty.
    return [];
  }

  getModuleConfigChangedObservable(): Observable<void> {
    return this.moduleConfigChanged.asObservable();
  }
}
