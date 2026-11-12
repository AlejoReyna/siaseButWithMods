# Arquitectura

Tres vistas de cómo funciona Oh My SIASE. Solo incluyen código activo (registrado en `manifest.json` o importado por un script activo).

## 1. Dónde se inyecta

Qué script corre en cada parte del portal SIASE.

```mermaid
flowchart TB
  B([Navegador]) --> F["SIASE · default.htm<br/>frameset-injector"]
  F --> T["top<br/>top-frame"]
  F --> L["left<br/>left-frame · SmartSidebar"]
  F --> C["center<br/>center-frame · center-ui"]
  C --> R["router<br/>kardex · horario · calificaciones<br/>datos · situación · inscripción"]
  C --> S["service-page<br/>carrera · créditos · documentos"]
  C --> P["receipt-page · gym-reservation-page"]
  N([Nexus]) --> X["nexus-session-capture"]
```

## 2. Cómo fluyen los datos

Del HTML de SIASE a lo que ve el estudiante.

```mermaid
flowchart LR
  H["HTML de SIASE"] --> P["parsers<br/>src/utils/parser"]
  P --> ST[("chrome.storage<br/>gradeSnapshot · kardexSnapshot<br/>scheduleSlots")]
  ST --> D["Dashboard<br/>center-ui"]
  ST --> U["Popup"]
  D -. "fetch con sesión" .-> H
  P -- "REFRESH_GRADES" --> SW["Service worker<br/>grade-monitor"]
  SW --> NT["Notificaciones"]
  A["Alarma · 30 min"] --> SW
```

## 3. Cómo está organizado el código

Capas del repositorio, de la configuración a los tipos.

```mermaid
flowchart TB
  M["manifest.json"] --> E["Entradas<br/>src/content/*-frame.ts · router · service-page"]
  M --> BG["src/background"]
  M --> UI["src/popup · src/historia"]
  E --> PG["src/content/pages"]
  E --> CSS["src/content/styles"]
  E --> RX
  UI --> RX["components · hooks · store"]
  PG --> UT["src/utils<br/>parser · storage · siase-url"]
  BG --> UT
  RX --> UT
  UT --> TY["src/types"]
```
