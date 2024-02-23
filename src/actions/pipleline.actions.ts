"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

export const getPipelineDetails = async (pipelineId: string) => {
  return await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });
};

export const getAllPipelines = async (subAccountId: string) => {
  return await db.pipeline.findMany({
    where: {
      subAccountId: subAccountId,
    },
  });
};

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const res = await db.lane.findMany({
    where: {
      pipelineId: pipelineId,
    },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: { order: "asc" },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  });
  return res;
};

export const upsertPipeline = async (pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput) => {
  const res = await db.pipeline.upsert({
    where: {
      id: pipeline.id || v4(),
    },
    update: pipeline,
    create: pipeline,
  });
  return res;
};

export const deletePipeline = async (pipelineId: string) => {
  const res = await db.pipeline.delete({
    where: {
      id: pipelineId,
    },
  });
  return res;
};
