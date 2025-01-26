import { ParentService } from '@/app/core/services/parent.service';
import { UiService } from '@/app/core/services/ui.service';
import { FormData, FormField, GenericFormComponent } from '@/app/shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '@/app/shared/components/generic-table/generic-table.component';
import { parentTableConfig } from '@/app/shared/config/table.config';
import { NEW_PARENT_FORM_JSON } from '@/app/shared/constants/parent';
import { IMutateParent, IParent } from '@/app/shared/interfaces/parent.interfaces';
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-parent',
  imports: [GenericTableComponent, GenericFormComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {
  @ViewChild("createParentContent") createParentContent!: TemplateRef<any>;

  tableConfig: TableConfig = parentTableConfig;
  tableData: IParent[] = [];
  loading: boolean = false;
  parentFormFields = signal<FormField[]>(NEW_PARENT_FORM_JSON);

  constructor(private parentService: ParentService, private uiService: UiService) { }

  ngOnInit(): void {
    this.loadParentService();
  }


  async loadParentService() {
    await this.operateParentList();
  }


  async operateParentList() {
    this.loading = true;
    try {
      const data: IParent[] = await this.parentService.getParentList();
      this.tableData = data;
      this.loading = false;
    } catch (error) {
      this.uiService.showToast('error', 'Error', 'Failed to fetch parent list');
      this.loading = false;
    }
  }

  handleNewParent() {
    this.uiService.openDrawer(this.createParentContent, "Parent Management");
  }

  async handleFormSubmit(formData: FormData): Promise<void> {
    console.log('Form submitted:', formData);
    try {
      const response = await this.parentService.createParent(formData as IMutateParent);
      console.log(response);
      this.uiService.closeDrawer();
      this.uiService.showToast('success', 'Success', 'Parent created successfully');
      this.loadParentService();
    } catch (error: any) {
      console.log(error);
      this.uiService.showToast('error', 'Error', 'Failed to create parent');
    }
  }
}
