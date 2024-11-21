FROM node:18

WORKDIR /app

# Copiar solo el package.json primero
COPY Server/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de Server
COPY Server/ .

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]