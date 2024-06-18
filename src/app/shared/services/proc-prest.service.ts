import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const endpoint = `${environment.url + environment.api}/paytapi008`;

var header = new HttpHeaders().set('Authorization', "Basic " + btoa(environment.auth))


@Injectable({
  providedIn: 'root',
})
export class procPrestService {

  constructor(private httpClient: HttpClient) {}

  public getErros(rowid: string): Observable<any> {
      return this.httpClient.get<any>(endpoint + '/erros/' + rowid,{headers:header});
  }
}
