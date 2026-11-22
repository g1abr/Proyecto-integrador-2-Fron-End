#  Catálogo de Películas y Series – Frontend

Aplicación web desarrollada con **React** y **Vite** que permite visualizar y administrar un catálogo de películas y series. El proyecto cuenta con una interfaz de usuario que permite consultar los títulos disponibles y un módulo de administración para gestionar la información.

## Descripción del proyecto

Este proyecto corresponde al desarrollo del Frontend de un sistema de catálogo de películas y series. Su propósito es ofrecer una interfaz intuitiva y organizada para consultar contenidos audiovisuales y administrar sus registros.

La aplicación se conecta con una API REST desarrollada con Node.js y Express, que permite realizar las operaciones de consulta, creación, actualización y eliminación de información almacenada en una base de datos MySQL.

## Funcionalidades

- **Inicio:** página principal de la aplicación.
- **Gestión de géneros:** consulta y administración de géneros cinematográficos.
- **Gestión de directores:** administración de directores.
- **Gestión de productoras:** administración de productoras.
- **Gestión de tipos:** administración de los tipos de contenido.
- **Gestión de películas y series:** creación, consulta, edición y eliminación de registros.
- **Vista de catálogo:** visualización de películas y series mediante tarjetas con sus respectivas portadas e información.
- **Búsqueda:** permite localizar contenidos dentro del catálogo.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React | Desarrollo de la interfaz de usuario |
| Vite | Herramienta de desarrollo y compilación |
| JavaScript | Lógica de la aplicación |
| Axios | Consumo de la API REST |
| React Router DOM | Navegación entre páginas |
| Bootstrap | Diseño y componentes visuales |
| Bootstrap Icons | Iconografía |
| SweetAlert2 | Alertas y cuadros de confirmación |
| CSS | Estilos personalizados |

## Estructura del proyecto

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Inicio.jsx
│   │   ├── Generos.jsx
│   │   ├── Directores.jsx
│   │   ├── Productoras.jsx
│   │   ├── Tipos.jsx
│   │   ├── Media.jsx
│   │   └── CatalogoUsuario.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- [Node.js](https://nodejs.org/)
- npm (incluido con Node.js).
- La API del proyecto configurada y en funcionamiento.

##  Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone URL_DEL_REPOSITORIO
```

**2. Ingresar a la carpeta del proyecto**

```bash
cd NOMBRE_DEL_PROYECTO
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Iniciar el servidor de desarrollo**

```bash
npm run dev
```

**5. Abrir la aplicación**

Una vez iniciado el servidor, Vite mostrará la dirección local. Por defecto:

```text
http://localhost:5173
```

##  Conexión con la API

El Frontend utiliza Axios para realizar las solicitudes HTTP al Backend.

La configuración se encuentra en:

`src/services/api.js`

Actualmente, la conexión local está configurada de la siguiente manera:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-catalogo-peliculas-iu.onrender.com/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

Para que la aplicación funcione correctamente, el servidor Backend debe estar activo y disponible en la dirección configurada.

## Autora

**Gabriela Andrea Machado Silva**

Proyecto académico desarrollado como parte de la actividad de aprendizaje **Front End - ReactJs**, de la Universidad Digital de Antioquia.

