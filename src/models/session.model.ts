import { TWydzialInfo } from './typy-info.model';
import { TSystem, TDBSerwer } from './enums.model';

export interface LoginRequest {
  login: string;
  haslo: string;
}

export interface SessionData {
  sesja: number;
  gUnikNr: number;
  sysOper: TSystem;
  dB: TDBSerwer;
  firma: number;
  firmaNazwa: string;
  login: string;
  osoba: number;
  nazwisko: string;
  imie: string;
  stanowisko: string;
  symbol: string;
  poziom: string;
  jednostkaAkt: TWydzialInfo;
  jednostki: TWydzialInfo[];
  zalogowany: boolean;
  admin: boolean;
  czasStart: string;
  czasAktual: string;
  czasStop: string;
}

export interface LoginResponse {
  sessionData: SessionData;
  appServerVersion: string;
}