# =====================================================
# STAGE 1: BUILD (Construcción de los assets estáticos)
# =====================================================
# Usamos la imagen oficial de Node 20 en su variante
# Alpine (la más ligera posible) exclusivamente para
# compilar el proyecto con Vite.
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copiamos primero SOLO los archivos de dependencias.
# Docker cachea cada capa: si package.json no cambia,
# no vuelve a ejecutar npm install en la siguiente compilación,
# acelerando enormemente las builds repetidas.
COPY package*.json ./

# Instalamos las dependencias del proyecto (incluyendo devDependencies,
# ya que Vite y Tailwind son necesarios para compilar).
RUN npm install

# Ahora copiamos el resto del código fuente de la aplicación.
COPY . .

# Compilamos la app con Vite. El resultado son archivos
# HTML, CSS y JS estáticos optimizados en la carpeta /app/dist.
# La variable VITE_API_URL se inyecta en tiempo de build para que
# el bundle final conozca la URL del backend.
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# =====================================================
# STAGE 2: SERVE (Servidor de producción con Nginx)
# =====================================================
# Esta es la imagen FINAL que se desplegará. Es extremadamente
# ligera: solo contiene Nginx y los assets compilados.
# No incluye Node.js, npm, el código fuente original ni las
# devDependencies. Resultado: imagen final ~25MB vs ~400MB+ con Node.
FROM nginx:stable-alpine

# Copiamos nuestra configuración personalizada de Nginx que habilita
# el soporte para React Router (Single Page Application).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos compilados en el Stage 1
# al directorio raíz que sirve Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (HTTP estándar de Nginx).
EXPOSE 80

# Nginx se inicia automáticamente con la imagen base.
# El flag "daemon off" es necesario para que el proceso se
# mantenga en primer plano (foreground), lo que Docker requiere
# para que el contenedor se mantenga vivo.
CMD ["nginx", "-g", "daemon off;"]
