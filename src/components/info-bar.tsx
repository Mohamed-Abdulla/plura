"use client";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { FC, useState } from "react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { Bell } from "lucide-react";

interface InfoBarProps {
  notifications: NotificationWithUser | [];
  role?: string;
  className?: string;
  subAgencyId?: string;
}

export const InfoBar: FC<InfoBarProps> = ({ notifications, subAgencyId, className, role }) => {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setShowAll] = useState(true);

  return (
    <>
      <div
        className={cn(
          "fixed z-[20] md:left-[300px] inset-x-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b",
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton afterSignOutUrl="/" />

          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white">
                <Bell size={17} />
              </div>
            </SheetTrigger>
          </Sheet>
        </div>
      </div>
    </>
  );
};
