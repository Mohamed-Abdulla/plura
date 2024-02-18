import { db } from "@/lib/db";
import { FC } from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { currentUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { SendInvitation } from "./_components/send-invitation";

interface PageProps {
  params: {
    agencyId: string;
  };
}

const Page: FC<PageProps> = async ({ params: { agencyId } }) => {
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
  if (!authUser) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      columns={columns}
      data={teamMembers}
      filterValue="name"
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
    />
  );
};

export default Page;
