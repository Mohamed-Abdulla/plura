"use client";

import { CustomModal } from "@/components/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { LaneDetail } from "@/types";
import { Pipeline } from "@prisma/client";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { LaneForm } from "./lane/lane-form";
import { PipelineLane } from "./lane/pipleline-lane";

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
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    );
  };

  const onDragEnd = (result: DropResult) => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button className="flex items-center gap-4" onClick={handleAddLane}>
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <Droppable droppableId="lanes" type="lane" direction="horizontal" key="lanes">
          {(provided) => (
            <div
              className="flex item-center gap-x-2 overflow-scroll"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex mt-4">
                {allLanes.map((lane, index) => (
                  <PipelineLane
                    index={index}
                    key={lane.id}
                    subaccountId={subaccountId}
                    pipelineId={pipelineId}
                    laneDetails={lane}
                  />
                ))}
              </div>
            </div>
          )}
        </Droppable>

        {allLanes.length == 0 && (
          <div className="flex items-center justify-center w-full flex-col">
            <div className="opacity-100">
              <Flag width="100%" height="100%" className="text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};
