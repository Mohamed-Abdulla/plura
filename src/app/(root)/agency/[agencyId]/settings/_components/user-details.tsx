import { SubAccount, User } from "@prisma/client";
import { FC } from "react";

interface UserDetailsProps {
  type: "agency" | "subaccount";
  agencyId: string;
  subAccounts: SubAccount[];
  userData?: Partial<User>;
}

export const UserDetails: FC<UserDetailsProps> = ({ agencyId, subAccounts, type, userData }) => {
  return <div>userDetails</div>;
};
