import { HttpService } from '@/app/core/services/http.service';
import { ParentService } from '@/app/core/services/parent.service';
import { UiService } from '@/app/core/services/ui.service';
import { FormData, FormField, GenericFormComponent } from '@/app/shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '@/app/shared/components/generic-table/generic-table.component';
import { parentTableConfig } from '@/app/shared/config/table.config';
import { SAMPLE_FILE_ENDPOINT, SAMPLE_FILENAME } from '@/app/shared/constants/endpoint';
import { NEW_PARENT_FORM_JSON } from '@/app/shared/constants/parent';
import { IMutateParent, IParent } from '@/app/shared/interfaces/parent.interfaces';
import { IMutateRoute } from '@/app/shared/interfaces/route.interfaces';
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
  editObj: IMutateParent | null = null;
  parentFormFields = signal<FormField[]>(NEW_PARENT_FORM_JSON);

  constructor(private parentService: ParentService, private uiService: UiService,private httpService:HttpService) { }

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

  handleEditParent(parent: IParent) {
    console.log(parent);
    const {id, name, registeredMobileNo} = parent;
    this.editObj = {
      id,
      name,
      registeredMobileNo,
    }
    this.uiService.openDrawer(this.createParentContent, "Edit Parent");
  }

  async handleFormSubmit(formData: FormData): Promise<void> {
    console.log('Form submitted:', formData);

    if (this.editObj) {
      try {
        const response = await this.parentService.updateParent(this.editObj.id, { id:this.editObj?.id, ...formData, attribute: JSON.stringify({}) } as IMutateParent);
        console.log(response);
        this.uiService.closeDrawer();
        this.uiService.showToast('success', 'Success', 'Parent updated successfully');
        this.loadParentService();
      } catch (error: any) {
        console.log(error);
        this.uiService.showToast('error', 'Error', 'Failed to update parent');
      }
    } else {
      try {
        const response = await this.parentService.createParent({ ...formData, attribute: JSON.stringify({}) } as IMutateParent);
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


  /**
   * Handles file upload.
   *
   * @param event The file input change event.
   */
  async onFileUpload(event: any): Promise<void> {
    if (event.currentFiles && event.currentFiles.length > 0) {
      const file = event.currentFiles[0];

      this.uiService.showToast('info', 'Info', 'Uploading file...');

      try {
        const response = await this.httpService.uploadFile('bulk/parents/create', file);
        this.uiService.showToast('success', 'Success', 'File uploaded successfully');
        console.log('Upload response:', response);
      } catch (error) {
        this.uiService.showToast('error', 'Error', 'Failed to upload file');
        console.error('Upload failed:', error);
      }
    }
  }


  /**
     * Handles toolbar custom action clicks.
     *
     * @param action - The action object containing the action type.
     */
  async handleToolbarCustomActionClicked(action : { action:any; event?:any  }): Promise<void> {
    console.log('Toolbar custom action clicked:', action);

    switch (action.action) {
      case 'download_sample_file':
        await this.handleSampleOperation();
        break;
      case 'upload_sample_file':
        await this.onFileUpload(action.event);
        break;
      default:
        console.warn('Unknown action:', action.action);
        break;
    }
  }

  /**
   * Handles the sample file download operation.
   */
  private async handleSampleOperation(): Promise<void> {
    this.uiService.showToast('info', 'Info', 'Exporting Sample Data...');

    try {
      await this.httpService.downloadFile(SAMPLE_FILE_ENDPOINT, SAMPLE_FILENAME);
      this.uiService.showToast('success', 'Success', 'Sample file downloaded successfully');
    } catch (error) {
      console.error('Failed to download sample file:', error);
      this.uiService.showToast('error', 'Error', 'Failed to download sample file');
    }
  }

  


}
