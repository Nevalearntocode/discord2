"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { UserAvatar } from "./avatar";
import { signOut } from "next-auth/react";
import { Profile } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";

const someSchema = z.object({
  name: z.string(),
  id: z.string().min(4).max(4),
});

const UserButton = ({ profile }: { profile: Profile }) => {
  const onLogOut = () => {
    signOut();
  };

  const form = useForm<z.infer<typeof someSchema>>({
    resolver: zodResolver(someSchema),
    defaultValues: {
      name: profile.name,
      id: profile.id,
    },
  });

  const onSubmit = (data: z.infer<typeof someSchema>) => {
    console.log(data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={`ghost`} size={`icon`} className="rounded-full">
          <UserAvatar
            imageUrl={profile.imageUrl}
            className="h-[48px] w-[48px]"
          />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="dark:bg-zinc-800">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-x-12">
                  <FormLabel className="w-1/6">Name</FormLabel>
                  <FormControl>
                    <Input placeholder={profile.name} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-x-12">
                  <FormLabel className="w-1/6">ID</FormLabel>
                  {/* <div className="flex flex-col"> */}
                  <FormControl>
                    <Input
                      placeholder={profile.id}
                      {...field}
                      // pattern="[0-9]{4}"
                      // maxLength={4}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  {/* </div> */}
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-x-9 mt-6">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant={`destructive`} onClick={onLogOut}>
                Log Out
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UserButton;
