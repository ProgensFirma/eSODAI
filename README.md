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
- Przycisk **Tryb ciemny** – przełączenie motywu jasny/ciemny (zapamiętywane w przeglądarce)
- Przycisk **Menu** – otwiera menu główne z opcjami systemu
- Przycisk **Zadania na dziś** – otwiera boczny panel z zaplanowanymi zadaniami
- Przycisk **Wyloguj** – kończy sesję

### Informacja o licencji

W dolnej części ekranu głównego wyświetlana jest informacja o licencji systemu.

---

## Skrzynki dokumentów

Drzewo skrzynek zawiera następujące kategorie:

| Kategoria | Opis |
|-----------|------|
| **Dokumenty** | Skrzynki korespondencji (np. Bieżące, Otrzymane, Do podpisu) |
| **Dokumenty finansowe** | Skrzynka dokumentów finansowych |
| **Sprawy** | Skrzynki ze sprawami (np. Terminy, Pilne) |
| **eDoręczenia** | Przychodzące i wysłane dokumenty eDoręczenia |
| **KSEF** | Skrzynki e-faktur (Krajowy System e-Faktur): przychodzące, do wysłania, wysłane |
| **Foldery** | Moje dokumenty, Pulpit, Składnica |

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

Dokumenty finansowe wyróżnione są kolorem. Ikony statusu przy dokumencie oznaczają: tryb edycji, status przekazania, dokument finansowy, archiwum, dokument publiczny.

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
- Oznaczenia: finansowy, archiwum, publiczny

**Daty**
- Data wpływu, godzina wpływu
- Data dokumentu
- Data przekazania
- Data alertu, data planowana

**Osoby i wydziały**
- Kontrahent (nadawca zewnętrzny)
- Przekazujący i jego wydział
- Prowadzący i jego wydział
- Odpowiedzialny

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
| Nr pozycji | Numer pozycji w rejestrze (kopiowalny po zapisaniu) |
| Data i czas wpływu | Data i godzina rejestracji (wymagane) |
| Kontrahent | Wyszukiwanie kontrahenta |
| Numer na dokumencie | Numer z dokumentu oryginalnego |
| Odpowiedzialny | Osoba odpowiedzialna (tylko do odczytu) |
| JRWA | Klasyfikacja z Wykazu Akt |
| Dane finansowe | Kwoty netto/VAT/brutto |
| Załączniki | Pliki powiązane z dokumentem |

Po pomyślnym zapisaniu dokumentu wyświetlany jest numer pozycji w rejestrze oraz GUID z możliwością skopiowania do schowka.

Przyciski: **Zapisz** i **Anuluj**. Tryb tylko do odczytu nie pozwala na modyfikacje.

### Przekazanie dokumentu

Okno przekazania oferuje dwa tryby (dostępne gdy włączona jest obsługa jednostek przekazań):

- **Wewnątrz** – wybór jednostki i pracownika wewnątrz własnej organizacji. Opcjonalne pole wyboru „Przekaż do wydziału" (widoczne gdy parametr systemowy na to pozwala).
- **Do zewnętrznej jednostki** – wybór jednostki z katalogu jednostek przekazań (tylko jednostki inne niż własna).

Po przekazaniu dokument trafia do skrzynki odbiorcy.

### Podpisywanie dokumentów

Dokumenty w skrzynce „Do podpisu" mogą być podpisywane. Dostępne tryby podpisu:
- **Podpisz** – podpisanie dokumentu
- **Tylko oznacz** – oznaczenie dokumentu jako podpisanego bez faktycznego podpisu
- **Pieczęć** – nałożenie pieczęci

### Wysyłanie dokumentów

Dokumenty mogą być wysyłane z systemu. Przed wysłaniem wykonywane jest sprawdzenie poprawności. Rodzaj wysyłki wybierany jest z dostępnych kanałów (papierowy, e-mail, ePUAP, eDoręczenia, Portal).

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
- **Przekaż** – otwiera okno przekazania sprawy
- **Zakończ** – otwiera okno zakończenia sprawy
- **Odśwież** – przeładowuje listę

### Tworzenie sprawy

Formularz zawiera pola:

| Pole | Opis |
|------|------|
| Typ sprawy | Wybór z listy (wymagane) |
| Nazwa | Tytuł sprawy (wymagane) |
| Kontrahent | Wyszukiwanie kontrahenta |
| Znak sprawy | Nadawany automatycznie (kopiowalny po zapisaniu) |
| RWA | Klasyfikacja z Wykazu Akt |
| Rozpoczęcie | Data rozpoczęcia (domyślnie dzisiaj) |
| Planowane zakończenie | Planowany termin (domyślnie +21 dni) |
| Alarmowanie od daty | Data alarmu (domyślnie 3 dni przed terminem) |
| Zakończenie | Data faktycznego zakończenia |
| Nadzorujący | Jednostka i pracownik nadzorujący |
| Wykonujący | Jednostka i pracownik wykonujący |
| Opis | Opis sprawy |

