# eSOD - System Obiegu Dokumentów

Webowy system elektronicznego obiegu dokumentów dla jednostek administracji publicznej.

---

## Spis treści

1. [Opis systemu](#opis-systemu)
2. [Logowanie](#logowanie)
3. [Interfejs główny](#interfejs-główny)
4. [Skrzynki dokumentów](#skrzynki-dokumentów)
5. [Dokumenty](#dokumenty)
6. [Sprawy](#sprawy)
7. [eDoręczenia](#edoręczenia)
8. [Zadania na dziś](#zadania-na-dziś)
9. [Kartoteki](#kartoteki)
10. [Administracja](#administracja)
11. [Sesja i wylogowanie](#sesja-i-wylogowanie)

---

## Opis systemu

eSOD to system zarządzania dokumentami, sprawami i korespondencją elektroniczną (eDoręczenia). Umożliwia rejestrację i obieg dokumentów wewnątrz jednostki, śledzenie spraw urzędowych oraz obsługę korespondencji elektronicznej zgodnej z systemem eDoreczenia.

---

## Logowanie

Po otwarciu aplikacji wyświetla się okno logowania.

**Pola formularza:**
- **Login** – nazwa użytkownika
- **Hasło** – hasło dostępu

Ostatnio użyty login jest zapamiętywany i wstępnie wypełniany przy kolejnym uruchomieniu.

Po kliknięciu **Zaloguj się** system weryfikuje dane i otwiera interfejs główny. W przypadku błędnych danych wyświetlany jest komunikat o błędzie.

**Wybór wydziału** – jeśli użytkownik ma dostęp do więcej niż jednego wydziału, po zalogowaniu pojawi się okno wyboru aktywnego wydziału.

W oknie logowania widoczna jest wersja aplikacji (frontend i backend).

---

## Interfejs główny

Interfejs dzieli się na dwie główne sekcje:

### Panel lewy – drzewo skrzynek (320 px)

Hierarchiczne drzewo dostępnych skrzynek dokumentów i spraw. Węzły można rozwijać i zwijać. Przy każdej skrzynce może być wyświetlona liczba dokumentów lub sum kwot.

Przycisk **Odśwież** (ikona strzałki) przeładowuje drzewo z serwera.

### Panel prawy – zawartość skrzynki

Wyświetla zawartość wybranej skrzynki: tabelę dokumentów, spraw lub eDoreczań. Poniżej tabeli widoczny jest panel szczegółów wybranego elementu.

### Nagłówek

- Imię i nazwisko zalogowanego użytkownika
- Nazwa jednostki i wydziału
- Licznik czasu sesji (podświetla się na czerwono gdy zostaje mniej niż 100 sekund)
- Przycisk **Menu** – otwiera menu główne z opcjami systemu
- Przycisk **Zadania na dziś** – otwiera boczny panel z zaplanowanymi zadaniami
- Przycisk **Wyloguj** – kończy sesję

---

## Skrzynki dokumentów

Drzewo skrzynek zawiera następujące kategorie:

| Kategoria | Opis |
|-----------|------|
| **Dokumenty** | Skrzynki korespondencji (np. Bieżące, Otrzymane, Do podpisu) |
| **Sprawy** | Skrzynki ze sprawami (np. Terminy, Pilne) |
| **eDoręczenia** | Przychodzące i wysłane dokumenty eDoręczenia |
| **Foldery** | Moje dokumenty, Pulpit |

Po kliknięciu skrzynki zawartość panelu prawego zmienia się odpowiednio do wybranego typu.

---

## Dokumenty

### Lista dokumentów

Tabela zawiera kolumny:

| Kolumna | Opis |
|---------|------|
| Nr | Numer dokumentu w systemie |
| Typ | Typ dokumentu |
| Nazwa | Nazwa/tytuł dokumentu |
| Rejestr | Symbol rejestru i numer pozycji |
| Data wpływu | Data zarejestrowania |
| Kontrahent | Nadawca lub odbiorca zewnętrzny |
| Zał. | Liczba załączników |

Dokumenty finansowe wyróżnione są kolorem.

**Przyciski akcji:**

- **Nowy** – otwiera formularz tworzenia dokumentu
- **Edycja** – otwiera formularz edycji wybranego dokumentu
- **Przekaż** – otwiera okno przekazania dokumentu (dostępne w skrzynkach Otrzymane i Bieżące)
- **Odśwież** – przeładowuje listę

### Szczegóły dokumentu

Po wybraniu dokumentu z tabeli, w dolnym panelu wyświetlają się jego szczegóły podzielone na sekcje:

**Informacje podstawowe**
- Numer, typ, nazwa, opis
- Rejestr i numer pozycji
- Numer i data na dokumencie

**Daty**
- Data wpływu, godzina wpływu
- Data dokumentu
- Data przekazania
- Data alertu, data planowana

**Osoby i wydziały**
- Kontrahent (nadawca zewnętrzny)
- Przekazujący i jego wydział
- Prowadzący i jego wydział

**Dane finansowe** (tylko dla dokumentów finansowych)
- Kwota netto, VAT, brutto

**Załączniki**
- Lista plików z przyciskiem pobierania

### Tworzenie i edycja dokumentu

Formularz zawiera pola:

| Pole | Opis |
|------|------|
| Typ | Wybór z listy typów dokumentów |
| Nazwa | Nazwa/tytuł (wymagane) |
| Opis | Opis dodatkowy |
| Rejestr | Symbol rejestru |
| Nr pozycji | Numer pozycji w rejestrze |
| Data wpływu | Data rejestracji |
| Kontrahent | Wyszukiwanie kontrahenta |
| Dane finansowe | Kwoty netto/VAT/brutto |

Przyciski: **Zapisz** i **Anuluj**. Tryb tylko do odczytu nie pozwala na modyfikacje.

### Przekazanie dokumentu

Okno przekazania pozwala wybrać odbiorcę (osobę lub wydział) i potwierdzić przekazanie. Po przekazaniu dokument trafia do skrzynki odbiorcy.

---

## Sprawy

### Lista spraw

Tabela zawiera kolumny:

| Kolumna | Opis |
|---------|------|
| Nr | Numer sprawy |
| Nazwa | Tytuł sprawy |
| Typ | Typ/kategoria sprawy |
| Znak | Znak sprawy (symbol) |
| Data start | Data otwarcia |
| Data stop | Data zamknięcia |
| Termin | Planowany termin zakończenia |

Sprawy główne są wyróżnione kolorem żółtym.

**Przyciski akcji:**
- **Utwórz sprawę** – otwiera formularz nowej sprawy
- **Odśwież** – przeładowuje listę

### Dokumenty sprawy

Po wybraniu sprawy z tabeli, prawa strona wyświetla tabelę dokumentów powiązanych z tą sprawą. Funkcjonalność jest analogiczna do standardowej listy dokumentów.

---

## eDoręczenia

### Przychodzące

Tabela zawiera:

| Kolumna | Opis |
|---------|------|
| Nazwa | Tytuł dokumentu |
| Data | Data wpłynięcia |
| Skrzynka nadawcy | Adres skrzynki nadawcy |
| Nadawca | Nazwa nadawcy |
| Skrzynka adresata | Adres skrzynki adresata |
| Adresat | Nazwa adresata |

Po wybraniu dokumentu:
- W dolnym panelu wyświetla się treść wiadomości
- Lista załączników z możliwością pobierania
- Lista potwierdzeń dostarczenia

Przycisk **Dokument** – otwiera formularz powiązanego dokumentu w systemie.

### Wysłane / Do wysłania

Analogiczna tabela dla dokumentów wysyłanych przez system eDoręczenia ze śledzeniem statusu wysyłki.

---

## Zadania na dziś

Panel boczny **Zadania na dziś** (otwierany przyciskiem w nagłówku) wyświetla pogrupowane zadania do realizacji:

| Sekcja | Opis |
|--------|------|
| **Sprawy** | Sprawy z przekroczonym lub bliskim terminem |
| **Dokumenty** | Dokumenty wymagające reakcji |
| **eDoręczenia** | Oczekujące eDoręczenia |

Każde zadanie wyświetla:
- Znak sprawy/dokumentu
- Datę terminu
- Nazwę
- Kogo dotyczy

Kliknięcie przycisku lupy przy zadaniu przenosi do odpowiedniej skrzynki i podświetla wybrany element.

Przycisk **Odśwież** przeładowuje listę zadań.

---

## Kartoteki

Dostępne z menu głównego (sekcja **Kartoteki**):

### Kontrahenci

Okno zarządzania kontrahentami (podmiotami zewnętrznymi). Umożliwia:
- Przeglądanie listy kontrahentów
- Dodawanie nowego kontrahenta
- Edycję danych kontrahenta
- Usuwanie kontrahenta

### Pracownicy

Okno zarządzania listą pracowników jednostki. Umożliwia:
- Przeglądanie listy pracowników
- Dodawanie i edycję danych pracownika

### Powiadomienia

Okno z powiadomieniami systemowymi i alertami dla zalogowanego użytkownika.

---

## Administracja

Dostępne z menu głównego:

### Dokumenty wychodzące

Zarządzanie dokumentami wysyłanymi z jednostki. Śledzenie statusu wysyłki.

### Jednostki

Zarządzanie strukturą organizacyjną – jednostkami i wydziałami.

### Wykaz akt

Przeglądanie i zarządzanie wykazem akt w układzie drzewiastym (JRWA).

### Parametry

Okno konfiguracji systemu. Pozwala modyfikować parametry działania aplikacji.

### Uprawnienia

Zarządzanie uprawnieniami użytkowników. Przydzielanie dostępu do funkcji i skrzynek.

### Informacja

Okno z informacjami o systemie: wersja, historia zmian.

---

## Sesja i wylogowanie

### Czas sesji

W nagłówku widoczny jest licznik czasu pozostałego do automatycznego wylogowania. Każda aktywność użytkownika (kliknięcie, wciśnięcie klawisza) resetuje licznik. Gdy pozostaje mniej niż 100 sekund, licznik zmienia kolor na czerwony.

Po wygaśnięciu sesji system automatycznie powraca do ekranu logowania.

### Ręczne wylogowanie

Kliknięcie przycisku **Wyloguj** w nagłówku natychmiast kończy sesję i powraca do ekranu logowania.

---

## Informacje techniczne

| Parametr | Wartość |
|----------|---------|
| Framework | Angular 18+ |
| UI Library | PrimeNG |
| Format dat | DD.MM.YYYY |
| Waluta | PLN |
| Kodowanie znaków | UTF-8 |

Konfiguracja połączenia z serwerem API znajduje się w pliku `public/config.json`.
