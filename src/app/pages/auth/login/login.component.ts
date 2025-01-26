import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UiService } from '@/app/core/services/ui.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule, ToastModule, DividerModule, RouterModule,
    CommonModule, PasswordModule, InputGroupModule, InputGroupAddonModule, IconFieldModule, InputIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  email: string = '9827786794';
  password: string = '123456';
  emailError: string = '';
  passwordError: string = '';
  captchaError: boolean = false;
  loading: boolean = false;
  captchaCode: string = '';
  userInput: string = '';
  isPasswordToggled: boolean = false;
  captchaImageClass: string = '';


  constructor(private authService: AuthService, private router: Router, private uiService:UiService) { }


  ngOnInit(): void {

  }




  // Disable copy-paste events
  disableEvent(event: any) {
    event.preventDefault();
  }

  async signIn(): Promise<any> {
    this.loading = true;
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/main/dashboard'])
    } catch (error: any) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }


  togglePassword() {
    this.isPasswordToggled = !this.isPasswordToggled;
  }


  onCaptchaInputChange(event: any) {
    this.captchaImageClass = event.target.value === this.captchaCode ? 'pi pi-check-circle text-green-600' : 'pi pi-times-circle text-red-600'
  }

}
