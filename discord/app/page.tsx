// import { auth, signOut } from "@/auth";
import { initalProfile } from "../lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import UserButton from "@/components/user-button";
import InitialModal from "@/components/modals/initial-modal";

export default async function Home() {
  const profile = await initalProfile();
  // const session = await auth();

  // console.log(session);

  // console.log(profile.userId);

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.url}`);
  }

  return (
    <div>
      {/* <UserButton prof  ile={profile} /> */}
      <InitialModal />
    </div>
  );
}
