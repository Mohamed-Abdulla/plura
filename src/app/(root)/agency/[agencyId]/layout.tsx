import { getNotificationAndUser } from "@/actions/notification.actions";
import { verifyAndAcceptInvitation } from "@/actions/user.actions";
import { Sidebar } from "@/components/sidebar";
import { Unauthorized } from "@/components/unauthorized";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    agencyId: string;
  };
}

const Layout: FC<LayoutProps> = async ({ children, params }) => {
  const agencyId = await verifyAndAcceptInvitation();

  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/agency");
  }

  if (user.privateMetadata.role !== "AGENCY_OWNER" && user.privateMetadata.role !== "AGENCY_ADMIN") {
    return <Unauthorized />;
  }

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) allNoti = notifications;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">{children}</div>
    </div>
  );
};

export default Layout;
