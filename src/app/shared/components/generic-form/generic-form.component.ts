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

export interface FormField {
  label: string
  name: string
  placeholder: string
  type: string
  isRequired?: boolean
  validate?: (value: string) => string | null
  options?: { label: string; name: string }[]
}


export type FormData = {
  [K in string]: any;
}


@Component({
  selector: 'app-generic-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, RadioButtonModule, InputNumberModule, SliderModule, TagModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit {
  @Input() set fields(value: FormField[]) {
    this.formFields.set(value);
  }

  @Output() formSubmit = new EventEmitter<FormData>();

  formFields = signal<FormField[]>([])
  form!: FormGroup
  submitButtonText = signal("Save");
  sliderValue: number = 0

  constructor(private formbuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    const formGroup: any = {}
    this.formFields().forEach((field) => {
      formGroup[field.name] = ["", field.isRequired ? Validators.required : []]
    })
    this.form = this.formbuilder.group(formGroup)
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.formSubmit.emit(this.form.value as FormData);
      // Here you would typically send the form data to your backend
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
}
