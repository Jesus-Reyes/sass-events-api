# Etapa 1: build
FROM node:18 AS builder
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el código y construir
COPY . .
RUN npm run build

# Etapa 2: runtime
FROM node:18
WORKDIR /app

# Copiar solo lo necesario del build
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --only=production

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "dist/main.js"]
