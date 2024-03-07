// import { auth, signOut } from "@/auth";
import { initalProfile } from "../lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";

export default async function Home() {
  const profile = await initalProfile();

  if (!profile) {
    return redirect(`/`);
  }

  return redirect(`/dms`);

  // const server = await db.server.findFirst({
  //   where: {
  //     members: {
  //       some: {
  //         profileId: profile.id,
  //       },
  //     },
  //   },
  // });

  // if (server) {
  //   return redirect(`/servers/${server.url}`);
  // }

  // return (
  //   <div>
  //     <InitialModal />
  //   </div>
  // );
}
