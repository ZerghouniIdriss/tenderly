import { Component, OnInit } from '@angular/core';
import { ModuleLoaderService, AppraisenseModule } from '../../core/module-loader.service';
import { TranslateModule } from '@ngx-translate/core'; // Import
import { CommonModule } from '@angular/common'; // Import

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule] // Add imports
})
export class AnalysisComponent implements OnInit {
  moduleInfo: AppraisenseModule | undefined;
  moduleId = 'analysis'; // Specific ID for this module
  selectedFileName: string | null = null;
  isErrorState: boolean = false; // To toggle error section visibility for demo

  constructor(private moduleLoader: ModuleLoaderService) { }

  ngOnInit(): void {
    this.moduleInfo = this.moduleLoader.getAllModules().find(m => m.id === this.moduleId);
    // Simulate error state for demo purposes after a delay
    // setTimeout(() => { this.isErrorState = true; }, 5000);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.isErrorState = false; // Clear previous error on new file selection
    } else {
      this.selectedFileName = null;
    }
  }

  triggerFileUpload(): void {
    // Actual file upload logic will be added later
    if (this.selectedFileName) {
      console.log('Uploading file:', this.selectedFileName);
      // Simulate an error for demo
      // setTimeout(() => {
      //   console.log('Simulating upload error for:', this.selectedFileName);
      //   this.isErrorState = true;
      //   this.selectedFileName = null; // Clear selection on error for demo
      // }, 2000);
    } else {
      console.log('No file selected to upload.');
      alert('Please select a file first.'); // Simple feedback
    }
  }

  retryAnalysis(): void {
    console.log('Retrying analysis...');
    this.isErrorState = false;
    // Logic to retry analysis will be added later
    // Might need to re-trigger upload or use a stored reference to the failed file/process.
    alert('Retry logic not yet implemented.');
  }
}
