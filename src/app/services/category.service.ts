import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryData } from '../models/catagory-data';
import { GlobalService } from './global.service';
import { inject, Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { ResponseListIf,ResponseOneIf } from '../common/common';


@Injectable({ providedIn: 'root' })
export class CategoryService  {
    private readonly baseService: string = 'category';
    constructor(
        private readonly http: HttpClient,
        private readonly globalService: GlobalService
    ) {}

    findCategory(categoryData: CategoryData): Observable<ResponseListIf<CategoryData>> {
        return this.http.post<ResponseListIf<CategoryData>>(
            this.globalService.joinApi([this.baseService, 'find-category']),
           categoryData
        );
    }


    saveCategory(categoryData: CategoryData): Observable<ResponseListIf<CategoryData>> {
        return this.http.post<ResponseListIf<CategoryData>>(
            this.globalService.joinApi([this.baseService, 'create-category']),
           categoryData
        );
    }

 
}
