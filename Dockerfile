# Stage 1 - the build process
FROM node:18 as build-deps
WORKDIR /usr/src/app
COPY package.json ./
# RUN yarn
COPY . ./
RUN yarn install --legacy-peer-deps
RUN yarn build

# Stage 2 - the production environment
FROM nginx:stable-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
