import { TBazaOper, TeSodStatus, TSODParamTyp } from './enums.model';

export interface Parametr {
  parametr: string;
  grupa: string;
  kolejnosc: number;
  opis: string;
  wartosc: string;
  typ: TSODParamTyp;
  pomoc: string;
  oper: TBazaOper;
  status: TeSodStatus;
  statusDane: string;
}

export interface ParametrGrupa {
  nazwa: string;
  parametry: Parametr[];
  expanded: boolean;
}
