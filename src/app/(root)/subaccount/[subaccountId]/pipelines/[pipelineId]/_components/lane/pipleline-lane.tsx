import { useModal } from "@/hooks/use-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Lane } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface LaneProps {
  index: number;
  key: string;
  subaccountId: string;
  pipelineId: string;
  laneDetails: Lane;
}

export const PipelineLane: FC<LaneProps> = ({ index, key, laneDetails, pipelineId, subaccountId }) => {
  const { setOpen } = useModal();
  const router = useRouter();
  return <Draggable key={key} draggableId={laneDetails.id.toString()} index={index}></Draggable>;
};
