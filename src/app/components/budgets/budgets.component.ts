import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { ButtonModule } from 'primeng/button';
  
@Component({
  selector: 'app-budgets',
  imports: [TranslateModule, ButtonModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent {

}
