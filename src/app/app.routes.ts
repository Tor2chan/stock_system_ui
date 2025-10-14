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
import { ManageCategoryComponent } from './components/manage-stock/manage-category/manage-category.component';

export const routes: Routes = [
  {
    path: '', component: LayoutMainComponent,
    children: [
      { path: '', redirectTo: 'stock', pathMatch: 'full' },
      { path: 'main-dashboard', component: MainDashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'stock', component: StockComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'add-dashboard', component: AddDashboardComponent },
      { path: 'add-stock', component: AddStockComponent },
      {path: 'manage-category', component: ManageCategoryComponent},


      { path: 'dashboard', component: DashboardComponent },

    ]
  },
  { path: '**', redirectTo: '' }
];

