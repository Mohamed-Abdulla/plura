"use server";
import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Agency, User } from "@prisma/client";

export const getAgencyDetails = async (agencyId: string) => {
  try {
    const agency = await db.agency.findUnique({
      where: {
        id: agencyId,
      },
      include: {
        SubAccount: true,
      },
    });
    return agency;
  } catch (error) {
    console.log(error);
  }
};

export const updateAgencyDetails = async (agencyId: string, agencyDetails: Partial<Agency>) => {
  const res = await db.agency.update({
    where: { id: agencyId },
    data: {
      ...agencyDetails,
    },
  });
  return res;
};

export const deleteAgency = async (agencyId: string) => {
  const res = await db.agency.delete({
    where: { id: agencyId },
  });
  return res;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,

    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });
  return userData;
};

export const upsertAgency = async (agency: Agency) => {
  if (!agency.companyEmail) return null;

  try {
    //insert or update agency
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });
    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};
