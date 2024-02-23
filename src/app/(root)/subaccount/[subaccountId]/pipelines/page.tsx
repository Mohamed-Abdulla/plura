import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: {
    subaccountId: string;
  };
}

const Page: FC<PageProps> = async ({ params: { subaccountId } }) => {
  const pipelineExists = await db.pipeline.findFirst({
    where: {
      subAccountId: subaccountId,
    },
  });

  if (pipelineExists) return redirect(`/subaccount/${subaccountId}/pipelines/${pipelineExists.id}`);
  try {
    const response = await db.pipeline.create({
      data: { name: "First Pipeline", subAccountId: subaccountId },
    });

    return redirect(`/subaccount/${subaccountId}/pipelines/${response.id}`);
  } catch (error) {
    console.log(error);
  }
};

export default Page;
