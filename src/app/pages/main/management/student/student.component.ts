import { StudentService } from '@/app/core/services/student.service';
import { UiService } from '@/app/core/services/ui.service';
import { FormData, FormField, GenericFormComponent } from '@/app/shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '@/app/shared/components/generic-table/generic-table.component';
import {  studentTableConfig } from '@/app/shared/config/table.config';
import { NEW_STUDENT_FORM_JSON } from '@/app/shared/constants/student';
import { IMutateStudent, IStudent } from '@/app/shared/interfaces/student.interfaces';
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-student',
  imports: [GenericTableComponent, GenericFormComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {

  @ViewChild("createStudentContent") createStudentContent!: TemplateRef<any>;
  

  tableConfig: TableConfig = studentTableConfig;
  tableData: IStudent[] = [];
  loading: boolean = false;
  editObj: any = null;
  studentFormFields = signal<FormField[]>(NEW_STUDENT_FORM_JSON);

  constructor(private studentService: StudentService, private uiService: UiService) {}


  ngOnInit(): void {
    this.loadStudentService();
  }

  async loadStudentService() {
    await this.operateStudentList();
  }

   async operateStudentList() {
      this.loading = true;
      try {
        const data: IStudent[] = await this.studentService.getStudentList();
        this.tableData = data;
      } catch (error) {
        this.uiService.showToast('error', 'Error', 'Failed to fetch parent list');
      } finally {
        this.loading = false;
      }
    }

  handleNewStudent() {
    this.editObj = null;
    this.uiService.openDrawer(this.createStudentContent, "Student Management");
  }

  handleEditStudent(student: IStudent) {
    console.log(student, 'student');
    const { id, integrationId, studentName, section, registeredDate,pickupRoute,dropRoute,pickupStop,dropStop,plan } = student;
    this.editObj = {
      id,
      integrationId,
      studentName,
      section,
      registeredDate,
      fkPickupRoute: pickupRoute,
      fkDropRoute: dropRoute,
      fkPickupStopId: pickupStop,
      FkDropStopId: dropStop,
      fkPlanId: plan,
  }

   this.uiService.openDrawer(this.createStudentContent, "Edit Student");
}

  async handleToolbarCustomActionClicked(action: { action: any; event?: any }): Promise<void> {
      console.log('action', action);
  }

  async handleFormSubmit(formData: FormData): Promise<void> {
    try {
      if (this.editObj) {
        await this.studentService.updateStudent(this.editObj.id, {
          id: this.editObj.id,
          ...formData,
          attribute: JSON.stringify({})
        } as IMutateStudent);
        this.uiService.showToast('success', 'Success', 'Student updated successfully');
      } else {
        // Destructuring the necessary fields
        const {
          integrationId,
          studentName,
          section,
          registeredDate,
          fkPickupRoute: { id: fkPickupRoute },
          fkDropRoute: { id: fkDropRoute },
          fkPickupStopId: { id: fkPickupStopId },
          FkDropStopId: { id: FkDropStopId },
          fkPlanId: { id: fkPlanId }
        } = formData;

        const payload = {
          integrationId,
          studentName,
          section,
          registeredDate,
          fkPickupRoute,
          fkDropRoute,
          fkPickupStopId,
          FkDropStopId,
          fkPlanId,
          class: formData['class'], // Default to empty string if class is not provided
        };

        console.log(payload,'payload');
        await this.studentService.createStudent({
          ...payload,
          attribute: JSON.stringify({})
        } as IMutateStudent);
        this.uiService.showToast('success', 'Success', 'Parent created successfully');
      }
      this.resetState();
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', `Failed to ${this.editObj ? 'update' : 'create'} parent`);
    }
  }


   /**
     * Resets component state after successful actions.
     */
    private async resetState(): Promise<void> {
      this.editObj = null;
      this.studentFormFields.set(NEW_STUDENT_FORM_JSON); // reset form fields
      this.uiService.closeDrawer();                    // close drawer
      await this.loadStudentService();                  // refresh table
    }

}
