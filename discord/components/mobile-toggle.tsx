import { Menu, Search } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import MemberSidebar from "./server/member-sidebar";

type Props = {
  serverUrl: string;
  search?: boolean;
};

const MobileToggle = ({ serverUrl, search }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          {search ? <Search /> : <Menu />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={search ? "right" : "left"}
        className="flex gap-0 bg-inherit w-full p-4"
      >
        {!search && (
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
        )}
        {search ? (
          <MemberSidebar serverUrl={serverUrl} />
        ) : (
          <ServerSidebar serverUrl={serverUrl} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
