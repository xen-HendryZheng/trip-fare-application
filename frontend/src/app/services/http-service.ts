import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private apiEndpoint: string = environment.baseUrl;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
			'Access-Control-Allow-Origin': '*'
        })
    };

    constructor(
        private router: Router,
        public httpClient: HttpClient
    ) {
        this.apiEndpoint = environment.baseUrl;
    }

    /* PRIVATE METHOD */
    private setParams(obj: any) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };

    private extractData(res: any) {
        return res || {};
    }
    private handleError(error: Response | any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error);
    }

    postRequest(url: string, params: any, httpOptions?: any): Observable<any> {
        const httpOptionsParam = httpOptions || this.httpOptions;
        return this.httpClient.post(this.apiEndpoint + url, params, httpOptionsParam);
    }
    postRequestRaw(url: string, params: any) {
        return this.httpClient.post<any>(url, params, this.httpOptions);
    }

    getRequest(url: string, params: any): Observable<any> {
        let requestUrl = this.apiEndpoint + url + '?' + this.setParams(params);
        return this.httpClient.get<any>(requestUrl, this.httpOptions);
    }

    getRequestRaw(url: string, params?: any): Observable<any> {
        let requestUrl = url + '?' + this.setParams(params);
        return this.httpClient.get<any>(requestUrl, this.httpOptions);
    }

    putRequest(url: string, params: any) {
        let requestUrl = this.apiEndpoint + url;
        return this.httpClient.put<any>(requestUrl, params, this.httpOptions);
    }
    patchRequest(url: string, params: any) {
        let requestUrl = this.apiEndpoint + url;
        return this.httpClient.patch<any>(requestUrl, params, this.httpOptions);
    }
    deleteRequest(url: string, params: any) {
        let requestUrl = this.apiEndpoint + url;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }), body: params
        };
        return this.httpClient.delete<any>(requestUrl, httpOptions);
    }
}