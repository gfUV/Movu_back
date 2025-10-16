declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    PEXELS_API_KEY: string;
    PORT: string;
    ORIGIN: string;
    SENDGRID_API_KEY: string;
    EMAIL_USER: string;
  }
}
