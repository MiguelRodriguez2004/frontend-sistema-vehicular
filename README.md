# TrackGarage - Frontend 🚗🔧

**TrackGarage** es la interfaz visual de un sistema moderno, intuitivo y responsivo para el seguimiento y administración del mantenimiento vehicular en talleres de servicio. Está diseñado para simplificar el flujo de trabajo de los mecánicos y administradores mediante una arquitectura limpia y componentes altamente reutilizables.

Este proyecto ha sido optimizado y estructurado utilizando las mejores prácticas de modularidad, haciéndolo ideal para la colaboración en equipo y el desarrollo asistido por **Agentes de Inteligencia Artificial (IA)**.

---

## 🛠️ Tecnologías y Stack de Desarrollo

* **Core:** React 19 (JavaScript) + Vite
* **Enrutamiento:** React Router DOM (v7) con rutas anidadas
* **Estilizado (CSS):** Tailwind CSS v4 (Nativo e Integrado con compilación ultrarrápida)
* **Iconografía:** Lucide React
* **Cliente de API:** Axios (Instancia base parametrizada)
* **Validación de Formularios:** React Hook Form
* **Mensajes / Alertas:** SweetAlert2

---

## 📂 Estructura Arquitectónica del Proyecto

La estructura del directorio `src/` sigue un patrón modular limpio y desacoplado:

```text
src/
├── api/          # Instancia base e interceptores de Axios
├── assets/       # Imágenes, logotipos y recursos estáticos
├── components/   # Estructuras globales (Sidebar, Navbar)
│   └── ui/       # Biblioteca interna de componentes base (UI Primitives)
├── context/      # Estados globales (ej: Autenticación, Configuración)
├── hooks/        # Custom hooks de React
├── layouts/      # Contenedores principales (MainLayout responsivo)
├── pages/        # Vistas operativas (Órdenes, Nueva Orden, Detalles)
├── routes/       # Configuración de enrutamiento y redirecciones
├── services/     # Llamados específicos de lógica de API por entidad
├── styles/       # Hojas de estilo personalizadas
└── utils/        # Funciones auxiliares comunes y formateadores
```

### 🧩 Componentes UI Reutilizables (`src/components/ui/`)
* **`Button.jsx`**: Botón modular compatible con iconos y múltiples variantes de color.
* **`Input.jsx`**: Campo de entrada con soporte de ref (`forwardRef`), mensajes de error y etiquetas.
* **`Card.jsx`**: Fichas modulares (`CardHeader`, `CardBody`, `CardFooter`) para estructurar la UI.
* **`Badge.jsx`**: Etiquetas estilizadas de estado con alto contraste y paddings refinados.
* **`Modal.jsx`**: Ventana modal interactiva con deshabilitación de scroll en segundo plano.

---

## 🚀 Instalación y Configuración Local

Sigue estos pasos para descargar, configurar y ejecutar el proyecto en tu entorno local:

### 1. Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada) y un gestor de paquetes (`npm` o `yarn`).

### 2. Clonar e Instalar Dependencias
```bash
# Instalar dependencias
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en la plantilla `.env.example`:
```bash
# Copiar plantilla de variables de entorno
cp .env.example .env
```
Asegúrate de que la URL apunte a tu servidor de backend:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Servidor de Desarrollo
```bash
# Iniciar servidor local
npm run dev
```
Abre en tu navegador la dirección indicada por la consola (ej. [http://localhost:5173/](http://localhost:5173/)).

### 5. Compilación para Producción
```bash
# Compilar proyecto optimizado
npm run build
```
La salida se generará en la carpeta `dist/` en milisegundos gracias al motor de empaquetado de Vite.

---

## 🚦 Guía de Scripts Disponibles

* `npm run dev`: Lanza el servidor de desarrollo local con recarga en caliente (HMR).
* `npm run build`: Compila y optimiza los recursos para el entorno de producción.
* `npm run lint`: Ejecuta análisis de código con ESLint para asegurar consistencia y calidad.
* `npm run preview`: Lanza un servidor local para previsualizar la compilación generada en `dist/`.

---

## 📈 Subir a GitHub (Guía Rápida)

Si deseas subir este proyecto a un repositorio de GitHub por primera vez:

1. **Inicializar Git localmente** (si no se ha hecho antes):
   ```bash
   git init
   ```
2. **Añadir los archivos al área de preparación:**
   ```bash
   git add .
   ```
3. **Crear tu primer commit histórico:**
   ```bash
   git commit -m "Initial commit: Setup modular visual architecture and responsive layout for TrackGarage"
   ```
4. **Vincular con tu repositorio de GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   ```
5. **Subir los cambios:**
   ```bash
   git push -u origin main
   ```
