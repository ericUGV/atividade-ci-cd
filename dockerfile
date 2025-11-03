# Usa a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia APENAS o package.json e o package-lock.json (se existir)
# Isso otimiza o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos da aplicação
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]