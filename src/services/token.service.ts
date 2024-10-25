import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { TokenReturn, TokenValueCredential } from "../shared/types";
import { Router } from "@angular/router";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/json;charset=UTF-8',
    "Authorization": "Basic " + btoa("Adm_BackOffice_TrocaRenda:123456")
  })
}
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpClient, private router: Router) {}

  createTokenByCPF(CPF: string) {
    const body: TokenValueCredential = {
      CPF: CPF
    };
    this.http.post<TokenReturn>(environment.apiEndpoint + '/CreateToken', JSON.stringify(body), httpOptions).subscribe(data => {
      console.log(data);

      this.router.navigate(['/'], { queryParams: {token: data.token} });
    });
  }
}