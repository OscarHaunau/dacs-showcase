import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ITestResponse } from '../models/iresponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {

    }
   getPing() {
        const url = `${environment.backendForFrontendUrl}/ping`;
        return this.http
            .get(url, { responseType: 'text' })
            .pipe();
    }
  
    getTest() {
        const url ='assets/test.json';
        return this.http
            .get<ITestResponse>(url, this.headers)
            .pipe();
    }
    get headers() {
        return {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

}
