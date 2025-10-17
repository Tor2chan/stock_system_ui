import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { StockDetailManageComponent } from './components/main/stock/stock-detail/stock-detail-manage/stock-detail-manage.component';    
import { StockDetailSearchComponent } from './components/main/stock/stock-detail/stock-detail-search/stock-detail-search.component';
import { StockMainManageComponent } from './components/main/stock/stock-main/stock-main-manage/stock-main-manage.component';  
import { StockMainSearchComponent } from './components/main/stock/stock-main/stock-main-search/stock-main-search.component';  
import { CategoryManageComponent } from './components/main/category/category-manage/category-manage.component';
import { CategorySearchComponent } from './components/main/category/category-search/category-search.component';
import { LoginComponent } from './components/users/login/login.component';
import { RegisterComponent } from './components/users/register/register.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { UserComponent } from './components/users/user/user.component';

export const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'app-register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },


  {
    path: '', component: LayoutMainComponent,
    children: [
     

    
    
      { path: 'category-search', component: CategorySearchComponent },
      { path: 'category-create', component: CategoryManageComponent },
      { path: 'category-edit/:id', component: CategoryManageComponent },
      { path: 'user', component: UserComponent },
      { path: 'stock-main-search',component:StockMainSearchComponent},
      { path: 'stock-main-manage-create',component:StockMainManageComponent},
      { path: 'stock-main-manage-edit/:id',component:StockMainManageComponent},

      { path: 'stock-detail-search',component:StockDetailSearchComponent},
      { path: 'stock-detail-manage',component:StockDetailManageComponent}



    

    ]
  },
  { path: '**', redirectTo: '' }
];

