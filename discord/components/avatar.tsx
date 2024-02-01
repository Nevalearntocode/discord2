import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarIcon } from "@radix-ui/react-icons";

export function UserAvatar({ imageUrl }: { imageUrl: string | null }) {
  return (
    <Avatar>
      {imageUrl && <AvatarImage src={imageUrl} alt={imageUrl} />}
      <AvatarFallback>
        <AvatarIcon className="w-full h-full" />
      </AvatarFallback>
    </Avatar>
  );
}
