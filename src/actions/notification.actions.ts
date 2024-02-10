"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await currentUser();
  let userData;
  if (!authUser) {
    const res = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: {
              id: subaccountId,
            },
          },
        },
      },
    });

    if (res) {
      userData = res;
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    });
  }
  if (!userData) {
    console.log("Could not find user");
    return;
  }

  let foundAgencyId = agencyId;

  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error("AgencyId or SubaccountId is required");
    }

    const res = await db.subAccount.findUnique({
      where: {
        id: subaccountId,
      },
    });

    if (res) foundAgencyId = res.agencyId;
  }

  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: {
            id: subaccountId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const notifications = await db.notification.findMany({
      where: {
        agencyId,
      },
      include: {
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.log(error);
  }
};
