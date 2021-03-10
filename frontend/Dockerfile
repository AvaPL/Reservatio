FROM node:15-alpine
EXPOSE 3000
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
CMD ["npm", "start"]