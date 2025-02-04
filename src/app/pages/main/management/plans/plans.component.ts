import { Component, TemplateRef, ViewChild, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/components/generic-table/generic-table.component";
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { plansTableConfig } from '@/app/shared/config/table.config';
import { UiService } from '@/app/core/services/ui.service';
import { FormData, FormField, GenericFormComponent } from '@/app/shared/components/generic-form/generic-form.component';
import { IMutatePlan, IPlan } from '@/app/shared/interfaces/plans.interfaces';
import { PlansService } from '@/app/core/services/plans.service';
import { NEW_PLAN_FORM_JSON } from '@/app/shared/constants/plans';

@Component({
  selector: 'app-plans',
  imports: [GenericTableComponent, GenericFormComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent {

  @ViewChild("createPlanContent") createPlanContent!: TemplateRef<any>;
  
    tableConfig: TableConfig = plansTableConfig;
    tableData: IPlan[] = [];
    loading: boolean = false;
    planFormFields = signal<FormField[]>(NEW_PLAN_FORM_JSON);
  
    constructor(private planService: PlansService, private uiService: UiService) { }
  
    ngOnInit(): void {
      this.loadPlanService();
    }
  
  
    async loadPlanService() {
      await this.operatePlanList();
    }
  
  
    async operatePlanList() {
      this.loading = true;
      try {
        const data: IPlan[] = await this.planService.getPlansList();
        this.tableData = data
        this.loading = false;
      } catch (error) {
        this.uiService.showToast('error', 'Error', 'Failed to fetch plans list');
        this.loading = false;
      }
    }
  
    handleNewCrew() {
      this.uiService.openDrawer(this.createPlanContent, "Plan Management");
  
    }
  
    async handleFormSubmit(formData: FormData): Promise<void> {
      console.log('Form submitted:', formData);

      try {
        const response = await this.planService.createPlan(formData as IMutatePlan);
        console.log(response);
        this.uiService.closeDrawer();
        this.uiService.showToast('success', 'Success', 'Plan created successfully');
        this.loadPlanService();
      } catch (error) {
        this.uiService.showToast('error', 'Error', 'Failed to create plan');
      }
    }

}
