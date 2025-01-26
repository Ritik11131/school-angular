import { CrewService } from './../../../../core/services/crew.service';
import { Component, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { crewTableConfig } from '@/app/shared/config/table.config';
import { ICrew, IMutateCrew } from '@/app/shared/interfaces/crew.interfaces';
import { UiService } from '@/app/core/services/ui.service';
import { FormData, FormField, GenericFormComponent } from '@/app/shared/components/generic-form/generic-form.component';
import { NEW_CREW_FORM_JSON } from '@/app/shared/constants/crew';

@Component({
  selector: 'app-crew',
  imports: [GenericTableComponent, GenericFormComponent],
  templateUrl: './crew.component.html',
  styleUrl: './crew.component.css'
})
export class CrewComponent implements OnInit {
  @ViewChild("createCrewContent") createCrewContent!: TemplateRef<any>;

  tableConfig: TableConfig = crewTableConfig;
  tableData: ICrew[] = [];
  loading: boolean = false;
  crewFormFields = signal<FormField[]>(NEW_CREW_FORM_JSON);

  constructor(private crewService: CrewService, private uiService: UiService) { }

  ngOnInit(): void {
    this.loadCrewService();
  }


  async loadCrewService() {
    await this.operateCrewList();
  }


  async operateCrewList() {
    this.loading = true;
    try {
      const data: ICrew[] = await this.crewService.getCrewList();
      this.tableData = data.map((crew: ICrew) => ({
        ...crew,
        role: [
          crew.isPilot ? 'Pilot' : null,
          crew.isHelper ? 'Helper' : null,
          crew.isTeacher ? 'Teacher' : null,
        ].filter(Boolean).join(', ') || 'Unassigned' // Join roles or set to 'No Role' if none
      }));
      this.loading = false;
    } catch (error) {
      this.uiService.showToast('error', 'Error', 'Failed to fetch crew list');
      this.loading = false;
    }
  }

  handleNewCrew() {
    this.uiService.openDrawer(this.createCrewContent, "Crew Management");

  }

  async handleFormSubmit(formData: FormData): Promise<void> {
    console.log('Form submitted:', formData);
    const { name, email, username, contactNumber, address, role, licenseNumber, emergencyContact } = formData;
    try {
      const payload: IMutateCrew = {
        isPilot: role === "pilot",
        isHelper: role === "helper",
        isTeacher: role === "teacher",
        attributes: {
          licenseNumber,
          emergencyContact,
        },
        name,
        email,
        contactNumber,
        username,
        address,
      };
      const response = await this.crewService.createCrew(payload);
      console.log(response);
      this.uiService.closeDrawer();
      this.uiService.showToast('success', 'Success', 'Crew created successfully');
      this.loadCrewService();
    } catch (error) {
      this.uiService.showToast('error', 'Error', 'Failed to create crew');
    }
  }

}
