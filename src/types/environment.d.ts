declare global {
    namespace NodeJS {
      interface ProcessEnv {
        ASTRA_DB_ID: string;
        ASTRA_DB_REGION: string;
        ASTRA_DB_APPLICATION_TOKEN: string;
        NODE_ENV: 'development' | 'production';
      }
    }
  }
  
  export {}