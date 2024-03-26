"use client";

import { User } from "@prisma/client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

type Props = {
  user: User;
};

const formSchema = z.object({
  password: z.string().min(1, { message: "User password is required." }),
});

const ChangePassword = ({ user }: Props) => {
  const router = useRouter();
  const [ChangePassword, setChangePassword] = useState(false);
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (user.password) {
        const passwordMatch = await bcrypt.compare(
          data.password,
          user.password
        );
        if (passwordMatch) {
          onOpen("changePassword");
        } else {
          toast.error("Incorrect password!");
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {ChangePassword ? (
          <div className="w-full flex">
            <div className="flex flex-col w-1/2 gap-y-4 ml-auto pl-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="**********"
                        type="password"
                        {...field}
                        className="bg-zinc-200/90 w-full dark:bg-zinc-900/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-2 xl:mt-8 flex items-center justify-between">
                <Button
                  variant={`secondary`}
                  className="w-1/4"
                  onClick={(e) => {
                    e.preventDefault();
                    setChangePassword(false);
                  }}
                >
                  cancel
                </Button>
                <Button variant={`primary`} className="w-1/4" type="submit">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full pl-10">
            <Button
              onClick={(e) => {
                e.preventDefault();
                setChangePassword(true);
              }}
              className="w-1/2 ml-auto"
            >
              Change password
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default ChangePassword;
