import { userWithProfile } from "@/lib/user-with-profile";
import { redirect } from "next/navigation";

type Props = {};

const UserSettings = async (props: Props) => {
  const user = await userWithProfile();

  if (!user) {
    return redirect(`/`);
  }

  return redirect(`/usersettings/${user.id}`);
};

export default UserSettings;
