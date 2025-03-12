# Usa uma imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação para o contêiner
COPY . .

# Define a variável de ambiente para o Node.js rodar no modo de produção
ENV NODE_ENV=production

# Comando para rodar o script quando o contêiner iniciar
CMD ["node", "SfmcApiIntegration.js"]
