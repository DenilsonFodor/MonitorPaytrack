import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { prestAPI } from '../../prest/prest.interface';


//const endpoint = `${environment.url}/v1/paytapi003`; 

const endpoint = `http://acesso.newtechs.com.br:3392/api/esp/v1/paytapi004`; 

var header = new HttpHeaders().set('Authorization', "Basic " + btoa(environment.auth))


@Injectable({
  providedIn: 'root',
})
export class PrestService {

  constructor(private httpClient: HttpClient) {}

  public getAll(filter:any): Observable<any> {
    return this.httpClient.get<any>(endpoint,{headers:header, params:filter});
  }
 
  
}