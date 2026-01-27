FROM node:20-alpine AS base
RUN apk add --no-cache git libc6-compat

FROM base AS builder
WORKDIR /app

# Accept build args for service URLs (for Module Federation)
ARG AI_SERVICE_URL=http://localhost:3002
ARG CRM_SERVICE_URL=http://localhost:3003
ARG ERP_SERVICE_URL=http://localhost:3004
ARG FINANCE_SERVICE_URL=http://localhost:3005
ARG PDV_SERVICE_URL=http://localhost:3006
ARG RPG_SERVICE_URL=http://localhost:3007
ARG SSO_SERVICE_URL=http://localhost:3001

# Set as environment variables for Vite build
ENV AI_SERVICE_URL=$AI_SERVICE_URL
ENV CRM_SERVICE_URL=$CRM_SERVICE_URL
ENV ERP_SERVICE_URL=$ERP_SERVICE_URL
ENV FINANCE_SERVICE_URL=$FINANCE_SERVICE_URL
ENV PDV_SERVICE_URL=$PDV_SERVICE_URL
ENV RPG_SERVICE_URL=$RPG_SERVICE_URL
ENV SSO_SERVICE_URL=$SSO_SERVICE_URL

COPY package.json ./
COPY .npmrc* ./
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-timeout 1200000 && \
    npm config set fetch-retries 10 && \
    npm install --legacy-peer-deps

COPY . .
RUN mkdir -p public
# PATCH: Fix unused @ts-expect-error in @gaqno-development/frontcore
RUN find node_modules -name useDialogForm.ts -exec sed -i '/@ts-expect-error/d' {} +
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html/public

# Copy nginx config (create if needed)
RUN echo 'server { \
    listen 3000; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
