
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MODE_PAGE } from '../../../../modules/common/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-category-manage',
  providers: [MessageService,],
  imports: [TableModule, CommonModule,    FormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    ButtonModule,
    ToastModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.scss'
})
export class CategoryManageComponent  implements OnInit{

  mode: MODE_PAGE;

  item = [{ id:1, rowNum: 1, name:'one', code: '001' }]
    constructor(    private messageService: MessageService
)
     
    {
        this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
    }

    ngOnInit() {
      console.log('mode:', this.mode)
    }
 onSubmit() {
  }

  onCancel() {
}
}