# Utiliza una imagen de Node.js como base
FROM node:alpine3.18

# Establece el directorio de trabajo en /app
WORKDIR /build

# Copia los archivos de la aplicación al directorio de trabajo
COPY . .

# Instala las dependencias
RUN npm install

# Compila la aplicación para producción
RUN npm run build

# Expone el puerto 3000 en el contenedor
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]