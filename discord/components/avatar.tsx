import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarIcon } from "@radix-ui/react-icons";

export function UserAvatar({ imageUrl }: { imageUrl: string }) {
  return (
    <Avatar>
      <AvatarImage src={imageUrl} alt={imageUrl} />
      <AvatarFallback>
        <AvatarIcon className="w-full h-full" />
      </AvatarFallback>
    </Avatar>
  );
}
