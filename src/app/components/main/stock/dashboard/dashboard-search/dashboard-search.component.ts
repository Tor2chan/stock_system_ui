import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ProductService } from '../../../../../services/product.service';
import { ProductData } from '../../../../../models/product-data';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, TranslateModule],
  templateUrl: './dashboard-search.component.html',
  styleUrl: './dashboard-search.component.scss'
})
export class DashboardSearchComponent implements OnInit {

  items: ProductData[] = [];
  
  totalProducts = 0;
  lowStock = 0;
  categoryCount = 0;

  chartData: any;

  constructor(
    private productService: ProductService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadDashboard();

    // ⭐ เปลี่ยนภาษาแล้ว chart เปลี่ยนตาม
    this.translate.onLangChange.subscribe(() => {
      this.buildChart();
    });
  }

  loadDashboard() {
    const criteria: ProductData = {
      size: 9999,
      first: 0
    };

    this.productService.findProduct(criteria).subscribe(({ status, entries, totalRecords }) => {
      if (status === 200) {
        this.items = entries as ProductData[];
        this.totalProducts = this.items.length;

        this.lowStock = this.items.filter(i => (i.sumAmount ?? 0) < 10).length;

        const categories = new Set(this.items.map(i => i.categoryName));
        this.categoryCount = categories.size;

        this.buildChart(); // ⭐ เรียกตรงนี้
      }
    });
  }

  buildChart() {
    const categories = new Set(this.items.map(i => i.categoryName));

    this.chartData = {
      labels: [...categories],
      datasets: [
        {
          label: this.translate.instant('main.dashboard.dashboardsearch.totalProducts'),
          data: [...categories].map(cat =>
            this.items.filter(i => i.categoryName === cat).length
          )
        }
      ]
    };
  }
}