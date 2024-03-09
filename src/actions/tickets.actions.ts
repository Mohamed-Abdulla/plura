"use server";

import { db } from "@/lib/db";

export const getTicketWithTags = async (pipelineId: string) => {
  const res = await db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: {
      Tags: true,
      Assigned: true,
      Customer: true,
    },
  });
  return res;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const res = await db.ticket.findMany({
    where: {
      laneId,
    },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  });
  return res;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  const subaccountUsersWithAccess = await db.user.findMany({
    where: {
      Agency: {
        SubAccount: {
          some: {
            id: subaccountId,
          },
        },
      },
      role: "SUBACCOUNT_USER",
      Permissions: {
        some: {
          subAccountId: subaccountId,
          access: true,
        },
      },
    },
  });

  return subaccountUsersWithAccess;
};
