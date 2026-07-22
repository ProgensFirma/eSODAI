import { Injectable } from '@angular/core';
import { Sprawa } from '../models/sprawa.model';
import { Dokument } from '../models/dokument.model';
import { Skrzynka } from '../models/skrzynka.model';
import { TBazaOper, TeSodStatus, TSprStatusPrzek, TDokStatusEdycji, TDokStatusPrzek, TKanalTyp, TSkrzynki } from '../models/enums.model';

@Injectable({ providedIn: 'root' })
export class EmptyObjectsService {

  getEmptySprawa(): Sprawa {
    return {
      numer: 0,
      nazwa: '',
      typ: { nazwa: '', rWA: '' },
      znakDef: '',
      znakSprawy: '',
      znak_wydzial: '',
      znak_RWA: '',
      znak_rok: new Date().getFullYear(),
      sprawaGlowna: 0,
      etapOstatni: 0,
      glowna: false,
      dataStart: '',
      dataStop: null,
      terminPlan: '',
      terminAlarm: '',
      dataOtrzymania: null,
      dataPrzyjecia: null,
      dataPrzekazania: null,
      dataOdebrania: null,
      osobaPrzek: { numer: 0, identyfikator: '' },
      statusPrzek: TSprStatusPrzek.sps_oczek,
      odrzucona: false,
      kontrahent: { numer: 0, identyfikator: '', firma: false, nip: '', adres: '', eDoreczAdres: null },
      nadzorWydzial: { symbol: '', nazwa: '', kod: '', stanowisko: false },
      nadzorOsoba: { numer: 0, identyfikator: '' },
      wykWydzial: { symbol: '', nazwa: '', kod: '', stanowisko: false },
      wykOsoba: { numer: 0, identyfikator: '' },
      uprawPoziom: '',
      oper: TBazaOper.tboSelect,
      status: TeSodStatus.sBrak,
      statusDane: '',
      opis: ''
    };
  }

  getEmptyDokument(osobaNumer = 0, jednostkaSymbol = '', jednostkaNazwa = '', jednostkaKod = ''): Dokument {
    const currentDateTime = new Date().toISOString();
    return {
      numer: 0,
      archiwum: false,
      dokGlowny: 0,
      wersja: 0,
      aktualny: true,
      statusEdycji: TDokStatusEdycji.se_Zmieniany,
      doWgladu: false,
      typ: { nazwa: '', finansowy: false, poleceniezaplaty: false },
      szablon: null,
      nazwa: '',
      sprawa: null,
      rejestr: '',
      rejestrNumer: 0,
      rejestrRok: new Date().getFullYear(),
      rejestrNrPozycji: '',
      dataCzasWplywu: '',
      kanalWe: TKanalTyp.tk_papierowy,
      kontrahent: { numer: 0, identyfikator: '', firma: false, nip: '', adres: null, eDoreczAdres: null },
      przekazujacy: { numer: osobaNumer, identyfikator: '' },
      przekazujacyWydzial: { stanowisko: false, symbol: jednostkaSymbol, nazwa: jednostkaNazwa, kod: jednostkaKod },
      dataPrzekazania: currentDateTime,
      prowadzacy: { numer: osobaNumer, identyfikator: '' },
      prowadzacyWydzial: { stanowisko: false, symbol: jednostkaSymbol, nazwa: jednostkaNazwa, kod: jednostkaKod },
      odpowiedzialny: { numer: 0, identyfikator: '' },
      dataPrzyjecia: currentDateTime,
      uprawPoziom: '0',
      statusPrzek: TDokStatusPrzek.spd_oczek,
      dataAlert: new Date(new Date().setDate(new Date().getDate() + 27)).toISOString().split('T')[0],
      dataPlan: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      daneFinansowe: null,
      grupa1: '',
      grupa2: '',
      grupa3: '',
      publiczny: false,
      dokGuid: '',
      jrwa: '',
      obcyNumer: '',
      zalaczniki: [],
      oper: TBazaOper.tboSelect,
      status: TeSodStatus.sBrak,
      statusDane: ''
    };
  }

  getEmptySkrzynka(skrzynka: TSkrzynki, typ: string, nazwa: string): Skrzynka {
    return {
      sql: '',
      sqlOrder: '',
      skrzynka,
      poziom: 1,
      typ,
      nazwa,
      zliczana: false,
      ilosc: 0,
      suma: 0,
      zmiana: false,
      doWgl: false,
      doUsun: false,
      korEl: false,
      skrDef: 0,
      dokFinPoziom: 0,
      dokFinZmiana: false
    };
  }
}
