"use client";

import { Globe } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

type Props = {};

const DMsNav = (props: Props) => {
  const router = useRouter();

  return (
    <button
      className="group flex items-center"
      onClick={() => router.push(`/dms`)}
    >
      <div className="flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center dark:bg-neutral-700 group-hover:bg-indigo-500">
        <Globe
          className="group-hover:text-white transition text-indigo-500"
          size={25}
        />
      </div>
    </button>
  );
};

export default DMsNav;
