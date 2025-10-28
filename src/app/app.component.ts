import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
@Component({
  selector: 'app-root',
  imports: [RouterModule, ButtonModule, NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'finance_note';

  constructor(
    
  ){

  }
}
