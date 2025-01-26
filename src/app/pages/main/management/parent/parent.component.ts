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
    
      parentFormFields = signal<FormField[]>(NEW_PARENT_FORM_JSON);
    
      constructor(private parentService: ParentService, private uiService: UiService) { }
    
      ngOnInit(): void {
        this.loadCrewService();
      }
    
    
      async loadCrewService() {
        await this.operateCrewList();
      }
    
    
      async operateCrewList() {
        try {
          const data: IParent[] = await this.parentService.getParentList();
          this.tableData = data;
        } catch (error) {
          this.uiService.showToast('error', 'Error', 'Failed to fetch crew list');
        }
      }
    
      handleNewCrew() {
        this.uiService.openDrawer(this.createParentContent, "Parent Management");
    
      }
    
      async handleFormSubmit(formData: FormData): Promise<void> {
        console.log('Form submitted:', formData);
        try {
          const response = await this.parentService.createParent(formData as IMutateParent);
          console.log(response);
          this.uiService.closeDrawer();
          this.uiService.showToast('success', 'Success', 'Crew created successfully');
          this.loadCrewService();
        } catch (error: any) {
          console.log(error);
          this.uiService.showToast('error', 'Error', 'Failed to create crew');
        }
      }
}
