import { Permission } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Minimum 6 characters",
  }),
});

export const ServerSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  image: z.string().min(1, { message: "Server image is required." }),
});

export const RoleSchema = z.object({
  name: z.string().min(1, { message: "Role name is required." }),
  permission: z.nativeEnum(Permission),
});
