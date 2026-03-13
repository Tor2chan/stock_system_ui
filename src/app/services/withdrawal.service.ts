import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductData } from '../models/product-data';
import { GlobalService } from './global.service';
import { Injectable } from '@angular/core';
import { ResponseListIf } from '../common/common';
 
@Injectable({ providedIn: 'root' })
export class WithdrawalService {
    private readonly baseService: string = 'product';
 
    constructor(
        private readonly http: HttpClient,
        private readonly globalService: GlobalService
    ) {}
 
    findWithdrawalHistory(data: ProductData): Observable<ResponseListIf<ProductData>> {
        return this.http.post<ResponseListIf<ProductData>>(
            this.globalService.joinApi([this.baseService, 'find-withdrawal-history']),
            data
        );
    }
}
 