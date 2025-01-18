declare module 'long';

declare module '@astrajs/collections' {
  import Long from 'long';

  interface CreateClientOptions {
    astraDatabaseId: string;
    astraDatabaseRegion: string;
    applicationToken: string;
  }

  interface Collection {
    create(document: any): Promise<{ documentId: string }>;
    find(query: any): Promise<{ data: any[] }>;
    findOne(query: any): Promise<{ data: any }>;
    update(documentId: string, document: any): Promise<void>;
    delete(documentId: string): Promise<void>;
  }

  interface Namespace {
    collection(name: string): Collection;
  }

  interface AstraClient {
    namespace(name: string): Namespace;
  }

  export function createClient(options: CreateClientOptions): Promise<AstraClient>;
}