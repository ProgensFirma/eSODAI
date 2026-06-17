import { TBazaOper, TeSodStatus, TKanalTyp } from './enums.model';

export interface TDokWyjRodzajWysylki {
  nazwa: string;
  kanalWy: TKanalTyp;
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
