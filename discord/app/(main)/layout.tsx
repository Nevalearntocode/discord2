import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  return (
    <div className="h-full">
      {/* responsive */}
      {/* fixed width 72px */}
      <div className="hidden lg:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      {/* children has padding left 72px = fixed width of navigation sidebar */}
      <main className="lg:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
