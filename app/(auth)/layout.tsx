import React from "react";

export type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="flex justify-center pt-20 pb-5">{children}</div>;
};

export default AuthLayout;
