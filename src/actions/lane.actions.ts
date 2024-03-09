"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;

  //if there is no order then we will create a new order for the lane
  //else, we will use that order passing from the client

  if (!lane.order) {
    //means there is no order, so we will create a new order
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    });

    order = lanes.length;
  } else {
    //means there is
    order = lane.order;
  }
  const res = await db.lane.upsert({
    where: {
      id: lane.id || v4(),
    },
    update: lane,
    create: {
      ...lane,
      order,
    },
  });

  return res;
};

export const deleteLane = async (id: string) => {
  return await db.lane.delete({
    where: {
      id,
    },
  });
};
