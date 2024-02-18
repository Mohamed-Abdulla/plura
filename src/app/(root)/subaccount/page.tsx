import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/actions/user.actions";
import { Unauthorized } from "@/components/unauthorized";
import { redirect } from "next/navigation";
import { FC } from "react";

interface PageProps {
  searchParams: { state: string; code: string };
}

const Page: FC<PageProps> = async ({ searchParams: { code, state } }) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) return <Unauthorized />;
  const user = await getAuthUserDetails();
  if (!user) return;
  const getFirstSubaccountWithAccess = user.Permissions.find((permission) => permission.access === true);

  if (state) {
    const statePath = state.split("___")[0];
    const stateSubaccountId = state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(`/subaccount/${stateSubaccountId}/${statePath}?code=${code}`);
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }
  return <Unauthorized />;
};

export default Page;
