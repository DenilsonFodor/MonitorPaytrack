import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

//const endpoint = `http://acesso.newtechs.com.br:3392/api/esp/v1/paytapi00`; 

const endpoint = `${environment.url + environment.api}/paytapi004`;

var header = new HttpHeaders().set('Authorization', "Basic " + btoa(environment.auth))

@Injectable({
  providedIn: 'root',
})
export class PrestService {

  constructor(private httpClient: HttpClient) {}

  public getAll(filter:any): Observable<any> {
    return this.httpClient.get<any>(endpoint,{headers:header, params:filter});
  }

  public getRateio(rowid: string): Observable<any> {
    return this.httpClient.get<any>(endpoint + '/' + rowid,{headers:header});

  }

}
