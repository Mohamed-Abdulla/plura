import React from "react";
import { Navigation } from "./_components/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default layout;
