// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             id: "credentials",
//             name: "Credentials",
//             credentials: {
//                 email: {label:"Username", type :'text'},
//                 password: {label:'Password', type:'password'}
//             },
//             async authorize(credentials: any ):Promise <any>{
//                 await dbConnect()
//                 try{
//                     const user = await UserModel.findOne({
//                         $or: [
//                             {email: credentials.identifier},
//                             {username: credentials.identifier}
//                         ]
//                     })
//                     if (!user){
//                         throw new Error('No user found with this email')
//                     }
//                     const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
//                     if (isPasswordCorrect){
//                         return user
//                     } else{
//                         throw new Error('Incorrect Password')
//                     }

//                 } catch(err: any){
//                     throw new Error(err)

//                 }
//             }
//         })
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//     callbacks: {
        
//         async jwt({ token, user}) {
//             if (user) {
//                 token._id = user._id?.toString()
//                 token.isVerified =user.isVerified;
//                 token.isAcceptingMessages

//             }
//           return token
//         },
//         async session({ session, token }) {
//             return session
//           },
//     },
//     session: {
//         strategy: "jwt"
//     }

// }