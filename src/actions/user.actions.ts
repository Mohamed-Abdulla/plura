"use server";

import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { saveActivityLogsNotification } from "./notification.actions";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;

  const data = await db.user.create({
    data: {
      ...user,
    },
  });
  return data;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  //check if invitation exists
  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    //adding that user to db
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      id: user.id,
      agencyId: invitationExists.agencyId,
      email: invitationExists.email,
      role: invitationExists.role,
      avatarUrl: user.imageUrl,
      name: `${user.firstName} ${user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: `Joined`,
      subaccountId: undefined,
    });

    //update role of our clerk user
    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });

      //delete invitation from db
      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      });

      return userDetails.agencyId;
    } else return null;
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return agency ? agency.agencyId : null;
  }
};
