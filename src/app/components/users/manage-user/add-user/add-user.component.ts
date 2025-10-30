import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MODE_PAGE } from '../../../../modules/common/common';
import { UsersData } from '../../../../models/users-data';
import { UsersService } from '../../../../services/users.service';
import { GlobalService } from '../../../../services/global.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-user',
  imports: [FormsModule, CardModule, CommonModule, InputTextModule, DropdownModule, InputNumberModule, ButtonModule, ToastModule, TranslateModule, InputSwitchModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {

  totalRecords: number = 0;
  rows: number = 5;
  currentTableData: UsersData[] = [];
      items: UsersData[] = []
      itemCategory: UsersData[] = [];
   
     criteria : UsersData =  {
       
     }

  mode: MODE_PAGE;
     params: string | null = null; 

  constructor(
        private router: Router,
      private globalService: GlobalService,
      private messageService: MessageService,
    
      private translate: TranslateService,
      private loaderService: NgxUiLoaderService,
     private route: ActivatedRoute,
      private usersService: UsersService,
  ) {
    this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'create';
  }

ngOnInit() {
      this. params = this.route.snapshot.paramMap.get('id');
      console.log("params =", this.params)
      console.log('mode:', this.mode)

     
      
    }

 onSave(){
        this.loaderService.start();
        if (
            this.globalService.validate(this.criteria.name) ||
            this.globalService.validate(this.criteria.username) ||
            this.globalService.validate(this.criteria.password) ||
            this.globalService.validate(this.criteria.role ) ||
            this.globalService.validate(this.criteria.status ) 
           
            
          ){
            this.messageService.add({
                severity: 'warn',
                summary: 'เกิดข้อผิดพลาด',
                detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                life: 2000
            });
          this.loaderService.stop();
          }

          setTimeout(() => {
            this.usersService.saveUsers(this.criteria).subscribe(({ status, message }) => {
            if (status === 200) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'สำเร็จ',
                    detail: message,
                    life: 2000
                    
                  });
            this.router.navigate(['/edit-user']);
            this.loaderService.stop();
            } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'เกิดข้อผิดพลาด',
                    detail: message,
                    life: 2000
                  });
            this.loaderService.stop();
                  }
              });
        
          }, 1500);

      }

  onCancel() {
    this.router.navigate(['/edit-user']);
  }
}
