import SignInButton from './signin-button';

export default async function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold">Sign In</h1>
        <SignInButton />
      </div>
    </div>
  );
}
