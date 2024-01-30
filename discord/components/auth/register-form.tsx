"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import CardWrapper from "@/components/auth/card-wrapper";
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
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { useState, useTransition } from "react";
import axios from "axios";
// import { signIn } from "@/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        await axios.post(`/api/auth/register`, data);
        // await axios.post(`/api/auth/login`, data);
        signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: DEFAULT_LOGIN_REDIRECT,
        });
        // await signIn("credentials", {
        //   email: data.email,
        //   password: data.password,
        // });
        router.refresh();
        router.push("/settings");
      } catch (error: any) {
        const errorMessage = error.response.data.error.message;
        setError(errorMessage);
      }
    });
  };

  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Log In"
      headerLabel="Welcome"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@example.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-center flex-col gap-y-6">
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-black bg-zinc-300 dark:text-white dark:bg-slate-700 hover:bg-zinc-400 dark:hover:bg-slate-600 transition"
          >
            Confirm
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
