import { getMedia } from "@/actions/media.actions";
import { _getTicketsWithAllRelations, getTicketWithTags } from "@/actions/tickets.actions";
import {
  __getUsersWithAgencySubAccountPermissionsSidebarOptions,
  getAuthUserDetails,
  getUserPermissions,
} from "@/actions/user.actions";
import { Contact, Lane, Notification, Prisma, Tag, Ticket } from "@prisma/client";

type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        agencyId: string | null;
      };
    } & Notification)[]
  | undefined;

type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<typeof getUserPermissions>;

type AuthUserWithAgencySidebarOptionsSubAccounts = Prisma.PromiseReturnType<typeof getAuthUserDetails>;

type UsersWithAgencySubAccountPermissionsSidebarOptions = Prisma.PromiseReturnType<
  typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
>;

type GetMediaData = Prisma.PromiseReturnType<typeof getMedia>;

type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput;

type TicketAndTags = Ticket & {
  Tags: Tag[];
  Assigned: User | null;
  Customer: Contact | null;
};
type LaneDetail = Lane & {
  Tickets: TicketAndTags[];
};

type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketWithTags>;
type TicketDetails = Prisma.PromiseReturnType<typeof _getTicketsWithAllRelations>;
