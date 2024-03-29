import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { UserButton, currentUser, useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface NavigationProps {
  user?: null | User;
}

export const Navigation: FC<NavigationProps> = async ({}) => {
  const authUser = await currentUser();
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image src="./assets/plura-logo.svg" width={40} height={40} alt="logo" />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
      <nav className="hidden md:block ">
        <ul className="flex items-center justify-center gap-8">
          <Link href="#">Pricing</Link>
          <Link href="#">About</Link>
          <Link href="#">Documentation</Link>
          <Link href="#">Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link
          href="/agency"
          className={buttonVariants({
            variant: "default",
            size: "sm",
          })}
        >
          {authUser ? "Dashboard" : "Login"}
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};
