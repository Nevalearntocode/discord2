"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const Escape = (props: Props) => {
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  return (
    <button
      className="group rounded-full bg-transparent border-2 border-zinc-400 hover:border-zinc-300 p-2 transition"
      onClick={onClick}
    >
      <X className="dark:text-zinc-400 group-hover:text-zinc-300" />
    </button>
  );
};

export default Escape;
