import { getAgencyDetails } from "@/actions/agency.actions";
import { getAuthUserDetailsOnly } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { FC } from "react";
import { AgencyDetails } from "../../_components/agency-details";
import { UserDetails } from "./_components/user-details";

interface PageProps {
  params: {
    agencyId: string;
  };
}

const Page: FC<PageProps> = async ({ params: { agencyId } }) => {
  const authUser = await currentUser();

  if (!authUser) return null;

  const userDetails = await getAuthUserDetailsOnly(authUser.emailAddresses[0].emailAddress);
  if (!userDetails) return null;

  const agencyDetails = await getAgencyDetails(agencyId);

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;
  return (
    <div className="flex lg:flex-row flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails type="agency" agencyId={agencyId} subAccounts={subAccounts} userData={userDetails} />
    </div>
  );
};

export default Page;
