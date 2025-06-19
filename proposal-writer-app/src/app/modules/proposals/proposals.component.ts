import { Component, OnInit } from '@angular/core';
import { ModuleLoaderService, AppraisenseModule } from '../../core/module-loader.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import QuillBetterTable from 'quill-better-table';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, QuillModule, FormsModule]
})
export class ProposalsComponent implements OnInit {
  moduleInfo: AppraisenseModule | undefined;
  moduleId = 'proposals';
  proposalContent: string = '';

  // ngx-quill custom modules configuration
  customQuillModules = [
    {
      path: 'modules/better-table',
      implementation: QuillBetterTable
    }
  ];

  quillEditorModules = {
    // Standard toolbar options
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video'],
      // quill-better-table specific toolbar options
      // The exact format for toolbar items for quill-better-table might need adjustment
      // based on how it registers its UI elements (e.g., if it adds a dropdown for table operations)
      // For now, adding a simple 'table' button based on common Quill patterns for table modules.
      // The quill-better-table documentation mentions a context menu for operations,
      // and an API `tableModule.insertTable(3, 3)`. A toolbar button might need custom handling.
      // Let's assume for now a basic button might be provided or we'd add a custom one later.
      // The 'quill-better-table' module itself is primarily for enabling the table operations.
      // For now, let's add a placeholder for a table button if ngx-quill/Quill handles it.
      // ['table'] // This is often a standard Quill way to invoke table module if it has a UI.
                  // However, quill-better-table relies on its own operationMenu (context menu)
                  // and API for insertion. A toolbar button to trigger `insertTable` would be custom.
                  // We will rely on the context menu for now and not add a specific toolbar button here
                  // unless `ngx-quill` or `quill-better-table` documentation shows a standard one.
    ],
    // Quill module configurations
    table: false, // Disable Quill's native table module
    'better-table': { // Enable quill-better-table
      operationMenu: {
        items: {
          unmergeCells: { text: 'Unmerge cells' },
          // You can customize other menu item texts here if needed
        },
        // Optional: customize background colors in operation menu
        // color: {
        //   colors: ['#fff', 'red', 'rgb(0, 0, 0)', 'yellow', 'blue'],
        //   text: 'Background Colors'
        // }
      },
      keyboard: { // Recommended by quill-better-table
        bindings: QuillBetterTable.keyboardBindings
      }
    },
    // Other Quill modules like syntax highlighting, etc., could be added here
    // syntax: true, // Example if highlight.js is also installed and configured
  };

  // Version Control Properties
  mockVersions: MockVersion[] = [];
  selectedVersions: MockVersion[] = [];
  diffContent: string | null = null;
  private nextVersionId = 1;

  // Content Library Properties
  mockLibraryItems: LibraryItem[] = [
    { id: 'intro1', title: 'Standard Introduction', content: '<p>This is our standard company introduction. It includes a brief overview of our mission, vision, and values.</p><h2>Our Mission</h2><p>To deliver excellence...</p>', preview: 'Standard company intro...', category: 'Introductions' },
    { id: 'serviceA', title: 'Service Offering A Details', content: '<h2>Service A</h2><p>Detailed description of Service A.</p><ul><li>Feature 1</li><li>Feature 2</li></ul>', preview: 'Details about Service A...', category: 'Services' },
    { id: 'serviceB', title: 'Service Offering B Overview', content: '<h2>Service B</h2><p>Brief overview of Service B, highlighting key benefits.</p>', preview: 'Overview of Service B...', category: 'Services' },
    { id: 'terms1', title: 'Basic Terms and Conditions', content: '<p>All services are subject to our standard terms and conditions, as outlined below...</p>', preview: 'Standard T&Cs...', category: 'Legal' },
    { id: 'testimonial1', title: 'Client Testimonial - Acme Corp', content: '<blockquote><p>"Working with this company has been a fantastic experience..." - CEO, Acme Corp</p></blockquote>', preview: 'Acme Corp testimonial...', category: 'Testimonials' }
  ];
  filteredLibraryItems: LibraryItem[] = [];
  selectedLibraryItem: LibraryItem | null = null;
  quillEditorInstance: any; // To store the Quill editor instance

  constructor(
    private moduleLoader: ModuleLoaderService,
    private translate: TranslateService // Ensure TranslateService is injected
  ) {
    this.filteredLibraryItems = [...this.mockLibraryItems]; // Initialize in constructor
  }

  ngOnInit(): void {
    this.moduleInfo = this.moduleLoader.getAllModules().find(m => m.id === this.moduleId);
    // this.filteredLibraryItems = [...this.mockLibraryItems]; // Or initialize here if preferred
  }

  onContentChanged(event: any): void {
    if (event && event.html) {
      // console.log('Editor content changed (HTML):', event.html);
    }
  }

  // Version Control Methods
  saveNewVersion(): void {
    const promptMessage = this.translate.instant('PROPOSALS.VERSION_CONTROL.SAVE_COMMENT_PROMPT');
    const comment = prompt(promptMessage); // Use window.prompt
    const newVersion: MockVersion = {
      id: this.nextVersionId++,
      content: this.proposalContent,
      timestamp: new Date(),
      author: 'CurrentUser (Mock)',
      comment: comment || undefined
    };
    this.mockVersions.unshift(newVersion);
    console.log('Mock saving new version:', newVersion);
    alert(this.translate.instant('PROPOSALS.VERSION_CONTROL.VERSION_SAVED_ALERT', { id: newVersion.id })); // Use window.alert
  }

  selectVersion(version: MockVersion): void {
    const index = this.selectedVersions.findIndex(v => v.id === version.id);
    if (index > -1) {
      this.selectedVersions.splice(index, 1);
    } else {
      if (this.selectedVersions.length < 2) {
        this.selectedVersions.push(version);
      } else {
        this.selectedVersions.shift();
        this.selectedVersions.push(version);
      }
    }
    this.diffContent = null;
  }

  isSelected(version: MockVersion): boolean {
    return this.selectedVersions.some(v => v.id === version.id);
  }

  compareVersions(): void {
    if (this.selectedVersions.length === 2) {
      const version1 = this.selectedVersions[0];
      const version2 = this.selectedVersions[1];
      this.diffContent = `--- Diff for Version ${version1.id} and Version ${version2.id} ---\n`;
      this.diffContent += `Version ${version1.id} content:\n${version1.content}\n\n`;
      this.diffContent += `--- End of Version ${version1.id} ---\n\n`;
      this.diffContent += `Version ${version2.id} content:\n${version2.content}\n\n`;
      this.diffContent += `--- End of Version ${version2.id} ---`;
      console.log('Comparing versions:', version1, version2);
    } else {
      alert(this.translate.instant('PROPOSALS.VERSION_CONTROL.SELECT_TWO_VERSIONS_ALERT')); // Use window.alert
    }
  }
}

