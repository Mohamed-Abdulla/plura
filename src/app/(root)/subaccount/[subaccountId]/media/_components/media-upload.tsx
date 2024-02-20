"use client";
import { CustomModal } from "@/components/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { FC } from "react";
import { MediaForm } from "./media-form";

interface MediaUploadProps {
  subaccountId: string;
}

export const MediaUpload: FC<MediaUploadProps> = ({ subaccountId }) => {
  const { isOpen, setOpen, setClose } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal title="Upload Media" subheading="Upload a file to your media bucket">
            <MediaForm subaccountId={subaccountId} />
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
};
