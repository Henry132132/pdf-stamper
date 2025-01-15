FROM node:16

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install --production

COPY index.js /app/

EXPOSE 3000

CMD ["npm", "start"]
