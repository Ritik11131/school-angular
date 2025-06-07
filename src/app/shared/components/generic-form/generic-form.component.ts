import { Component, Input, type OnInit, signal, computed, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ButtonModule } from "primeng/button"
import { InputTextModule } from "primeng/inputtext"
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from "primeng/radiobutton"
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { GenericDropdownComponent } from "../generic-dropdown/generic-dropdown.component"


export interface FormField {
  label: string
  name: string
  placeholder: string
  type: string
  isRequired?: boolean
  validate?: (value: string) => string | null
  options?: { label: string; name: string }[]
  date?: {
    minDate?: Date
    maxDate?: Date
    showIcon?: boolean
    selectionMode?: any;
    dateFormat?: any; // For date fields
  },
  dropdown?: {
    apiEndpoint?: string // API endpoint for fetching options
    params?: any // Parameters for the API call
    dependsOn?: string // Field name that this field depends on
    autoFetch?: boolean // Whether to fetch options automatically
    optionLabel?: string // Label for the dropdown options
  }
}


export type FormData = {
  [K in string]: any;
}


@Component({
  selector: 'app-generic-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, RadioButtonModule, InputNumberModule, SliderModule, DatePickerModule,GenericDropdownComponent, TagModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit {
  @Input() set fields(value: FormField[]) {
    this.formFields.set(value);
  }

  @Input() set editObj(value: FormData | null) {
    console.log('Setting editObj:', value);
    this._editObj = value;
    if (this.form) {
      this.patchForm();
    }
  }

  @Input() editMode = false;

  private _editObj: FormData | null = null;

  @Output() formSubmit = new EventEmitter<FormData>();

  formFields = signal<FormField[]>([])
  form!: FormGroup
  submitButtonText = signal("Save");
  sliderValue: number = 0
  dropdownParams: { [key: string]: any } = {};

  constructor(private formbuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    const formGroup: any = {};

    this.formFields().forEach((field) => {
      const defaultValue = this._editObj?.[field.name] ?? '';
      formGroup[field.name] = [defaultValue, field.isRequired ? Validators.required : []];
    });

    this.form = this.formbuilder.group(formGroup);
    
    // Setup dependent dropdowns after form is created
    if (this._editObj) {
      this.patchForm();
    }
  }

  patchForm() {
    console.log('Patching form with edit object:', this._editObj);
    
    if (this._editObj) {
      this.form.patchValue(this._editObj);
      this.setupDependentDropdowns();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.formSubmit.emit(this.form.value as FormData);
    } else {
      this.form.markAllAsTouched()
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName)
    if (control?.errors) {
      const field = this.formFields().find((f) => f.name === fieldName)
      if (field) {
        return field.validate ? field.validate(control.value || '') || "" : ""
      }
    }
    return "";
  }

  onDropdownSelect(selectedValue: any, fieldId: string) {
    // Set form value - store the complete selected object
    this.form.get(fieldId)?.setValue(selectedValue);

    // Handle dependent dropdowns
    this.updateDependentFields(fieldId, selectedValue);
  }

  updateDependentFields(fieldId: string, selectedValue: any) {
    console.log('Updating dependent fields for:', fieldId, 'with value:', selectedValue);

    let paramValue: any = null;

    if (selectedValue) {
      // Handle different object structures
      if (typeof selectedValue === 'object') {
        paramValue = selectedValue.id || selectedValue.value;
      } else {
        paramValue = selectedValue;
      }
    }

    // Find fields that depend on this field
    this.formFields().forEach((field) => {
      if (field.dropdown?.dependsOn === fieldId) {
        // Reset the dependent form control
        this.form.get(field.name)?.reset();

        // Set API params for the dependent dropdown
        if (paramValue) {
          this.dropdownParams[field.name] = { [fieldId]: paramValue };
        } else {
          // Clear params when parent value is cleared
          this.dropdownParams[field.name] = {};
        }

        // Clear any nested dependents recursively
        this.updateDependentFields(field.name, null);
      }
    });
  }

  private setupDependentDropdowns() {
    console.log('Setting up dependent dropdowns with editObj:', this._editObj);
    
    this.formFields().forEach((field) => {
      console.log('Processing field:', field.name, 'type:', field.type);
      
      if (field.type === 'dropdown' && field?.dropdown?.dependsOn) {
        const parentField = field.dropdown.dependsOn;
        console.log('Found dependent dropdown:', field.name, 'depends on:', parentField);
        
        if (this._editObj && this._editObj[parentField]) {
          // Extract the parent value - handle both object and primitive types
          let parentValue: any = this._editObj[parentField];
          console.log('Parent value before processing:', parentValue);
          
          if (typeof parentValue === 'object' && parentValue !== null) {
            parentValue = parentValue.id || parentValue.value || parentValue;
          }
          
          console.log('Parent value after processing:', parentValue);
          
          // Set the dropdown parameters for this dependent field
          this.dropdownParams[field.name] = parentValue ? { [parentField]: parentValue } : {};
          console.log('Set dropdown params for', field.name, ':', this.dropdownParams[field.name]);
        }
      }
    });

    console.log("Final Dropdown Params:", this.dropdownParams);
  }
}