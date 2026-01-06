interface EnvConfig {
  API_BASE_URL: string
  AUTH_TOKEN: string
  NODE_ENV: string
  KEYCLOAK_URL: string
}

export const env: EnvConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN as string, // NOTE: For development only
  NODE_ENV: import.meta.env.MODE,
  KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL as string,
}
