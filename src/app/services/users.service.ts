import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersData } from '../models/users-data';
import { GlobalService } from './global.service';
import { inject, Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { ResponseListIf, ResponseOneIf } from '../common/common';



@Injectable({ providedIn: 'root' })
export class UsersService {
    private readonly baseService: string = 'users';
    constructor(
        private readonly http: HttpClient,
        private readonly globalService: GlobalService
    ) { }

    find(usersData: UsersData): Observable<ResponseListIf<UsersData>> {
        return this.http.post<ResponseListIf<UsersData>>(
            this.globalService.joinApi([this.baseService, 'find']),
            usersData
        );
    }
    findUsers(usersData: UsersData): Observable<ResponseListIf<UsersData>> {
        return this.http.post<ResponseListIf<UsersData>>(
            this.globalService.joinApi([this.baseService, 'find-users']),
            usersData
        );
    }

    findUsersDetail(usersData: UsersData): Observable<ResponseListIf<UsersData>> {
        return this.http.post<ResponseListIf<UsersData>>(
            this.globalService.joinApi([this.baseService, 'find-users-detail']),
            usersData
        );
    }

    saveUsers(usersData: UsersData): Observable<ResponseListIf<UsersData>> {
        return this.http.post<ResponseListIf<UsersData>>(
            this.globalService.joinApi([this.baseService, 'save-user']),
            usersData
        );
    }



}
