"use server";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";
import { Role } from "@prisma/client";

export const sendInvitation = async (role: Role, email: string, agencyId: string) => {
  const response = await db.invitation.create({
    data: {
      email,
      role,
      agencyId,
    },
  });

  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
  return response;
};
