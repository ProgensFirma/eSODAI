import { TBazaOper, TeSodStatus } from './enums.model';

export interface WykazAkt {
  symbol: string;
  nazwa: string;
  tylkoEZD: boolean;
  
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}
