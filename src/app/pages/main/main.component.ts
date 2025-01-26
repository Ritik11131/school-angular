import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { moreSidebarNavigations, sidebarNavigations } from '@/app/shared/constants/sidebar';
import { GenericDrawerComponent } from '@/app/shared/components/generic-drawer/generic-drawer.component';
import { UiService } from '@/app/core/services/ui.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, ToastModule, DividerModule, SelectModule, MultiSelectModule,
    AvatarModule, RouterModule, FormsModule, TooltipModule, OverlayBadgeModule, DrawerModule,GenericDrawerComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  @ViewChild("settingsContent") settingsContent!: TemplateRef<any>;
  

  selectedSampleOption: any;
  sampleAppsSidebarNavs: any = sidebarNavigations;
  sampleAppsSidebarNavsMore: any = moreSidebarNavigations;
  selectedSampleAppsSidebarNav: any = 'Device';
  isSlimMenu: boolean = true;

  constructor(private router: Router, public uiService:UiService,private authService:AuthService) {
    const lastSelectedNav = localStorage.getItem('lastSelectedNav')?.split(',');
    this.setSelectedSampleAppsSidebarNav(lastSelectedNav?.[0] || 'Overview', lastSelectedNav?.[1] || '/main/dashboard');
  }

  setSelectedSampleAppsSidebarNav(title: any, href: string) {
    localStorage.setItem('lastSelectedNav', [title, href].join(','));
    this.selectedSampleAppsSidebarNav = title;
    this.router.navigate([href])
  }

  handleMoreNavClick(event: any) {
    this.uiService.openDrawer(this.settingsContent, "Settings & More");
  }

  handleLogOut(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
