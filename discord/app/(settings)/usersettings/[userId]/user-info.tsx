"use client";

import React, { useEffect } from "react";
import { Profile, User } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  user: User & {
    profile: Profile | null;
  };
};

const formSchema = z.object({
  name: z.string().min(1, { message: "User name is required." }),
  hashtag: z
    .string()
    .min(1, { message: "User hash tag is required." })
    .regex(/^[a-zA-Z]+#[0-9]{4}$/),
  image: z.string(),
});

const UserInfo = ({ user }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      hashtag: user.profile?.hashtag,
      image: user.image || "",
    },
  });

  useEffect(() => {
    if (user.name) {
      form.setValue("name", user.name);
    }

    if (user.profile?.hashtag) {
      form.setValue("hashtag", user.profile.hashtag);
    }
    if (user.image) {
      form.setValue("image", user.image);
    }
  }, [form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/usersettings/updateprofile`, data);
      router.refresh();
      toast.success("Your settings have been saved!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-8"
      >
        <div className="xl:row-span-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="h-full p1 w-full flex items-center justify-start">
                        <FormControl>
                          <FileUpload
                            endpoint="profileImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex flex-col xl:items-center gap-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={user.name || "john doe"}
                    {...field}
                    className="bg-zinc-200/90 xl:w-[328px] w-full dark:bg-zinc-900/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="mt-2" />
          <FormField
            control={form.control}
            name="hashtag"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Hashtag</FormLabel>
                <FormControl>
                  <Input
                    className="bg-zinc-200/90 xl:w-[328px] w-full dark:bg-zinc-900/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={user.profile?.hashtag || "johndoe#1234"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-2 xl:mt-8 flex items-center justify-between">
          <Button
            variant={`secondary`}
            className="w-1/4"
            onClick={(e) => {
              e.preventDefault();
              form.reset();
              router.refresh();
            }}
          >
            Reset
          </Button>
          <Button variant={`primary`} className="w-1/4" type="submit">
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserInfo;
