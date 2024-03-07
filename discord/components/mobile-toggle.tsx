import { Menu, Search } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import MemberSidebar from "./server/member-sidebar";

type Props = {
  serverSlug: string;
  search?: boolean;
};

const MobileToggle = ({ serverSlug, search }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="lg:hidden">
          {search ? <Search /> : <Menu />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={search ? "right" : "left"}
        className="flex gap-0 bg-inherit w-full p-0"
      >
        {!search && (
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
        )}
        {search ? (
          <MemberSidebar serverSlug={serverSlug} />
        ) : (
          <ServerSidebar serverSlug={serverSlug} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
