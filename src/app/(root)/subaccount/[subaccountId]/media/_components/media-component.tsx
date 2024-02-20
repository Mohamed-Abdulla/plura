import { GetMediaData } from "@/types";
import { FC } from "react";
import { MediaUpload } from "./media-upload";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { MediaCard } from "./media-card";

interface MediaComponentProps {
  data: GetMediaData;
  subaccountId: string;
}

export const MediaComponent: FC<MediaComponentProps> = ({ data, subaccountId }) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUpload subaccountId={subaccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandGroup heading="Media Files">
          <CommandList className="pb-49 max-h-full">
            <CommandEmpty>No Media Files</CommandEmpty>
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media.map((media) => (
                <CommandItem
                  key={media.id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={media} />
                </CommandItem>
              ))}
            </div>
          </CommandList>
        </CommandGroup>
      </Command>
    </div>
  );
};
