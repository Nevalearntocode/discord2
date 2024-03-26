"use client";

import { FriendRequestSChema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  status: string;
};

const DMNavItem = ({ status }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FriendRequestSChema>>({
    resolver: zodResolver(FriendRequestSChema),
    defaultValues: {
      hashtag: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof FriendRequestSChema>) => {
    try {
      await axios.post(`/api/friendrequest`, data);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {status === "add friend" && (
        <div className="flex flex-col px-8 py-4">
          <p className="uppercase font-bold">{status}</p>
          <span className="text-xs text-zinc-400 mt-2 my-4">
            You can add friends with their user hashtag.
          </span>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-x-4"
            >
              <FormField
                control={form.control}
                name="hashtag"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        {...field}
                        placeholder="username#1234"
                        className="bg-zinc-200/90 w-[328px] dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" variant={"primary"} disabled={isSubmitting}>
                Send friend request
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default DMNavItem;
