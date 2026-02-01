FROM node:20-alpine AS base
RUN apk add --no-cache git libc6-compat

FROM base AS builder
WORKDIR /app

ARG MFE_AI_URL=http://localhost:3002
ARG MFE_CRM_URL=http://localhost:3003
ARG MFE_ERP_URL=http://localhost:3004
ARG MFE_FINANCE_URL=http://localhost:3005
ARG MFE_PDV_URL=http://localhost:3006
ARG MFE_RPG_URL=http://localhost:3007
ARG MFE_SSO_URL=http://localhost:3001
ARG MFE_SAAS_URL=http://localhost:3008
ARG MFE_OMNICHANNEL_URL=http://localhost:3010

ARG VITE_SERVICE_SSO_URL=http://localhost:4001
ARG VITE_SERVICE_AI_URL=http://localhost:4002
ARG VITE_SERVICE_CRM_URL=http://localhost:3004
ARG VITE_SERVICE_ERP_URL=http://localhost:3005
ARG VITE_SERVICE_FINANCE_URL=http://localhost:4005
ARG VITE_SERVICE_PDV_URL=http://localhost:4006
ARG VITE_SERVICE_RPG_URL=http://localhost:4007
ARG VITE_SERVICE_OMNICHANNEL_URL=http://localhost:4010

ENV MFE_AI_URL=$MFE_AI_URL
ENV MFE_CRM_URL=$MFE_CRM_URL
ENV MFE_ERP_URL=$MFE_ERP_URL
ENV MFE_FINANCE_URL=$MFE_FINANCE_URL
ENV MFE_PDV_URL=$MFE_PDV_URL
ENV MFE_RPG_URL=$MFE_RPG_URL
ENV MFE_SSO_URL=$MFE_SSO_URL
ENV MFE_SAAS_URL=$MFE_SAAS_URL
ENV MFE_OMNICHANNEL_URL=$MFE_OMNICHANNEL_URL
ENV VITE_SERVICE_SSO_URL=$VITE_SERVICE_SSO_URL
ENV VITE_SERVICE_AI_URL=$VITE_SERVICE_AI_URL
ENV VITE_SERVICE_CRM_URL=$VITE_SERVICE_CRM_URL
ENV VITE_SERVICE_ERP_URL=$VITE_SERVICE_ERP_URL
ENV VITE_SERVICE_FINANCE_URL=$VITE_SERVICE_FINANCE_URL
ENV VITE_SERVICE_PDV_URL=$VITE_SERVICE_PDV_URL
ENV VITE_SERVICE_RPG_URL=$VITE_SERVICE_RPG_URL
ENV VITE_SERVICE_OMNICHANNEL_URL=$VITE_SERVICE_OMNICHANNEL_URL

COPY package.json ./
COPY .npmrc* ./
ARG NPM_TOKEN
RUN if [ -n "$NPM_TOKEN" ]; then \
    printf '%s\n' "@gaqno-development:registry=https://npm.pkg.github.com" "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc; \
    fi
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-timeout 1200000 && \
    npm config set fetch-retries 10 && \
    npm install --legacy-peer-deps --include=dev

COPY . .
RUN find node_modules -name useDialogForm.ts -exec sed -i '/@ts-expect-error/d' {} +
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
