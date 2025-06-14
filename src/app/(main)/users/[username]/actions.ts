"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { streamServerClient } from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        ...validatedValues,
        customLayout: validatedValues.customLayout ?? undefined,
        themeColor: validatedValues.themeColor ?? undefined,
      },
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.displayName,
        // Store theme color in Stream for consistent UI across platforms
        customData: {
          themeColor: validatedValues.themeColor,
        },
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
