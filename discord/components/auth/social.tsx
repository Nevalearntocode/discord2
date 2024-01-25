"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        className="w-full text-black bg-zinc-300 dark:text-white dark:bg-slate-700 hover:bg-zinc-400 dark:hover:bg-slate-600 transition"
        variant={`outline`}
        size={`lg`}
        onClick={() => {}}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        className="w-full text-black bg-zinc-300 dark:text-white dark:bg-slate-700 hover:bg-zinc-400 dark:hover:bg-slate-600 transition"
        variant={`outline`}
        size={`lg`}
        onClick={() => {}}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Social;
