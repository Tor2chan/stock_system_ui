import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Router } from '@angular/router'; 
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';
import { ImageModule } from 'primeng/image';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenubarModule,
    SidebarModule,
    ButtonModule,
  
    TranslateModule,
    FooterComponent,
    ImageModule
  ]
})
export class LayoutMainComponent {
   sidebarCollapsed = false;
   visibleSidebar: boolean = false;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private authService:AuthService
  ) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translateService.setDefaultLang(savedLang);
    this.translateService.use(savedLang);
  }

  toggleLanguage() {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'en' ? 'th' : 'en';
    localStorage.setItem('language', newLang);
    window.location.reload();
  }
  goOutUser() {
    this.authService.removeToken(); 
    this.router.navigate(['/login']);
  }

  goToManageUser() {
    this.router.navigate(['/edit-user']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  ngOnInit() {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    if (window.innerWidth <= 864) {
      this.sidebarCollapsed = true;
    } else {
      this.sidebarCollapsed = false;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }


 
    



}



