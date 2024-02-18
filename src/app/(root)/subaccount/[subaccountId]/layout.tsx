import { verifyAndAcceptInvitation } from "@/actions/user.actions";
import { InfoBar } from "@/components/info-bar";
import { Sidebar } from "@/components/sidebar";
import { Unauthorized } from "@/components/unauthorized";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: { subaccountId: string };
}

const Layout: FC<LayoutProps> = async ({ children, params: { subaccountId } }) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) return <Unauthorized />;

  const user = await currentUser();
  if (!user) return redirect("/");

  let notifications: any = [];

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={subaccountId} type="subaccount" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
