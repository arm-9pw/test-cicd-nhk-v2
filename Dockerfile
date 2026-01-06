# --- Build stage ---
  FROM node:lts-alpine AS builder
  WORKDIR /app
  COPY package.json yarn.lock ./
  RUN yarn install --frozen-lockfile --production=false
  COPY . .

  # Pass the build arguments to the build stage with UAT defaults
  ARG API_BASE_URL=https://epurth-api-uat.nhkspg.co.th
  ARG KEYCLOAK_URL=https://epuraccount-uat.nhkspg.co.th
  ARG KEYCLOAK_REALM=StandardProject
  ARG KEYCLOAK_CLIENT_ID=nhk-epurchase-bff
  
  # Set environment variables for build using the arguments
  ENV VITE_API_BASE_URL=$API_BASE_URL \
      VITE_KEYCLOAK_URL=$KEYCLOAK_URL \
      VITE_KEYCLOAK_REALM=$KEYCLOAK_REALM \
      VITE_KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
  
  RUN yarn build
    
  # --- runtime stage ---
  FROM node:lts-alpine
  WORKDIR /app

  # Pass the same arguments to the production stage
  ARG API_BASE_URL
  ARG KEYCLOAK_URL
  ARG KEYCLOAK_REALM
  ARG KEYCLOAK_CLIENT_ID
  
  # Set environment variables for runtime using the arguments
  ENV VITE_API_BASE_URL=$API_BASE_URL \
      VITE_KEYCLOAK_URL=$KEYCLOAK_URL \
      VITE_KEYCLOAK_REALM=$KEYCLOAK_REALM \
      VITE_KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
  
  COPY --from=builder /app/dist ./dist
  RUN yarn global add serve
  RUN adduser -D app && chown -R app /app
  USER app
  EXPOSE 8080
  CMD ["serve", "-s", "dist", "-l", "8080"]