import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { WithdrawalService } from '../../../../services/withdrawal.service';
import { ProductData } from '../../../../models/product-data';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TranslateModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  allItems: ProductData[] = [];
  filteredItems: ProductData[] = [];
  categories: string[] = [];

  filterKeyword = '';
  filterCategory = '';
  filterDateFrom = '';
  filterDateTo = '';

  currentPage = 1;
  pageSize = 15;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  }

  get paginatedItems(): ProductData[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  get totalWithdrawnAmount(): number {
    return this.filteredItems.reduce((sum, i) => sum + ((i as any).withdrawAmount ?? 0), 0);
  }

  get totalWithdrawnValue(): number {
    return this.filteredItems.reduce((sum, i) =>
      sum + (((i as any).withdrawAmount ?? 0) * ((i as any).withdrawPrice ?? 0)), 0);
  }

  min = Math.min;

  constructor(private withdrawalService: WithdrawalService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    const payload: any = { keyword: null, category: null, dateFrom: null, dateTo: null, size: 9999, first: 0 };
    this.withdrawalService.findWithdrawalHistory(payload).subscribe(({ status, entries }) => {
      if (status === 200) {
        this.allItems = entries as ProductData[];
        this.categories = [...new Set(this.allItems.map((i: any) => i.categoryName ?? ''))].filter(Boolean);
        this.applyFilter();
      }
    });
  }

  search() { this.currentPage = 1; this.applyFilter(); }

  clearFilter() {
    this.filterKeyword = '';
    this.filterCategory = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.allItems];
    if (this.filterKeyword.trim()) {
      const kw = this.filterKeyword.trim().toLowerCase();
      result = result.filter((i: any) =>
        i.productName?.toLowerCase().includes(kw) || i.sku?.toLowerCase().includes(kw)
      );
    }
    if (this.filterCategory) result = result.filter((i: any) => i.categoryName === this.filterCategory);
    if (this.filterDateFrom) {
      const from = new Date(this.filterDateFrom);
      result = result.filter((i: any) => i.withdrawDate && new Date(i.withdrawDate) >= from);
    }
    if (this.filterDateTo) {
      const to = new Date(this.filterDateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((i: any) => i.withdrawDate && new Date(i.withdrawDate) <= to);
    }
    this.filteredItems = result;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // ── Export CSV ─────────────────────────────────────
  exportCSV() {
    const headers = ['#', 'ชื่อสินค้า', 'SKU', 'หมวดหมู่', 'จำนวนที่เบิก', 'ราคา (บาท)', 'วันที่เบิก', 'ผู้เบิก'];
    const rows = this.filteredItems.map((item: any, i) => [
      i + 1, item.productName ?? '', item.sku ?? '', item.categoryName ?? '',
      item.withdrawAmount ?? 0, item.withdrawPrice ?? 0,
      item.withdrawDate ? new Date(item.withdrawDate).toLocaleDateString('th-TH') : '',
      item.withdrawBy ?? ''
    ]);
    const csvContent = [headers, ...rows].map(row => row.map((cell: any) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `withdrawal-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ── Export PDF แบบใบเสร็จเรียบๆ ───────────────────
  exportPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dateRange = this.filterDateFrom || this.filterDateTo
      ? `${this.filterDateFrom || '-'}  to  ${this.filterDateTo || '-'}`
      : 'All dates';

    // ── หัวรายงาน ──────────────────────────────────
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EasyStock', pageW / 2, 18, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Withdrawal History Report', pageW / 2, 25, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Printed: ${today}`, pageW / 2, 31, { align: 'center' });
    if (this.filterCategory) doc.text(`Category: ${this.filterCategory}`, pageW / 2, 36, { align: 'center' });
    doc.text(`Period: ${dateRange}`, pageW / 2, this.filterCategory ? 41 : 36, { align: 'center' });

    // เส้นคั่น
    const lineY = this.filterCategory ? 45 : 40;
    doc.setDrawColor(180);
    doc.line(14, lineY, pageW - 14, lineY);

    // ── ตาราง (ไม่มีสี เรียบๆ) ─────────────────────
    doc.setTextColor(0);
    autoTable(doc, {
      startY: lineY + 4,
      head: [['#', 'Product Name', 'SKU', 'Category', 'Qty', 'Price', 'Date', 'By']],
      body: this.filteredItems.map((item: any, i) => [
        i + 1,
        item.productName ?? '',
        item.sku ?? '',
        item.categoryName ?? '-',
        item.withdrawAmount ?? 0,
        Number(item.withdrawPrice ?? 0).toFixed(2),
        item.withdrawDate
          ? new Date(item.withdrawDate).toLocaleDateString('en-GB')
          : '',
        item.withdrawBy ?? ''
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: 0,
       lineColor: 255, 
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: false as any,
        textColor: 0,
        fontStyle: 'bold',
        lineColor: 0,
        lineWidth: 0
      },
      alternateRowStyles: { fillColor: false as any },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        4: { halign: 'right', cellWidth: 12 },
        5: { halign: 'right', cellWidth: 20 },
        6: { cellWidth: 22 },
      },
      margin: { left: 14, right: 14 }
    });

    // ── สรุปด้านล่าง ───────────────────────────────
    const finalY = (doc as any).lastAutoTable.finalY + 6;

    doc.setDrawColor(180);
    doc.line(14, finalY, pageW - 14, finalY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);

    // ซ้าย
    doc.text(`Total records : ${this.filteredItems.length}`, 14, finalY + 7);
    doc.text(`Total qty     : ${this.totalWithdrawnAmount}`, 14, finalY + 13);

    // ขวา
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Total value : ${this.totalWithdrawnValue.toFixed(2)} THB`,
      pageW - 14, finalY + 7,
      { align: 'right' }
    );

    // เส้นปิดท้าย
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(180);
    doc.line(14, finalY + 18, pageW - 14, finalY + 18);

    // footer
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text('EasyStock', pageW / 2, finalY + 23, { align: 'center' });

    doc.save(`withdrawal-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}