Po zapisaniu sprawy wyświetlany jest znak sprawy z możliwością skopiowania. Można dołączyć dokument do nowej sprawy.

### Przekazywanie sprawy

Okno przekazania sprawy pozwala wybrać nowego wykonującego (jednostka + pracownik) oraz nadzorującego (jednostka + pracownik). Dodatkowo można wpisać notatkę do przekazania.

### Zakończenie sprawy

Okno zakończenia sprawy zawiera:
- **Data zakończenia** – data faktycznego zakończenia (nie może być wcześniejsza niż data rozpoczęcia)
- **Wynik sprawy** – Pozytywnie lub Negatywnie

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

Analogiczna tabela dla dokumentów wysyłanych przez system eDoręczenia ze śledzeniem statusu wysyłki. W panelu szczegółów dostępne są:
- Treść wiadomości
- Załączniki z możliwością pobierania
- Potwierdzenia doręczenia z możliwością pobierania

Przycisk **Dokument** otwiera dokument źródłowy w trybie tylko do odczytu.

### Tworzenie eDoręczenia

Okno wysyłki eDoręczenia zawiera:
- **Punkt nadawczy** – wybór punktu nadawczego (wyświetla dane nadawcy i adres ADE)
- **Typ wiadomości** – Wiadomość elektroniczna lub Wiadomość hybrydowa
- **Adresat** – skrzynka odbiorcy i nazwa
- **Załączniki** – wybór plików do dołączenia
- **Tytuł** i **Treść** wiadomości

Obsługiwany jest tryb międzyjednostkowy (trybMJ) dla eDoręczeń przekazywanych między jednostkami.

---

## Zadania na dziś

Panel boczny **Zadania na dziś** (otwierany przyciskiem w nagłówku) wyświetla pogrupowane zadania do realizacji w pięciu sekcjach:

| Sekcja | Opis |
|--------|------|
| **Komunikaty** | Przypomnienia i komunikaty systemowe z możliwością potwierdzenia ("Pamiętam" / "Pomiń") |
| **Sprawy** | Sprawy przeterminowane i pilne (z przekroczonym lub bliskim terminem) |
| **Dokumenty** | Dokumenty otrzymane wymagające reakcji |
| **eDoręczenia** | Oczekujące eDoręczenia |
| **Dokumenty wysłane** | Dokumenty wysłane niepotwierdzone |

Każde zadanie wyświetla:
- Znak sprawy/dokumentu
- Datę terminu
- Nazwę
- Kogo dotyczy

Kliknięcie przycisku lupy przy zadaniu przenosi do odpowiedniej skrzynki i podświetla wybrany element. W przypadku komunikatów otwiera się okno szczegółów z możliwością przejścia do powiązanego dokumentu lub sprawy.

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

Okno przeglądu listy pracowników jednostki. Umożliwia:
- Przeglądanie listy pracowników
- Filtrowanie po identyfikatorze lub numerze
- Stronicowanie wyników

### Powiadomienia

Okno z powiadomieniami systemowymi i alertami dla zalogowanego użytkownika.

---

## Administracja

Dostępne z menu głównego:

### Dokumenty wychodzące

Zarządzanie dokumentami wysyłanymi z jednostki. Funkcjonalności:
- Filtrowanie po rejestrze i roku
- Tabela dokumentów wychodzących z kanałem wysyłki
- Panel szczegółów dokumentu źródłowego z załącznikami
- Szczegóły kontrahenta (identyfikator, NIP, adres, typ)
- Lista „Do wiadomości" (odbiorcy do wiadomości)
- Przycisk pobierania potwierdzenia wysyłki (dla eDoręczeń)
- Przycisk **Utwórz eDoręczenie** – tworzenie eDoręczenia z dokumentu wychodzącego

### Wykaz akt

Przeglądanie wykazu akt w układzie drzewiastym (JRWA). Dla każdego węzła wyświetlane są:
- Poziom archiwum (jednostka macierzysta i jednostka inna)
- Uwagi

Wykaz akt jest wykorzystywany przy wyborze klasyfikacji JRWA w formularzu dokumentu i RWA w formularzu sprawy.

### Jednostki przekazań

Katalog jednostek przekazań (jednostek zewnętrznych, do których można przekazywać dokumenty). Tabela zawiera:
- Symbol i nazwę jednostki
- Adres eDoręczeń
- Oznaczenie jednostki głównej, własnej i NSSOD

### Parametry

Okno konfiguracji systemu. Pozwala modyfikować parametry działania aplikacji.

### Uprawnienia

Widok uprawnień zalogowanego użytkownika (tylko do odczytu). Zmian uprawnień dokonuje administrator systemu.

### Informacja

Okno z informacjami o systemie: wersja, historia zmian.

### Instrukcja

Otwiera instrukcję użytkownika w osobnej karcie przeglądarki.

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
| Framework | Angular 20 |
| UI Library | PrimeNG |
| Format dat | DD.MM.YYYY |
| Waluta | PLN |
| Kodowanie znaków | UTF-8 |

Konfiguracja połączenia z serwerem API znajduje się w pliku `public/config.json`.
