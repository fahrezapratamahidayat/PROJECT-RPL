import LoginForm from "@/components/form/loginForm";
import AuthLayout from "@/components/layouts/auth";

type Props = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
  callbackUrl: string;
};

export default async function LoginPage({ params, searchParams, callbackUrl }: Props) {
  return (
    <>
      <AuthLayout
        link="/auth/register"
        description="Belum punya akun?"
        descriptionLink="Sign up"
        title="Login"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
}
