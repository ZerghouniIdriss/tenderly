import { Component, OnInit } from '@angular/core';
import { ModuleLoaderService, AppraisenseModule } from '../../core/module-loader.service';
import { TranslateModule } from '@ngx-translate/core'; // Import
import { CommonModule } from '@angular/common'; // Import
// FormsModule might be needed if [(ngModel)] is used on inputs/selects
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule] // Add imports, add FormsModule if needed
})
export class SubmissionsComponent implements OnInit {
  moduleInfo: AppraisenseModule | undefined;
  moduleId = 'submissions'; // Specific ID for this module
  selectedDocuments: File[] = [];

  constructor(private moduleLoader: ModuleLoaderService) { }

  ngOnInit(): void {
    this.moduleInfo = this.moduleLoader.getAllModules().find(m => m.id === this.moduleId);
  }

  // Placeholder methods for button clicks
  saveSubmission(): void {
    console.log('Saving submission data...');
    // Logic for saving submission will be added later
    alert('Save Submission logic not yet implemented.');
  }

  onDocumentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedDocuments = Array.from(input.files);
      console.log('Selected documents:', this.selectedDocuments.map(f => f.name));
    } else {
      this.selectedDocuments = [];
    }
  }

  uploadSubmissionDocuments(): void {
    if (this.selectedDocuments.length === 0) {
      alert('No documents selected to upload.');
      return;
    }
    console.log('Uploading submission documents:', this.selectedDocuments.map(f => f.name));
    // Logic for uploading documents will be added later
    alert('Upload Documents logic not yet implemented.');
    // Potentially clear selection after "upload"
    // this.selectedDocuments = [];
  }
}
