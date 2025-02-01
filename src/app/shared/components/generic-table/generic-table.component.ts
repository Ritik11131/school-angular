import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { Table } from 'primeng/table';
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { TagSeverityPipe } from '@/app/core/pipes/table-pipes/tag-severity.pipe';
import { TagValuePipe } from '@/app/core/pipes/table-pipes/tag-value.pipe';


@Component({
  selector: 'app-generic-table',
  imports: [   
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    TagModule,
    TooltipModule,
    RatingModule,
    AvatarModule,
    IconFieldModule,
    InputIconModule,
    ChipModule,
    TagSeverityPipe,
    TagValuePipe
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css'
})
export class GenericTableComponent {

  @Input() loading:boolean = false;
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() globalFilterFields!: any[];
  @Input() title: string = '';
  @Input() showActions: boolean = true;
  @Input() showSummary: boolean = true;
  @Input() activeOnes = '';
  @Input() expandedRows: any = {}; // Expanded rows

  @Output() onNew = new EventEmitter<boolean>();
  // @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onDeleteSelected = new EventEmitter<any[]>();
  @Output() onImport = new EventEmitter<any>();
  @Output() onExport = new EventEmitter<void>();
  @Output() configActionClicked = new EventEmitter<{ action: string; item: any }>();
  @Output() nestedConfigActionClicked = new EventEmitter<{ action: string; item: any }>();
  @Output() toolbarCustomActionClicked = new EventEmitter<{ action: string; event?:any }>();
  @Output() rowExpand = new EventEmitter<any>(); // Event emitter for row expand
  @Output() rowCollapse = new EventEmitter<any>(); // Event emitter for row collapse

  @ViewChild('dt') table!: Table;

  selectedItems: any[] = [];



  onSearch(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;    
    if (input) {
      dt.filterGlobal(input.value, 'contains');
    }
  }

   // Handle row expand event
   onRowExpand(event: any) {
    this.rowExpand.emit(event);
  }

  // Handle row collapse event
  onRowCollapse(event: any) {
    this.rowCollapse.emit(event);
  }


  // Method to handle button clicks
  handleActionClick(action: string, item: any) : void {    
    this.configActionClicked.emit({ action, item });
  }

  handleNestedActionClick(action: string, item: any) : void {    
    this.nestedConfigActionClicked.emit({ action, item });
  }

  handleCustomToolbarActionClick(action: string, event?:any) : void {
    this.toolbarCustomActionClicked.emit({ action, event });
  }


}
