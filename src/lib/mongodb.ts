// import mongoose from 'mongoose';

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your MONGODB_URI to .env.local');
// }

// const MONGODB_URI: string = process.env.MONGODB_URI;

// // Define a global type for caching mongoose connection
// declare global {
//   var mongooseCache: {
//     conn: mongoose.Connection | null;
//     promise: Promise<mongoose.Connection> | null;
//   };
// }

// // Initialize the global cache for the first time
// global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

// async function connectDB(): Promise<mongoose.Connection> {
//   if (global.mongooseCache.conn) {
//     return global.mongooseCache.conn;
//   }

//   if (!global.mongooseCache.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose.connection;
//     });
//   }

//   try {
//     global.mongooseCache.conn = await global.mongooseCache.promise;
//   } catch (error) {
//     global.mongooseCache.promise = null;
//     throw error;
//   }

//   return global.mongooseCache.conn;
// }

// export default connectDB;
