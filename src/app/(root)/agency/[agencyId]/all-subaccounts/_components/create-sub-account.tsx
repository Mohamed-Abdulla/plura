"use client";

import { SubAccountDetails } from "@/app/(root)/subaccount/_components/subaccount-details";
import { CustomModal } from "@/components/custom-modal";
import { useModal } from "@/hooks/use-modal";
import { AuthUserWithAgencySidebarOptionsSubAccounts } from "@/types";
import { Agency } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { FC } from "react";
import { Button } from "../../settings/components-imports";
import { cn } from "@/lib/utils";

interface CreateSubAccountProps {
  user: AuthUserWithAgencySidebarOptionsSubAccounts;
  className?: string;
}

export const CreateSubAccount: FC<CreateSubAccountProps> = ({ user, className }) => {
  const { setOpen } = useModal();
  return (
    <Button
      className={cn("w-fit self-end flex gap-2 my-4", className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create A Subaccount"
            subheading="You can switch between your agency account and the subaccount from the sidebar"
          >
            <SubAccountDetails
              agencyDetails={user?.Agency as Agency}
              userId={user?.id as string}
              userName={user?.name as string}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  );
};
