"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { ServerSchema } from "@/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import FileUpload from "@/components/file-upload";
import { useEffect } from "react";

const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const { server, isPermitted } = data;

  const isModalOpen = isOpen && type === "editServer";

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
      await axios.patch(`/api/servers/${server?.url}`, {
        name: data.name,
        image: data.image,
        isPermitted,
      });
      form.reset();
      router.refresh();
      router.push(`/servers/${data.name.split(" ").join("-")}`);
      onClose();
    } catch (error) {
      console.log(error);
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
            Manage your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Customize your server
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
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
            <DialogFooter className="mt-8">
              <Button disabled={isLoading} variant={`secondary`}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
