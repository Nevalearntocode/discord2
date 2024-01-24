import React from "react";
import CardWrapper from "@/components/auth/card-wrapper";

const LoginForm = () => {
  return (
    <CardWrapper
      backButtonHref="/auth/register"
      backButtonLabel="Create an account"
      headerLabel="Welcome"
      showSocial
    >
      LoginForm
    </CardWrapper>
  );
};

export default LoginForm;
