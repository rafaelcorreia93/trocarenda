import { Injectable, signal } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserData } from "../shared/types";
import { ParametroPlanoService } from "./parametroPlano.service";
import { SolicitacoesTrocaRendaService } from "./solicitacoesTrocaRenda.service";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor(private http: HttpClient, public parametroPlanoService: ParametroPlanoService, public solicitacaoTrocaRendaService: SolicitacoesTrocaRendaService) {}
  public userCPF = signal('');
  public userData = signal<UserData | null>(null);

  getUserData(userCpf: string) {
    this.http.get<UserData>(environment.apiEndpoint + '/GetDadosParticipanteTrocaRenda', { headers: { "Authorization": "Basic " + btoa("Adm_BackOffice_TrocaRenda:123456") }, params: {CPF: userCpf} }).subscribe(data => {
      if(data.TipoRenda == 'Renda em Prazo Certo') {
        const parametroAnoEmMeses = data.ParametroRendaAtual / 13;
        data.ParametroRendaAtual = parametroAnoEmMeses;
        this.userData.update(() => data);
      } else {
        this.userData.update(() => data);
      }
      this.parametroPlanoService.getParametroPlano(this.userData()?.NumPlbnf as number);
      this.solicitacaoTrocaRendaService.getSolicitacaoTrocaRenda(this.userData()!.CodEmprs, this.userData()!.NumRgtroEmprg);
    });
  }
}
