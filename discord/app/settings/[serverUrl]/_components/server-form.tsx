"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import FileUpload from "@/components/file-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerSchema } from "@/schemas";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Server } from "@prisma/client";
import * as z from "zod";

type Props = {
  server: Server;
};

const ServerForm = ({ server }: Props) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ServerSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("image", server.imageUrl);
    }
  }, [form, server]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof ServerSchema>) => {
    try {
      form.reset();
      router.refresh();
      router.push(`/servers/${data.name.split(" ").join("-")}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-8"
        >
          <div className="flex gap-x-8 w-full justify-between">
            <div className="flex items-center justify-center text-center">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="serverImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Server name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      placeholder="Server name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="ml-auto gap-x-2 flex">
            <Button disabled={isLoading} variant={`secondary`}>
              Cancel
            </Button>
            <Button disabled={isLoading} variant={`primary`}>
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ServerForm;
