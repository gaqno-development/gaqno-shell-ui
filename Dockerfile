FROM node:20-alpine AS base
RUN apk add --no-cache git libc6-compat

FROM base AS builder
WORKDIR /app

ARG AI_SERVICE_URL=http://localhost:3002
ARG CRM_SERVICE_URL=http://localhost:3003
ARG ERP_SERVICE_URL=http://localhost:3004
ARG FINANCE_SERVICE_URL=http://localhost:3005
ARG PDV_SERVICE_URL=http://localhost:3006
ARG RPG_SERVICE_URL=http://localhost:3007
ARG SSO_SERVICE_URL=http://localhost:3001

ENV AI_SERVICE_URL=$AI_SERVICE_URL
ENV CRM_SERVICE_URL=$CRM_SERVICE_URL
ENV ERP_SERVICE_URL=$ERP_SERVICE_URL
ENV FINANCE_SERVICE_URL=$FINANCE_SERVICE_URL
ENV PDV_SERVICE_URL=$PDV_SERVICE_URL
ENV RPG_SERVICE_URL=$RPG_SERVICE_URL
ENV SSO_SERVICE_URL=$SSO_SERVICE_URL

COPY package.json ./
COPY .npmrc* ./
ARG NPM_TOKEN
RUN if [ -n "$NPM_TOKEN" ]; then \
    printf '%s\n' "@gaqno-development:registry=https://npm.pkg.github.com" "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc; \
    fi
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-timeout 1200000 && \
    npm config set fetch-retries 10 && \
    npm install --legacy-peer-deps

COPY . .
RUN find node_modules -name useDialogForm.ts -exec sed -i '/@ts-expect-error/d' {} +
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
