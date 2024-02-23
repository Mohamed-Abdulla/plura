"use client";

import { CustomModal } from "@/components/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { LaneDetail } from "@/types";
import { Pipeline } from "@prisma/client";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface PipelineViewProps {
  lanes: LaneDetail[];
  pipelineDetails: Pipeline;
  pipelineId: string;
  subaccountId: string;
}

export const PipelineView: FC<PipelineViewProps> = ({ pipelineDetails, pipelineId, subaccountId, lanes }) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const handleAddLane = () => {
    setOpen(
      <CustomModal title=" Create A Lane" subheading="Lanes allow you to group tickets">
        hey
      </CustomModal>
    );
  };

  return (
    <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{pipelineDetails?.name}</h1>
        <Button className="flex items-center gap-4" onClick={handleAddLane}>
          <Plus size={15} />
          Create Lane
        </Button>
      </div>
      {allLanes.length == 0 && (
        <div className="flex items-center justify-center w-full flex-col">
          <div className="opacity-100">
            <Flag width="100%" height="100%" className="text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};
