import { NextApiRequest } from "next";
import { db } from "./db";
import { auth } from "@/auth";
import { NextApiResponseServerIo } from "@/types";

export const currentProfilePages = async (
  req: NextApiRequest,
  res: NextApiResponseServerIo
) => {
  const session = await auth(req, res);

  console.log(session?.user?.name);

  if (!session || !session.user) {
    return null;
  }

  const userId = session.user.id;

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
