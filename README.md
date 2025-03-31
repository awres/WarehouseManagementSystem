# WarehouseManagementSystem

WarehouseManagementSystem to aplikacja do zarządzania magazynem, umożliwiająca efektywne monitorowanie i kontrolowanie stanów magazynowych, zamówień oraz dostaw.

## Funkcjonalności

- **Zarządzanie produktami**: dodawanie, edytowanie i usuwanie informacji o produktach.
- **Śledzenie stanów magazynowych**: monitorowanie ilości produktów w magazynie.
- **Obsługa zamówień**: przyjmowanie, realizacja i archiwizacja zamówień.
- **Raportowanie**: generowanie raportów dotyczących stanów magazynowych i historii zamówień.

## Technologie

Projekt wykorzystuje następujące technologie:

- **Frontend**: NextJS, TypeScript, Tailwind.
- **Backend**: Python.

## Struktura projektu

- `backend/` - kod źródłowy serwera aplikacji.
- `frontend/` - kod źródłowy interfejsu użytkownika.

## Wymagania

- Node.js
- Python 3.x

## Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/awres/WarehouseManagementSystem.git
   ```

2. Przejdź do katalogu projektu:
   ```bash
   cd WarehouseManagementSystem
   ```

3. Zainstaluj zależności backendu:
   ```bash
   cd backend/warehouse_management
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

4. Uruchom serwer backendu:
   ```bash
   python app.py
   ```

5. W nowym terminalu zainstaluj zależności frontendu:
   ```bash
   cd frontend
   pnpm install
   ```

6. Uruchom aplikację frontendową:
   ```bash
   pnpm dev
   ```

Aplikacja powinna być teraz dostępna pod adresem `http://localhost:3000`.

## Wkład

Wszelkie sugestie i pull requesty są mile widziane. Prosimy o przestrzeganie standardów kodowania i dołączanie odpowiednich testów do nowych funkcji.

## Licencja

Ten projekt jest dostępny na licencji MIT. Szczegółowe informacje znajdują się w pliku `LICENSE`.
