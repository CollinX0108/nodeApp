FROM node:18

WORKDIR /app

# Copiar package.json y package-lock.json
COPY Server/package*.json ./

# Instalar todas las dependencias, incluyendo devDependencies
RUN npm install --production=false

# Copiar el resto del código
COPY Server/ .

# Instalar type-graphql y otras dependencias necesarias explícitamente
RUN npm install --save-dev typescript @types/node
RUN npm install type-graphql reflect-metadata @apollo/server graphql class-validator

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]