declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    PEXELS_API_KEY: string;
    PORT: string;
    ORIGIN: string;
    EMAIL_FROM: string;
    RESEND_API_KEY: string;
  }
}
