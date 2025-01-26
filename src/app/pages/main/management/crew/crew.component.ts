import { CrewService } from './../../../../core/services/crew.service';
import { Component, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { crewTableConfig } from '@/app/shared/config/table.config';
import { ICrew, IMutateCrew } from '@/app/shared/interfaces/crew.interfaces';
import { UiService } from '@/app/core/services/ui.service';
import { FormData, FormField, GenericFormComponent } from '@/app/shared/components/generic-form/generic-form.component';

@Component({
  selector: 'app-crew',
  imports: [GenericTableComponent, GenericFormComponent],
  templateUrl: './crew.component.html',
  styleUrl: './crew.component.css'
})
export class CrewComponent implements OnInit {
  @ViewChild("createCrewContent") createCrewContent!: TemplateRef<any>

  tableConfig: TableConfig = crewTableConfig;
  tableData: ICrew[] = [];

  crewFormFields = signal<FormField[]>([
    {
      label: "Name",
      name: "name",
      placeholder: "Enter your name",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
      label: "Username",
      name: "username",
      placeholder: "Enter your username",
      type: "text",
      isRequired: true,
      validate: (value: string) => {
        if (value.length < 3) {
          return "Username must be at least 3 characters long"
        }
        return null
      },
    },
    {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      type: "email",
      isRequired: true,
      validate: (value: string) => {
        const emailPattern = /\S+@\S+\.\S+/
        return !emailPattern.test(value) ? "Please enter a valid email" : null
      },
    },
    {
      label: "Contact No",
      name: "contactNumber",
      placeholder: "Enter your contact Number",
      type: "text",
      isRequired: true,
      validate: (value: string) => {
        return !/^\d{10}$/.test(value) ? "Contact number must be 10 digits" : null
      },
    },
    {
      label: "Emergency Contact No",
      name: "emergencyContact",
      placeholder: "Enter your no",
      type: "text",
      isRequired: true,
      validate: (value: string) => {
        return !/^\d{10}$/.test(value) ? "Contact number must be 10 digits" : null
      },
    },
    {
      label: "License No",
      name: "licenseNumber",
      placeholder: "Enter your license no",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "License No is required" : null),
    },
    {
      label: "Address",
      name: "address",
      placeholder: "Enter your address",
      type: "textarea",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Address is required" : null),
    },
    {
      label: "Role",
      name: "role",
      placeholder: "",
      type: "radio",
      options: [
        {
          label: "Pilot",
          name: "pilot",
        },
        {
          label: "Helper",
          name: "helper",
        },
        {
          label: "Teacher",
          name: "teacher",
        },
      ],
    },
  ])

  constructor(private crewService: CrewService, private uiService: UiService) { }

  ngOnInit(): void {
    this.loadCrewService();
  }


  async loadCrewService() {
    await this.operateCrewList();
  }


  async operateCrewList() {
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
    } catch (error) {
      this.uiService.showToast('error', 'Error', 'Failed to fetch crew list');
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
