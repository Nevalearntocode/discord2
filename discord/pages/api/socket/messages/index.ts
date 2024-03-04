"use server";

import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { auth } from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allow" });
  }
  try {
    const session = await auth(req, res);

    const { content, fileUrl } = req.body;
    const { serverUrl, channelId } = req.query;

    console.log(session);

    return res.status(200).json("something");
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
