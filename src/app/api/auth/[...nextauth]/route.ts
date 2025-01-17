// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import bcrypt from "bcryptjs";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Please enter an email and password');
//         }

//         await connectDB();

//         const user = await User.findOne({ email: credentials.email });

//         if (!user) {
//           throw new Error('No user found');
//         }

//         const passwordMatch = await bcrypt.compare(credentials.password, user.password);

//         if (!passwordMatch) {
//           throw new Error('Incorrect password');
//         }

//         return user;
//       }
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/auth/signin",
//   },
// });

// export { handler as GET, handler as POST };
//rjrnf