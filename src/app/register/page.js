
import RegisterForm from "@/components/authComponent/RegisterForm";
import React from "react";

export const metadata = {
  title: 'NaS-Register',
  description: 'Create your account',
};

const Register = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default Register;
