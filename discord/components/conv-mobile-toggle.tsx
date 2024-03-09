import { Menu, Search } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/navigation-sidebar";
import DMSidebar from "./dms/dm-sidebar";

type Props = {
  search?: boolean;
};

const ConvMobileToggle = ({ search }: Props) => {
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
      </SheetContent>
    </Sheet>
  );
};

export default ConvMobileToggle;
