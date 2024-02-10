import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import { FC } from "react";
import { AgencyDetails } from "./(auth)/_components/agency-details";

interface PageProps {
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  };
}

const Page: FC<PageProps> = async ({ searchParams: { plan, state, code } }) => {
  // if they comes from invitation
  const agencyId = await verifyAndAcceptInvitation();
  //get user details
  const user = await getAuthUserDetails();

  //check what access they have and redirect to the right page
  if (agencyId) {
    //we check user role and navigate to the right page
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      //check for search params
      if (plan) {
        //send to billing page by passing the plan and show plan
        return redirect(`/agency/${agencyId}/billing?plan=${plan}`);
      }
      //for stripe connect,

      if (state) {
        const statePath = state.split("___")[0];
        const stateAgencyId = state.split("___")[1];

        if (!stateAgencyId) return <div>Not authorized</div>;
        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${code}`);
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return <div>Not authorized</div>;
    }
  }
  const authUser = await currentUser();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl"> Create An Agency</h1>
        <AgencyDetails data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }} />
      </div>
    </div>
  );
};

export default Page;
