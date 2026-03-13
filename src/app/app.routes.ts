import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { StockDetailManageComponent } from './components/main/stock/stock-detail/stock-detail-manage/stock-detail-manage.component';
import { StockDetailSearchComponent } from './components/main/stock/stock-detail/stock-detail-search/stock-detail-search.component';
import { StockMainManageComponent } from './components/main/stock/stock-main/stock-main-manage/stock-main-manage.component';
import { StockMainSearchComponent } from './components/main/stock/stock-main/stock-main-search/stock-main-search.component';
import { CategoryManageComponent } from './components/main/category/category-manage/category-manage.component';
import { CategorySearchComponent } from './components/main/category/category-search/category-search.component';
import { LoginComponent } from './components/users/login/login.component';
import { AddUserComponent } from './components/users/manage-user/add-user/add-user.component';
import { EditUserComponent } from './components/users/manage-user/edit-user/edit-user.component';
import { DashboardSearchComponent } from './components/main/stock/dashboard/dashboard-search/dashboard-search.component';
import { AuthGuard } from './guards/auth.guard';
import { ReportComponent } from './components/main/report/report/report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '', component: LayoutMainComponent, canActivate: [AuthGuard],  
    children: [
      { path: 'category-search', component: CategorySearchComponent },
      { path: 'category-create', component: CategoryManageComponent },
      { path: 'category-edit/:id', component: CategoryManageComponent },
      { path: 'stock-main-search', component: StockMainSearchComponent },
      { path: 'stock-main-manage-create', component: StockMainManageComponent },
      { path: 'stock-main-manage-edit/:id', component: StockMainManageComponent },
      { path: 'add-user-create', component: AddUserComponent },
      { path: 'add-user-edit/:id', component: AddUserComponent },
      { path: 'stock-detail-search/:id', component: StockDetailSearchComponent },
      { path: 'stock-detail-manage-create/:id', component: StockDetailManageComponent },
      { path: 'stock-detail-manage-edit/:id', component: StockDetailManageComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'edit-user', component: EditUserComponent },
      { path: 'stock-main-dashboard', component: DashboardSearchComponent },
      { path: 'report', component: ReportComponent}
     


    ]
  },

  { path: '**', redirectTo: 'login' }
];
