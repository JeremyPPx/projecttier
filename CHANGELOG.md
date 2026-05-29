# Changelog

## [0.2.0] – 2026-05-30

### Neu hinzugefügt
- **Multi-Pet-Support**: Mehrere Tiere können nun im Dashboard verwaltet werden. Jedes Tier hat ein eigenes Farbprofil und lässt sich per Sidebar-Switcher auswählen.
- **Tier hinzufügen**: Neues Modal zum Anlegen weiterer Haustiere (Name, Typ, Rasse, Alter).
- **Impfungen hinzufügen**: Formular zum Eintragen neuer Impfungen mit automatischer Status-Erkennung (aktuell / bald fällig / überfällig).
- **Allergien entfernen**: Pills können jetzt per ×-Button wieder gelöscht werden.
- **Demo-Banner**: Hinweis im Dashboard, dass es sich um einen Demo-Modus handelt.
- **Quick-Stats**: Kompakte Übersicht über Anzahl Versicherungen, Impfungen und Krankeneinträge pro Tier.
- **Homepage – Waitlist-Sektion**: E-Mail-Formular mit Bestätigungsfeedback zum Eintragen in die Warteliste.
- **Homepage – "In 3 Schritten"**: Neue Sektion erklärt den Onboarding-Flow für neue Nutzer.
- **Homepage – Testimonials**: Drei Nutzer-Zitate als Social Proof.
- **Homepage – Social Proof Bar**: Avatar-Stack mit Wartelisten-Zähler.
- **SVG-Logo**: Eigenes inline SVG-Logo ersetzt das Font-Awesome-Icon im Header.
- **Mobile Navigation**: Hamburger-Menü für Mobilgeräte mit vollständigem Slide-down-Menü.

### Verbessert
- Dashboard-Layout komplett überarbeitet: Sidebar mit Pet-Switcher, Quick-Stats und Versicherungen; Hauptbereich mit 2-Spalten-Grid für Allergien und Impfungen.
- Formular-Felder (Versicherungen, Impfungen) als `<details>`-Toggle versteckt – sauberer UX-Flow.
- Hero-Section: Floating-Badges, Hero-Badge, zwei CTAs, Stats-Leiste.
- CSS komplett refaktoriert: konsistente Design-Tokens, bessere Schatten, sauberere Spacing-Regeln.
- Responsive Breakpoints für 1024px, 768px und 480px ausgebaut.

### Behoben
- Nav-Links auf Mobile waren ausgeblendet ohne Fallback – jetzt Hamburger-Menü.
- Pet-Daten waren hardcoded auf Index 0 – jetzt dynamisch über `activePetId`.
- Datum-Formatierung in Impfformular korrigiert.

---

## [0.1.0] – 2026-05-28

### Initial Release
- Grundstruktur: HTML/CSS/JS Single-Page-App
- Hero-Section mit Hund/Katze-Bild
- Dashboard mit Versicherungen, Impfpass, Allergien, Krankenhistorie für ein Tier
- Einfaches SPA-Routing (Home / Dashboard)
- Responsive Layout (Basis)
