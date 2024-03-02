import Image from "next/image";
import React from "react";

type Props = {
  imageUrl: string;
};

const ServerAvatar = ({ imageUrl }: Props) => {
  return (
    <div className="w-full flex items-center justify-center">
      <Image
        src={imageUrl}
        alt="server-avatar"
        width={480}
        height={480}
        className="w-5/6 h-5/6 rounded-md cursor-auto"
      />
    </div>
  );
};

export default ServerAvatar;
