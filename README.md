# 8699.pl — strona firmowa

## Zawartość
- Strona główna i 12 uzgodnionych podstron: oferta, pięć kategorii ubezpieczeń, dwa biura, o nas, kontakt, inicjatywy, dokumenty.
- Dodatkowa strona z informacjami o prywatności, wymagająca uzupełnienia przed produkcją.
- Oryginalne zdjęcia, certyfikaty, dokumenty i dwa filmy z 8699.pl.
- Wektorowe logo w katalogu `logo`, lokalny Font Awesome, slider marek z pauzą i sterowaniem.

## Budowanie
Python 3, bez dodatkowych bibliotek:

    python3 build.py
    python3 -m http.server 8000 --directory dist

Podgląd: http://localhost:8000. Nie otwieraj strony przez file://.

Eksport produkcyjny:

    python3 build.py --production

Powstaje katalog `dist-production` z indeksowaniem, mapą strony, adresami kanonicznymi dla https://8699.pl, metadanymi Open Graph, danymi InsuranceAgency, WebPage, BreadcrumbList i FAQPage. Wersja `dist` ma noindex i blokadę robots, żeby prywatny podgląd nie konkurował z domeną firmy.

`base.py` zawiera bazowe komponenty. `build.py` tworzy finalny układ, treści, SEO i zachowania strony. Nie publikuj wyniku uruchomienia samego base.py.

Walidacja:

    python3 validate.py

## Netlify i Brevo
Repozytorium zawiera netlify.toml i funkcję netlify/functions/contact.mjs.
Netlify buduje katalog dist-production. Ustaw w panelu Netlify, a nie w plikach:
- BREVO_API_KEY — klucz API Brevo.
- BREVO_SENDER_EMAIL — adres zweryfikowanego nadawcy.
- CONTACT_BYTOW — opcjonalnie, domyślnie bytow@8699.pl.
- CONTACT_KOSCIERZYNA — opcjonalnie, domyślnie koscierzyna@8699.pl.

Bez konfiguracji formularz nie zgłasza fikcyjnego sukcesu. W prywatnym podglądzie wysyłka jest celowo nieaktywna. Nie wykonano rzeczywistej wysyłki ani testu dostarczenia wiadomości. Przed uruchomieniem wykonaj autoryzowany test z docelową konfiguracją nadawcy i odbiorców. Ustaw ochronę przed nadużyciami dostępną w hostingu stosownie do ruchu.

## Przed podmianą działającej witryny
- Firma zatwierdza opisy, aktualną ofertę, hasło o Punktach Standard, dane doradców, dokumenty i wykorzystanie marek.
- Uzupełnij stronę prywatności na podstawie danych administratora, hostingu i konfiguracji Brevo. Obecna strona wyraźnie informuje o wymaganym uzupełnieniu.
- Sprawdź właściciela domeny, DNS poczty i dostęp do Search Console. Nie zmieniaj rekordów poczty przy przełączeniu WWW.
- Zachowano adresy /oferta/, /kontakt/, /nasze-inicjatywy/ i /dokumenty-do-pobrania/. Netlify przekierowuje stare /ubezpieczenia/ na /oferta/. Zachowane hashe #domy, #firm, #komunikacyjne, #zdrowie, #sport są mapowane do nowych kategorii.
- Zweryfikuj wszystkie pozostałe stare adresy w Search Console i dodaj ewentualne przekierowania.
- Po uruchomieniu dodaj sitemap.xml do Search Console. SEO nie stanowi gwarancji pozycji.

Film pionowy jest lokalny i ma preload=none. Film YouTube ładuje osadzenie dopiero po kliknięciu; potrzebuje dostępu do YouTube. Montaż odtwarzacza sprawdzono, zewnętrznego odtwarzania w środowisku użytkownika nie da się zagwarantować.

Dokumenty skopiowano z aktualnie dostępnej biblioteki firmy. Pominięto historyczną ankietę koronawirusową. Dokumentów nie zmieniano merytorycznie; ich aktualność potwierdza firma.
Fonty tekstowe są pobierane z Google Fonts. Font Awesome jest lokalny; dołączono informację o licencji. Logo nie wymaga fontów.
