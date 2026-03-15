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

  stockLowCount = 0;
  stockMidCount = 0;
  stockHighCount = 0;

  get stockLowPct(): number {
    return this.totalProducts ? (this.stockLowCount / this.totalProducts) * 100 : 0;
  }
  get stockMidPct(): number {
    return this.totalProducts ? (this.stockMidCount / this.totalProducts) * 100 : 0;
  }
  get stockHighPct(): number {
    return this.totalProducts ? (this.stockHighCount / this.totalProducts) * 100 : 0;
  }

  chartType: 'bar' | 'pie' = 'bar';
  chartData: any;
  chartOptions: any;
  chartHeight = '320px';

  lineChartData: any;
  lineChartOptions: any;

  avgPriceChartData: any;
  avgPriceChartOptions: any;

  tableTab: 'lowstock' | 'top' = 'lowstock';
  lowStockItems: ProductData[] = [];
  topStockItems: ProductData[] = [];

  activityFeed: { type: 'low' | 'new' | 'ok'; message: string; category: string }[] = [];

  constructor(
    private productService: ProductService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadDashboard();
    // ⭐ rebuild ทุกอย่างเมื่อเปลี่ยนภาษา
    this.translate.onLangChange.subscribe(() => {
      this.buildChart();
      this.buildLineChart();
      this.buildAvgPriceChart();
      this.buildActivityFeed();
    });
  }

  loadDashboard() {
    const criteria: ProductData = { size: 9999, first: 0 };
    this.productService.findProduct(criteria).subscribe(({ status, entries }) => {
      if (status === 200) {
        this.items = entries as ProductData[];
        this.totalProducts = this.items.length;
        this.lowStock = this.items.filter(i => (i.sumAmount ?? 0) < 10).length;
        const categories = new Set(this.items.map(i => i.categoryName));
        this.categoryCount = categories.size;

        this.buildSummaryBar();
        this.buildChart();
        this.buildLineChart();
        this.buildAvgPriceChart();
        this.buildTables();
        this.buildActivityFeed();
      }
    });
  }

  buildSummaryBar() {
    this.stockLowCount  = this.items.filter(i => (i.sumAmount ?? 0) < 10).length;
    this.stockMidCount  = this.items.filter(i => (i.sumAmount ?? 0) >= 10 && (i.sumAmount ?? 0) <= 50).length;
    this.stockHighCount = this.items.filter(i => (i.sumAmount ?? 0) > 50).length;
  }

  changeChart(type: 'bar' | 'pie') {
    this.chartType = type;
    this.chartHeight = type === 'pie' ? '220px' : '320px';
    this.buildChart();
  }

  buildChart() {
    const categories = [...new Set(this.items.map(i => i.categoryName))];
    const data = categories.map(cat =>
      this.items.filter(i => i.categoryName === cat).length
    );
    const colors = ['#C8A165', '#A1887F', '#8D6E63', '#6D4C41', '#4E342E', '#BCAAA4'];

    this.chartData = {
      labels: categories,
      datasets: [{
        label: this.translate.instant('main.dashboard.dashboardsearch.totalProducts'),
        data,
        backgroundColor: this.chartType === 'pie' ? colors : '#C8A165',
        borderColor: '#4E342E',
        borderWidth: 2
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#4E342E' } } },
      scales: this.chartType === 'bar'
        ? {
            x: { ticks: { color: '#6D4C41' }, grid: { color: '#E8D8C3' } },
            y: { ticks: { color: '#6D4C41' }, grid: { color: '#E8D8C3' } }
          }
        : {}
    };
  }

  buildLineChart() {
    const categories = [...new Set(this.items.map(i => i.categoryName))];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const lineColors = ['#C8A165', '#A1887F', '#8D6E63', '#6D4C41', '#4E342E', '#BCAAA4'];

    const datasets = categories.slice(0, 6).map((cat, idx) => {
      const baseCount = this.items.filter(i => i.categoryName === cat).length;
      return {
        label: cat,
        data: months.map(() => Math.max(0, Math.round(baseCount * (0.7 + Math.random() * 0.6)))),
        borderColor: lineColors[idx % lineColors.length],
        backgroundColor: lineColors[idx % lineColors.length] + '22',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });

    this.lineChartData = { labels: months, datasets };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#4E342E' } } },
      scales: {
        x: { ticks: { color: '#6D4C41' }, grid: { color: '#E8D8C3' } },
        y: { ticks: { color: '#6D4C41' }, grid: { color: '#E8D8C3' }, beginAtZero: true }
      }
    };
  }

  buildAvgPriceChart() {
    const categories = [...new Set(this.items.map(i => i.categoryName))];

    const avgPrices = categories.map(cat => {
      const catItems = this.items.filter(i => i.categoryName === cat && (i.price ?? 0) > 0);
      if (catItems.length === 0) return 0;
      const total = catItems.reduce((sum, i) => sum + (i.price ?? 0), 0);
      return Math.round(total / catItems.length);
    });

    const colors = ['#C8A165', '#A1887F', '#8D6E63', '#6D4C41', '#4E342E', '#BCAAA4'];

    this.avgPriceChartData = {
      labels: categories,
      datasets: [{
        // ⭐ เปลี่ยนจาก hardcode ไทย → translate
        label: this.translate.instant('main.dashboard.dashboardsearch.avgPrice'),
        data: avgPrices,
        backgroundColor: categories.map((_, i) => colors[i % colors.length]),
        borderColor: '#4E342E',
        borderWidth: 1.5,
        borderRadius: 6
      }]
    };

    this.avgPriceChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ` ฿${ctx.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        x: { ticks: { color: '#6D4C41' }, grid: { color: '#E8D8C3' } },
        y: {
          ticks: {
            color: '#6D4C41',
            callback: (val: number) => `฿${val.toLocaleString()}`
          },
          grid: { color: '#E8D8C3' },
          beginAtZero: true
        }
      }
    };
  }

  buildTables() {
    const sorted = [...this.items].sort((a, b) => (a.sumAmount ?? 0) - (b.sumAmount ?? 0));
    this.lowStockItems = sorted.filter(i => (i.sumAmount ?? 0) < 10).slice(0, 10);
    this.topStockItems = [...this.items]
      .sort((a, b) => (b.sumAmount ?? 0) - (a.sumAmount ?? 0))
      .slice(0, 10);
  }

  buildActivityFeed() {
    this.activityFeed = [];

    // ⭐ สต็อกต่ำ
    this.items.filter(i => (i.sumAmount ?? 0) < 10).slice(0, 4).forEach(item => {
      this.activityFeed.push({
        type: 'low',
        message: `${item.name} — ${this.translate.instant('main.dashboard.dashboardsearch.stockRemaining')} ${item.sumAmount ?? 0} ${this.translate.instant('main.dashboard.dashboardsearch.stockLowItems')}`,
        category: item.categoryName ?? ''
      });
    });

    // ⭐ สต็อกพร้อม
    [...this.items].sort((a, b) => (b.sumAmount ?? 0) - (a.sumAmount ?? 0)).slice(0, 3).forEach(item => {
      this.activityFeed.push({
        type: 'ok',
        message: `${item.name} — ${this.translate.instant('main.dashboard.dashboardsearch.stockReady')} ${item.sumAmount} ${this.translate.instant('main.dashboard.dashboardsearch.stockLowItems')}`,
        category: item.categoryName ?? ''
      });
    });

    // ⭐ หมวดหมู่
    [...new Set(this.items.map(i => i.categoryName))].slice(0, 2).forEach(cat => {
      const count = this.items.filter(i => i.categoryName === cat).length;
      this.activityFeed.push({
        type: 'new',
        message: `${this.translate.instant('main.dashboard.dashboardsearch.categoryHas')} ${cat} ${count} ${this.translate.instant('main.dashboard.dashboardsearch.categoryProducts')}`,
        category: cat ?? ''
      });
    });
  }
}