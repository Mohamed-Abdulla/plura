"use client";
import { saveActivityLogsNotification } from "@/actions/notification.actions";
import { deleteSubAccount } from "@/actions/subaccount.actions";
import { useRouter } from "next/navigation";
import { FC, Fragment } from "react";

interface DeleteButtonProps {
  subaccountId: string;
  subaccountName: string;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ subaccountId, subaccountName }) => {
  const router = useRouter();

  const handleDelete = async () => {
    // const response = await getSubaccountDetails(subaccountId);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a subaccount | ${subaccountName}`,
      subaccountId,
    });
    await deleteSubAccount(subaccountId);
    router.refresh();
  };
  return (
    <div className="text-white" onClick={handleDelete}>
      Delete Sub Account
    </div>
  );
};
