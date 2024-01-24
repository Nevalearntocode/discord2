import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700 to-[#313338]">
      <div className="space-y-6 text-center text-zinc-200">
        <h1 className="text-6xl font-semibold  drop-shadow-md">Discord</h1>
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
