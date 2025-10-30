import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductData } from '../models/product-data';
import { GlobalService } from './global.service';
import { inject, Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { ResponseListIf,ResponseOneIf } from '../common/common';


@Injectable({ providedIn: 'root' })
export class ProductService  {
    private readonly baseService: string = 'product';
    constructor(
        private readonly http: HttpClient,
        private readonly globalService: GlobalService
    ) {}

    findProduct(productData: ProductData): Observable<ResponseListIf<ProductData>> {
            return this.http.post<ResponseListIf<ProductData>>(
                this.globalService.joinApi([this.baseService, 'find-product']),
                productData
            );
        }

    findProductDetail(productData: ProductData): Observable<ResponseListIf<ProductData>> {
            return this.http.post<ResponseListIf<ProductData>>(
                this.globalService.joinApi([this.baseService, 'find-product-detail']),
                productData
            );
        }

    saveProduct(productData: ProductData): Observable<ResponseListIf<ProductData>> {
                return this.http.post<ResponseListIf<ProductData>>(
                    this.globalService.joinApi([this.baseService, 'save-product']),
                   productData
                );
            }
        
    deleteProduct(id: number): Observable<ResponseOneIf<ProductData>> {
                this.globalService.validatePathTraversal(id);
                return this.http.delete<ResponseOneIf<ProductData>>(
                    this.globalService.joinApi([this.baseService, 'delete-product', id])
                );
            }
 


            withdrawProduct(productdata: ProductData): Observable<ResponseListIf<ProductData>> {
        this.globalService.validatePathTraversal(productdata.id);
        return this.http.put<ResponseListIf<ProductData>>(
            this.globalService.joinApi([this.baseService, 'withdraw-product', productdata.id!]),
            productdata
        );
    }

}
