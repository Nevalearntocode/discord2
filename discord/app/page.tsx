import { auth } from "@/auth";
import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth();

  if (user) {
    return redirect("/settings");
  }

  if (!user) {
    return redirect(`/auth/login`);
  }

  return (
    <main className="flex h-full flex-col items-center justify-center dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700 to-[#313338]">
      <div className="space-y-6 text-center dark:text-zinc-200">
        <h1 className="text-6xl font-semibold drop-shadow-md">Discord</h1>
        <p className=" text-lg">A simple discord clone</p>
        <div>
          <LoginButton>
            <Button variant={`secondary`} size={`lg`}>
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
