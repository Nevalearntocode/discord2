import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-white dark:bg-[#313338]", opensans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="customize-discord"
        >
          <SocketProvider>
            <ModalProvider />
            {children}
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