// Interface for MockVersion (can be outside the class or in a separate file)
export interface MockVersion {
  id: number;
  content: string;
  timestamp: Date;
  author: string;
  comment?: string;
}

// Interface for LibraryItem (can be outside the class or in a separate file)
export interface LibraryItem {
  id: string;
  title: string;
  content: string; // HTML or text content
  preview: string; // Short preview
  category?: string;
}

  // Content Library Methods
  filterContentLibrary(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchTerm) {
      this.filteredLibraryItems = [...this.mockLibraryItems];
    } else {
      this.filteredLibraryItems = this.mockLibraryItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.preview.toLowerCase().includes(searchTerm) ||
        (item.category && item.category.toLowerCase().includes(searchTerm))
      );
    }
  }

  selectLibraryItem(item: LibraryItem): void {
    this.selectedLibraryItem = item;
  }

  insertLibraryItem(): void {
    if (this.selectedLibraryItem && this.quillEditorInstance) {
      const range = this.quillEditorInstance.getSelection(true); // Get current cursor position or end of doc
      this.quillEditorInstance.clipboard.dangerouslyPasteHTML(range.index, this.selectedLibraryItem.content);
      alert(this.translate.instant('PROPOSALS.CONTENT_LIBRARY.ITEM_INSERTED_ALERT', { title: this.selectedLibraryItem.title }));
      this.selectedLibraryItem = null; // Deselect after inserting
    } else if (this.selectedLibraryItem) {
        // Fallback if editor instance not ready, simple append
        this.proposalContent = (this.proposalContent || '') + this.selectedLibraryItem.content;
        alert(this.translate.instant('PROPOSALS.CONTENT_LIBRARY.ITEM_INSERTED_ALERT', { title: this.selectedLibraryItem.title }) + " (Appended)");
        this.selectedLibraryItem = null;
    }
  }

  onEditorCreated(editor: any): void {
    this.quillEditorInstance = editor;
    console.log('Quill editor instance created:', editor);
  }

  // Export Methods
  exportProposal(format: 'pdf' | 'word'): void {
    const messageKey = format === 'pdf' ? 'PROPOSALS.EXPORT.EXPORTING_PDF_ALERT' : 'PROPOSALS.EXPORT.EXPORTING_WORD_ALERT';
    const contentToExport = this.proposalContent; // The HTML content from the Quill editor

    // Simulate the export process
    console.log(`Attempting to export to ${format.toUpperCase()}`);
    console.log('Content to be exported:', contentToExport);

    // In a real scenario, this would involve:
    // 1. Sending 'contentToExport' and 'format' to a backend service.
    // 2. Backend service uses a library (e.g., Puppeteer for PDF, Pandoc/Mammoth for Word) to convert HTML to the desired format.
    // 3. Backend service responds with the file or a link to download it.

    alert(this.translate.instant(messageKey, { currentProposalTitle: 'Current Proposal' }));
    // 'Current Proposal' is a placeholder; a real title would be used.
  }
}

// Interface for LibraryItem (can be outside the class or in a separate file)
// This was duplicated, removed from here as it's defined above MockVersion.
// export interface LibraryItem {
//   id: string;
//   title: string;
//   content: string; // HTML or text content
//   preview: string; // Short preview
//   category?: string;
// }
