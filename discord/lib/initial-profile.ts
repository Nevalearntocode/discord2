import { auth } from "@/auth";
import { db } from "./db";
import { redirect } from "next/navigation";

export const initalProfile = async () => {
  const session = await auth();

  if (!session) {
    redirect(`/auth/login`);
  }

  const user = session.user;

  if (!user) {
    redirect(`/auth/login`);
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id as string,
      name: user.name as string,
      email: user.email as string,
      imageUrl: user.image as string,
      hashtag:
        user.name?.split(" ").join("") +
        "#" +
        (Math.floor(Math.random() * 10000) + 10000).toString().substring(1),
    },
  });

  return newProfile;
};
