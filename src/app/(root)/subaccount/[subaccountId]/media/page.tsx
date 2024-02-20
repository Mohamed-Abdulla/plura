import BlurPage from "@/components/blur-page";
import { FC } from "react";
import { MediaComponent } from "./_components/media-component";
import { getMedia } from "@/actions/media.actions";

interface PageProps {
  params: { subaccountId: string };
}

const Page: FC<PageProps> = async ({ params: { subaccountId } }) => {
  const data = await getMedia(subaccountId);
  return (
    <BlurPage>
      <MediaComponent data={data} subaccountId={subaccountId} />
    </BlurPage>
  );
};

export default Page;
