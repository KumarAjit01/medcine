// src/lib/mongodb.ts
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  clientPromise = client.connect();
}

/**
 * Connects to the MongoDB database and returns a Db instance.
 * It uses a cached client promise to avoid multiple connections.
 * @param dbName - The name of the database to connect to. Defaults to 'OnlineMedicineDB' if not provided.
 * @returns A Promise that resolves to a Db instance.
 */
export async function connectToDatabase(dbName: string = 'OnlineMedicineDB'): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;