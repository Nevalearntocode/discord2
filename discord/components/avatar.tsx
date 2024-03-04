import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarIcon } from "@radix-ui/react-icons";

export function UserAvatar({
  imageUrl,
  className,
}: {
  imageUrl: string | null;
  className?: string;
}) {
  return (
    <Avatar className={cn("", className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={imageUrl} />}
      <AvatarFallback>
        <AvatarIcon className="w-full h-full" />
      </AvatarFallback>
    </Avatar>
  );
}
