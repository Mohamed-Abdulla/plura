import { getAllPipelines, getLanesWithTicketAndTags, getPipelineDetails } from "@/actions/pipleline.actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LaneDetail } from "@/types";
import { redirect } from "next/navigation";
import { FC } from "react";
import { PipelineInfoBar } from "./_components/pipeline-info-bar";
import { PipelineSettings } from "./_components/pipeline-settings";
import { PipelineView } from "./_components/pipeline-view";

interface PageProps {
  params: {
    subaccountId: string;
    pipelineId: string;
  };
}

const Page: FC<PageProps> = async ({ params: { subaccountId, pipelineId } }) => {
  const pipelineDetails = await getPipelineDetails(pipelineId);
  if (!pipelineDetails) return redirect(`/subaccount/${subaccountId}/pipelines`);

  const pipelines = await getAllPipelines(subaccountId);
  const lanes = (await getLanesWithTicketAndTags(pipelineId)) as LaneDetail[];

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfoBar pipelineId={pipelineId} subaccountId={subaccountId} pipelines={pipelines} />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes}
          pipelineDetails={pipelineDetails}
          pipelineId={pipelineId}
          subaccountId={subaccountId}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings pipelineId={pipelineId} pipelines={pipelines} subaccountId={subaccountId} />
      </TabsContent>
    </Tabs>
  );
};

export default Page;
