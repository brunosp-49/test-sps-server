import { z } from "zod";

const userTypeSchema = z.enum(["admin", "user"], {
  message: "type must be 'admin' or 'user'",
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  type: userTypeSchema,
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  type: userTypeSchema.optional(),
  password: z.string().min(1).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().min(1, "User id is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
