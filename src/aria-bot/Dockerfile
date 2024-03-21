FROM node:21-alpine3.18 as builder

RUN corepack enable && corepack prepare npm@latest --activate
ENV NPM_HOME=/usr/local/bin

WORKDIR /app

RUN mkdir /app/tmp

COPY package.json package-lock.yaml ./

RUN apk add --no-cache \
      nss \
      git \
      freetype \
      harfbuzz \
      ca-certificates \
      libpq-dev \
      g++ \
      make \
      python3 \
      ttf-freefont

COPY . .
RUN npm i
RUN npm build

#Etapa de producción
FROM builder as deploy

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/package-lock.yaml ./

RUN npm install --frozen-lockfile --production
CMD ["npm", "start"]