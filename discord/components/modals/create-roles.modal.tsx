"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { RoleSchema, ServerSchema } from "@/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Permission, Role, Server } from "@prisma/client";
import { ServerWithMembersWithProfile } from "@/types";
import { Badge } from "../ui/badge";

const CreateRolesModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "roles";

  const { isPermitted, server } = data;

  const form = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: "",
      permission: "ACCESS",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof RoleSchema>) => {
    try {
      axios.post(`/api/servers/${server?.url}/roles`, {
        name: data.name,
        permission: data.permission,
        isPermitted,
      });
      form.reset();
      router.refresh();
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
            Manage server roles.
          </DialogTitle>
          <div className="flex items-center justify-center gap-x-2">
            {server?.roles?.map((role) => (
              <Badge key={role.id} variant={"secondary"}>
                {role.name}
              </Badge>
            ))}
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Role name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Role name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Role's permission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                        {Object.values(Permission).map((permission) => (
                          <SelectItem
                            key={permission}
                            value={permission}
                            className="dark:hover:bg-zinc-300 dark:hover:text-black capitalize"
                          >
                            {permission === "FULLACCESS"
                              ? "Full ACCESS"
                              : permission === "READONLY"
                              ? "READ ONLY"
                              : permission}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-8">
              <Button disabled={isLoading} variant={`secondary`}>
                Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRolesModal;
