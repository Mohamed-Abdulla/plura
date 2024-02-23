"use client";
import { useModal } from "@/hooks/use-modal";
import { Pipeline } from "@prisma/client";
import { FC, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CustomModal } from "@/components/custom-modal";
import { CreatePipelineForm } from "./create-pipeline-form";
interface PipelineInfoBarProps {
  pipelineId: string;
  subaccountId: string;
  pipelines: Pipeline[];
}

export const PipelineInfoBar: FC<PipelineInfoBarProps> = ({ pipelineId, pipelines, subaccountId }) => {
  const { setOpen: setOpenModal } = useModal();
  const [value, setValue] = useState(pipelineId);

  const handleClickCreatePipeline = () => {
    setOpenModal(
      <CustomModal
        title="Create a Pipeline"
        subheading="Pipelines allows you to group tickets into lanes and track your business processes all in one place."
      >
        <CreatePipelineForm subAccountId={subaccountId} />
      </CustomModal>
    );
  };
  return (
    <div>
      <div className="flex items-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-[200px] justify-between">
              {value ? pipelines.find((pipeline) => pipeline.id === value)?.name : "Select a pipeline..."}{" "}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No pipelines found.</CommandEmpty>
                <CommandGroup heading="Pipelines">
                  {pipelines.map((pipeline) => (
                    <Link key={pipeline.id} href={`/subaccount/${subaccountId}/pipelines/${pipeline.id}`}>
                      <CommandItem
                        key={pipeline.id}
                        value={pipeline.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", value === pipeline.id ? "opacity-100" : "opacity-0")} />
                        {pipeline.name}
                      </CommandItem>
                    </Link>
                  ))}
                  <Button variant="secondary" className="flex gap-2 w-full mt-4" onClick={handleClickCreatePipeline}>
                    <Plus size={15} />
                    Create Pipeline
                  </Button>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
