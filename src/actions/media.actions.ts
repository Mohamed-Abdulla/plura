"use server";

import { db } from "@/lib/db";
import { CreateMediaType } from "@/types";

export const getMedia = async (subaccountId: string) => {
  const media = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: {
      Media: true,
    },
  });
  return media;
};

export const createMedia = async (subaccountId: string, data: CreateMediaType) => {
  const media = await db.media.create({
    data: {
      link: data.link,
      name: data.name,
      subAccountId: subaccountId,
    },
  });

  return media;
};

export const deleteMedia = async (id: string) => {
  const media = await db.media.delete({
    where: {
      id,
    },
  });

  return media;
};
