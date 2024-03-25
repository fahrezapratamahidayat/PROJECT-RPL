import LoginForm from "@/components/form/loginForm";
import AuthLayout from "@/components/layouts/auth";

export default async function LoginPage() {
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
