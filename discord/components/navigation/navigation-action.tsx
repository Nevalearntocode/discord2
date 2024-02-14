import React from "react";
import { Plus } from "lucide-react";
import ActionTooltip from "@/components/action-tooltip";

type Props = {};

const NavigationAction = ({}: Props) => {
  return (
    <div>
      {/* create new server button */}
      <ActionTooltip label="Create new server" side="right" align="center">
        <button className="group flex items-center">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
