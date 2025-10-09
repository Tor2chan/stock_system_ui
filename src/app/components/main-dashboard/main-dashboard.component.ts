import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  imports: [TranslateModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss'
})
export class MainDashboardComponent {
  constructor(private router: Router) { }
  goToAddDashboard() {
    this.router.navigate(['/add-dashboard']);
  }

}
