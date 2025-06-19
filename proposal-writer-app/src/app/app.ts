import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleLoaderService, AppraisenseModule } from './core/module-loader.service';
import { ConfigurationService } from './core/configuration.service';
import { Subscription } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Added TranslateModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, TranslateModule], // Added TranslateModule
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  protected title = 'proposal-writer-app';
  // Make moduleLoader public to allow template access
  // Or create a getter for modules if preferred private

  // To make the nav update if modules are toggled while app is running.
  private configChangeSubscription: Subscription | undefined;
  public currentModules: AppraisenseModule[] = [];


  constructor(
    public moduleLoader: ModuleLoaderService,
    private configurationService: ConfigurationService,
    public translate: TranslateService // Injected TranslateService, public for template access
  ) {
    translate.setDefaultLang('en');
    const preferredLang = localStorage.getItem('preferredLang');
    if (preferredLang) {
      translate.use(preferredLang);
    } else {
      translate.use('en'); // Default to English if no preference stored
    }
  }

  ngOnInit(): void {
    this.loadNavigableModules(); // Initial load
    // Subscribe to changes that might affect navigation (e.g., module activation)
    this.configChangeSubscription = this.configurationService.getModuleConfigChangedObservable().subscribe(() => {
      console.log('AppComponent: Detected config change, reloading navigable modules.');
      this.loadNavigableModules();
    });
  }

  loadNavigableModules(): void {
    // This will be re-evaluated by the template if moduleLoader.getAllModules() is directly used
    // Or we can store it in a component property if we want more control or transformations
    this.currentModules = this.moduleLoader.getAllModules().filter(m => m.active);
    console.log('AppComponent: Loaded navigable modules:', this.currentModules);
  }

  // Optional: A specific getter if moduleLoader is private
  // get navigableModules(): AppraisenseModule[] {
  //   return this.moduleLoader.getAllModules().filter(module => module.active);
  // }

  ngOnDestroy(): void {
    this.configChangeSubscription?.unsubscribe();
  }

  switchLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('preferredLang', language);
    // Consider if components listening to configChangeSubscription for nav/dashboard updates
    // also need to be explicitly told to re-render if their content depends on translate.currentLang
    // or if the translate pipe handles this automatically (it should).
    // For nav and dashboard, the text is bound via pipe, so it updates.
    // If there were component properties directly holding translated strings, they'd need manual update.
  }
}
// Ensure AppComponent implements OnInit if not already (it does in the source)
