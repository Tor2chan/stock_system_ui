import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StockSearchComponent } from './components/main/stock/stock-search/stock-search.component';
import { StockManageComponent } from './components/main/stock/stock-manage/stock-manage.component';
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
     
{path:'stock-search',component:StockSearchComponent},
{path:'stock-manage-create',component:StockManageComponent},
{path:'stock-manage-edit/:id',component:StockManageComponent},
    
      { path: 'settings', component: SettingsComponent },
    
      { path: 'category-search', component: CategorySearchComponent },
      { path: 'category-create', component: CategoryManageComponent },
      { path: 'category-edit/:id', component: CategoryManageComponent },
      { path: 'user', component: UserComponent },

    

    ]
  },
  { path: '**', redirectTo: '' }
];

