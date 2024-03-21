import RegisterForm from "@/components/form/registerForm";
import AuthLayout from "@/components/layouts/auth";

export default function RegisterPage() {
  return (
    <>
      <AuthLayout
        link="/auth/login"
        description="Sudah punya akun?"
        descriptionLink="Sign in"
        title="Create Your Account"
      >
        <RegisterForm />
      </AuthLayout>
    </>
  );
}