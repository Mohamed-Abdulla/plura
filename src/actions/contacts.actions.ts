"use server";

import { db } from "@/lib/db";

export const searchContacts = async (searchTerm: string) => {
  const res = await db.contact.findMany({
    where: {
      name: {
        contains: searchTerm,
      },
    },
  });
  return res;
};
