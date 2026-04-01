import type { User, UserProgress, ChatMessage } from "@prisma/client";

export type { User, UserProgress, ChatMessage };

export type SafeUser = Omit<User, "hashedPassword">;
