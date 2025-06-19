import { Component, OnInit } from '@angular/core';
import { ModuleLoaderService, AppraisenseModule } from '../../core/module-loader.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

// Prompt Interface
export interface Prompt {
  id: string; // UUID or timestamp-based
  title: string;
  text: string;
  category: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-knowledge-hub',
  templateUrl: './knowledge-hub.component.html',
  styleUrls: ['./knowledge-hub.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule] // Add FormsModule
})
export class KnowledgeHubComponent implements OnInit {
  moduleInfo: AppraisenseModule | undefined;

  // Prompt Management Properties
  prompts: Prompt[] = [];
  newPrompt: Partial<Prompt> = { title: '', text: '', category: 'General', tags: [] };
  editingPrompt: Prompt | null = null;
  categories: string[] = ['General', 'Marketing', 'Technical', 'Sales', 'Customer Service', 'Development'];
  private readonly PROMPTS_STORAGE_KEY = 'knowledgeHubPrompts';

  constructor(
    private moduleLoader: ModuleLoaderService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.moduleInfo = this.moduleLoader.getAllModules().find(m => m.id === 'knowledgeHub');
    this.loadPrompts();
  }

  // Prompt Management Methods
  loadPrompts(): void {
    const storedPrompts = localStorage.getItem(this.PROMPTS_STORAGE_KEY);
    if (storedPrompts) {
      this.prompts = (JSON.parse(storedPrompts) as Prompt[]).map(p => ({
        ...p,
        createdAt: new Date(p.createdAt), // Ensure dates are Date objects
        updatedAt: new Date(p.updatedAt)
      }));
    } else {
      this.prompts = []; // Initialize with some mock data if desired
    }
  }

  savePrompts(): void {
    localStorage.setItem(this.PROMPTS_STORAGE_KEY, JSON.stringify(this.prompts));
  }

  addPrompt(): void {
    if (!this.newPrompt.title || !this.newPrompt.text || !this.newPrompt.category) {
      alert(this.translate.instant('KNOWLEDGE_HUB.PROMPT_MANAGEMENT.VALIDATION_ERROR_MISSING_FIELDS'));
      return;
    }
    const now = new Date();
    const fullNewPrompt: Prompt = {
      id: Date.now().toString(), // Simple ID generation
      title: this.newPrompt.title!,
      text: this.newPrompt.text!,
      category: this.newPrompt.category!,
      tags: this.newPrompt.tags?.filter(tag => tag.trim() !== '') || [],
      createdAt: now,
      updatedAt: now
    };
    this.prompts.unshift(fullNewPrompt); // Add to the beginning
    this.savePrompts();
    this.newPrompt = { title: '', text: '', category: 'General', tags: [] }; // Reset form
  }

  selectPromptForEdit(prompt: Prompt): void {
    // Create a deep copy for editing to avoid modifying the original object directly
    this.editingPrompt = JSON.parse(JSON.stringify(prompt));
    if (this.editingPrompt && this.editingPrompt.tags === undefined) {
      this.editingPrompt.tags = []; // Ensure tags is an array for the form
    }
  }

  updatePrompt(): void {
    if (this.editingPrompt && this.editingPrompt.title && this.editingPrompt.text && this.editingPrompt.category) {
      const index = this.prompts.findIndex(p => p.id === this.editingPrompt!.id);
      if (index > -1) {
        this.prompts[index] = {
          ...this.editingPrompt,
          tags: this.editingPrompt.tags?.filter(tag => tag.trim() !== '') || [],
          updatedAt: new Date()
        };
        this.savePrompts();
        this.cancelEdit();
      }
    } else {
       alert(this.translate.instant('KNOWLEDGE_HUB.PROMPT_MANAGEMENT.VALIDATION_ERROR_MISSING_FIELDS'));
    }
  }

  deletePrompt(promptId: string): void {
    if (confirm(this.translate.instant('KNOWLEDGE_HUB.PROMPT_MANAGEMENT.CONFIRM_DELETE_PROMPT'))) {
      this.prompts = this.prompts.filter(p => p.id !== promptId);
      this.savePrompts();
      if (this.editingPrompt && this.editingPrompt.id === promptId) {
        this.cancelEdit(); // Clear edit form if deleted prompt was being edited
      }
    }
  }

  cancelEdit(): void {
    this.editingPrompt = null;
  }
}
