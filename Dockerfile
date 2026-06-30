#####################################################################
#                            Build Stage                            #
#####################################################################
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

#####################################################################
#                            Final Stage                            #
#####################################################################
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA-like fallback for static Astro site
RUN printf 'server {\n  listen 80;\n  location / {\n    root /usr/share/nginx/html;\n    index index.html;\n    try_files $uri $uri/index.html $uri.html =404;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]