// import { auth, signOut } from "@/auth";
import { initalProfile } from "../lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import UserButton from "@/components/user-button";
import InitialModal from "@/components/modals/initial-modal";

export default async function Home() {
  const profile = await initalProfile();
  if (!profile) {
    return redirect(`/`);
  }
  return redirect(`/dms`);
}
