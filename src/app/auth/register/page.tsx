import RegisterForm from "@/components/form/registerForm";
import AuthLayout from "@/components/layouts/auth";

export default function RegisterPage() {
  return (
    <>
      <AuthLayout
      >
        <RegisterForm />
      </AuthLayout>
    </>
  );
}