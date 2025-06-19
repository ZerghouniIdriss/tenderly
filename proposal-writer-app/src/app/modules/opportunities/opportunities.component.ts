import { Component, OnInit } from '@angular/core';
import { ModuleLoaderService, AppraisenseModule } from '../../core/module-loader.service';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule] // Add CommonModule and TranslateModule
})
export class OpportunitiesComponent implements OnInit {
  moduleInfo: AppraisenseModule | undefined;
  moduleId = 'opportunities'; // Specific ID for this module

  constructor(private moduleLoader: ModuleLoaderService) { }

  ngOnInit(): void {
    this.moduleInfo = this.moduleLoader.getAllModules().find(m => m.id === this.moduleId);
    // If not found, it means it wasn't pre-registered as expected.
    // For now, we'll rely on pre-registration in ModuleLoaderService.
    // A more robust system might involve the component registering itself if not found,
    // or the service having a method to get/create module info.
  }
}
