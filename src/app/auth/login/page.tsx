import LoginForm from "@/components/form/loginForm";
import AuthLayout from "@/components/layouts/auth";

export default async function LoginPage() {
  return (
    <>
      <AuthLayout
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
}