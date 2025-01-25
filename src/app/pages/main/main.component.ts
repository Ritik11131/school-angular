import { Component } from '@angular/core';
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

@Component({
  selector: 'app-main',
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, ToastModule, DividerModule, SelectModule, MultiSelectModule,
    AvatarModule, RouterModule, FormsModule, TooltipModule, OverlayBadgeModule, DrawerModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {


  selectedSampleOption: any;
  sampleAppsSidebarNavs: any = sidebarNavigations;
  sampleAppsSidebarNavsMore: any = moreSidebarNavigations;
  selectedSampleAppsSidebarNav: any = 'Device';
  isSlimMenu: boolean = true;

  constructor(private router: Router) {
    const lastSelectedNav = localStorage.getItem('lastSelectedNav')?.split(',');
    this.setSelectedSampleAppsSidebarNav(lastSelectedNav?.[0] || 'Device', lastSelectedNav?.[1] || '/main/dashboard');
  }

  setSelectedSampleAppsSidebarNav(title: any, href: string) {
    localStorage.setItem('lastSelectedNav', [title, href].join(','));
    this.selectedSampleAppsSidebarNav = title;
    this.router.navigate([href])
  }
}
