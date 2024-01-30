import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-zinc-400 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700 to-[#313338]">
      {children}
    </div>
  );
};

export default AuthLayout;
