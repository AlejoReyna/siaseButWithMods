# Cómo se inyecta la extensión

Tres vistas de cómo el código de Oh My SIASE llega al navegador y se monta sobre el portal. Basadas en `manifest.json` y en el build de CRXJS (`dist/`).

## 1. Secuencia de carga

Qué pasa desde que el estudiante abre SIASE hasta que ve la interfaz nueva.

```mermaid
sequenceDiagram
  participant E as Estudiante
  participant N as Navegador
  participant X as Extensión
  E->>N: Abre default.htm
  N->>X: ¿Hay content scripts para esta URL?
  X-->>N: frameset-injector · document_start · solo frame raíz
  Note over N: Captura parámetros de sesión
  N->>N: Carga frames top · left · center
  X-->>N: CSS + loader en cada frame · document_idle
  N->>X: El loader pide el módulo real con import()
  X-->>N: Módulo desde chrome-extension://
  Note over N: enhancementsEnabled() → mejora el DOM
```

## 2. Del manifest a cada frame

Qué script y qué CSS se inyecta según la URL que carga cada frame.

```mermaid
flowchart LR
  M["manifest.json<br/>content_scripts"]
  M --> R["default.htm<br/>frameset-injector"]
  M --> T["maintop.htm<br/>top-frame + top.css"]
  M --> L["mainleftdin01.htm<br/>left-frame + left.css"]
  M --> C["maincenter.htm<br/>center-frame + center-v2.css"]
  M --> P["kardex · horario · calificaciones…<br/>router + center-v2.css"]
  M --> S["carrera · créditos · documentos<br/>service-page + service-pages-v2.css"]
  M --> Q["recibos · gimnasio<br/>receipt-page · gym-reservation-page"]
  M --> NX["plataformanexus.uanl.mx<br/>nexus-session-capture"]
```

## 3. Dónde vive cada pieza

Los contextos del navegador y cómo se comunican.

```mermaid
flowchart TB
  subgraph TAB["Pestaña de SIASE"]
    direction LR
    PJ["JS original<br/>de SIASE"] --- DOM(["DOM del frame"])
    CS["Content scripts<br/>mundo aislado"] --> DOM
    CS --> SH["Shadow DOM<br/>sidebar React + shadow.css"]
  end
  subgraph EXT["Extensión"]
    SW["Service worker"]
    ST[("chrome.storage")]
    WR["web_accessible_resources<br/>módulos · CSS · íconos"]
  end
  WR -- "import()" --> CS
  CS <-- "chrome.runtime" --> SW
  CS <--> ST
  SW <--> ST
```
