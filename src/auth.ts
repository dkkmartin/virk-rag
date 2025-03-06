import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      if (
        auth?.user?.email === process.env.ALLOWED_EMAIL &&
        auth?.user?.name === process.env.ALLOWED_GITHUB_USERNAME
      ) {
        return !!auth;
      }
      return false;
    },
  },
});
