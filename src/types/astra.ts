export interface AstraClient {
    namespace: (name: string) => {
      collection: (name: string) => AstraCollection;
    };
  }
  
  export interface AstraCollection {
    create: (document: any) => Promise<{ documentId: string }>;
    find: (query: object) => Promise<{ data: any[] }>;
    // Add other collection methods as needed
  }