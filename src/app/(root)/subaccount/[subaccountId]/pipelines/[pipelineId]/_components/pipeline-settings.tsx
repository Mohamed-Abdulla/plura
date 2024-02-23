"use client";
import { Pipeline } from "@prisma/client";
import { FC } from "react";
import { CreatePipelineForm } from "./create-pipeline-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deletePipeline } from "@/actions/pipleline.actions";
import { saveActivityLogsNotification } from "@/actions/notification.actions";
interface PipelineSettingsProps {
  pipelineId: string;
  pipelines: Pipeline[];
  subaccountId: string;
}

export const PipelineSettings: FC<PipelineSettingsProps> = ({ pipelineId, pipelines, subaccountId }) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    const res = await deletePipeline(pipelineId);
                    await saveActivityLogsNotification({
                      description: `deleted pipeline ${res.name}`,
                      agencyId: undefined,
                      subaccountId: subaccountId,
                    });
                    toast.success("Pipeline deleted");
                    router.replace(`/subaccount/${subaccountId}/pipelines`);
                  } catch (error) {
                    toast.error("Failed to delete pipeline");
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>

        <CreatePipelineForm subAccountId={subaccountId} defaultData={pipelines.find((p) => p.id === pipelineId)} />
      </div>
    </AlertDialog>
  );
};
