import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { Button } from "./ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { toast } from "sonner";

interface FileUploadProps {
  apiEndPoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
}

export const FileUpload: FC<FileUploadProps> = ({ apiEndPoint, onChange, value }) => {
  //get the file type
  const type = value?.split(".").pop();

  //to display the image / file

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image src={value} alt="uploaded image" className="object-contain rounded-md" fill />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
            <Button onClick={() => onChange("")} variant="ghost" type="button">
              <X className="h-4 w-4" />
              Remove Logo
            </Button>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndPoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          toast.error("Oppse!", {
            description: "Something went wrong while uploading the file. Please try again.",
          });
        }}
      />
    </div>
  );
};
