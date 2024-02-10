import { FC } from "react";

interface PageProps {
  params: {
    agencyId: string;
  };
}

const Page: FC<PageProps> = ({ params: { agencyId } }) => {
  return <div>{agencyId}</div>;
};

export default Page;
