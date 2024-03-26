"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .trim() // Remove leading/trailing whitespace
    .regex(/\d/, "Password must contain at least one digit (0-9)")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter (A-Z)"
    ),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .trim() // Remove leading/trailing whitespace
    .regex(/\d/, "Password must contain at least one digit (0-9)")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter (A-Z)"
    ),
});

const ChangePasswordModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "changePassword";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        await axios.patch("/api/usersettings/changepassword", {
          newPassword: data.password,
        });
        form.reset();
        router.refresh();
        onClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-8 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Change your password
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      New password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="*******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Confirm new password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="*******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-8">
              <Button disabled={isLoading} variant={`secondary`}>
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
