import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddDashboardComponent } from './components/main/add-dashboard/add-dashboard.component';
import { StockComponent } from './components/manage-stock/stock/stock.component';
import { AddStockComponent } from './components/manage-stock/add-stock/add-stock.component';
import { CategorySearchComponent } from './components/manage-stock/category/category-search/category-search.component';
import { CategoryManageComponent } from './components/manage-stock/category/category-manage/category-manage.component';
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
     

      { path: 'main-dashboard', component: MainDashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'stock', component: StockComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'add-dashboard', component: AddDashboardComponent },
      { path: 'add-stock', component: AddStockComponent },
      { path: 'category-search', component: CategorySearchComponent },
      { path: 'category-create', component: CategoryManageComponent },
      { path: 'category-edit/:id', component: CategoryManageComponent },
      { path: 'user', component: UserComponent },

      { path: 'dashboard', component: DashboardComponent },

    ]
  },
  { path: '**', redirectTo: '' }
];

