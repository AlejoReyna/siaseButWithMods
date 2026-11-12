<div align="center">

# Oh My SIASE!

<!-- Demo corto: coloca el archivo en docs/repo/demo.gif (idealmente < 3 MB). -->
<img src="./docs/repo/demo.gif" alt="Demo de Oh My SIASE sobre el portal SIASE de la UANL" width="1000" />

_Un proyecto estudiantil para mejorar la experiencia de usuario de los alumnos de la UANL._

</div>

Descarga el repositorio:

```bash
git clone https://github.com/AlejoReyna/siaseButWithMods.git
```

La carpeta `dist/` ya incluye la extensión compilada, así que puedes cargarla directamente en tu navegador.

### Brave

1. Abre `brave://extensions`.
2. Activa **Modo de desarrollador**.
3. Haz clic en **Cargar descomprimida** y selecciona la carpeta `dist/`.
4. Entra a [SIASE](https://deimos.dgi.uanl.mx).

<!-- Video Brave: arrastra el .mp4 al editor de GitHub y pega aquí la URL que genera (https://github.com/user-attachments/assets/...). -->

### Firefox

<!-- Pasos de instalación en Firefox: pendientes. -->
<!-- Video Firefox: arrastra el .mp4 al editor de GitHub y pega aquí la URL que genera (https://github.com/user-attachments/assets/...). -->

_Pendiente._

<details>
<summary><b>Features implementadas</b></summary>

<br />

- Rediseño de los frames `top`, `left` y `center` del portal.
- Menú lateral con búsqueda, categorías y servicios fijados.
- Inicio tipo dashboard: resumen del estudiante, créditos, calificaciones recientes, actividades próximas y avisos oficiales.
- Páginas rediseñadas: horario, calificaciones, kardex, datos personales, situación del estudiante, fecha de inscripción, créditos académicos, selector de carrera, carga de documentos, recibos y reservación del gimnasio.
- Notificaciones cuando cambia una calificación.
- Interruptor para activar o desactivar las mejoras y volver al SIASE original.

</details>

### Desarrollo local

```bash
npm install
npm run dev
```

<sub>[Referencia técnica](./DEVELOPMENT.md) · [Cómo contribuir](./CONTRIBUTING.md) · [Mapa del portal SIASE](./docs/siase-ui-rebuild/README.md)</sub>
