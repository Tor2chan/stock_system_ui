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
chartType: 'bar' | 'pie' = 'bar';
  chartData: any;
chartOptions: any;
chartHeight = '320px';
changeChart(type: 'bar' | 'pie') {
  this.chartType = type;
  this.chartHeight = type === 'pie' ? '220px' : '320px';

  this.buildChart();
}
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

  const categories = [...new Set(this.items.map(i => i.categoryName))];

  const data = categories.map(cat =>
    this.items.filter(i => i.categoryName === cat).length
  );

  const colors = [
    '#C8A165',
    '#A1887F',
    '#8D6E63',
    '#6D4C41',
    '#4E342E',
    '#BCAAA4'
  ];

  this.chartData = {
    labels: categories,
    datasets: [
      {
        label: this.translate.instant('main.dashboard.dashboardsearch.totalProducts'),
        data: data,
        backgroundColor: this.chartType === 'pie' ? colors : '#C8A165',
        borderColor: '#4E342E',
        borderWidth: 2
      }
    ]
  };

 this.chartOptions = {
  responsive: true,
  maintainAspectRatio: false,   // สำคัญมาก
  plugins: {
    legend: {
      labels: {
        color: '#4E342E'
      }
    }
  },
  scales: this.chartType === 'bar'
    ? {
        x: {
          ticks: { color: '#6D4C41' },
          grid: { color: '#E8D8C3' }
        },
        y: {
          ticks: { color: '#6D4C41' },
          grid: { color: '#E8D8C3' }
        }
      }
    : {}
};
}
}
