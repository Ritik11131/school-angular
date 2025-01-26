import { UiService } from '@/app/core/services/ui.service';
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-generic-drawer',
  imports: [CommonModule,DrawerModule,ButtonModule],
  templateUrl: './generic-drawer.component.html',
  styleUrl: './generic-drawer.component.css'
})
export class GenericDrawerComponent {

  @Input() isOpen = false;
  @Input() header = 'Default Header';
  @Input() contentTemplate: TemplateRef<any> | null = null

  constructor(private uiService: UiService) {}

  close() {
    this.uiService.closeDrawer()
  }

}
