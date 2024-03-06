"use client";

import React, { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Profile } from "@prisma/client";
import { Loader2 } from "lucide-react";
import "@livekit/components-styles";

type Props = {
  chatId: string;
  video: boolean;
  audio: boolean;
  profile: Profile;
};

const MediaRoom = ({ audio, chatId, video, profile }: Props) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!profile.name) {
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${profile.name
            .split(" ")
            .join("")}`
        );
        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [profile, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
