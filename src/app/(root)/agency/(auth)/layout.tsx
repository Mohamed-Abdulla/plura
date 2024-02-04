import { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <div className="h-full flex items-center justify-center">{children}</div>;
};
