import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarIcon } from "@radix-ui/react-icons";

export function UserAvatar({ imageUrl }: { imageUrl: string | null }) {
  return (
    <Avatar className="h-[48px] w-[48px]">
      {imageUrl && <AvatarImage src={imageUrl} alt={imageUrl} />}
      <AvatarFallback>
        <AvatarIcon className="w-full h-full" />
      </AvatarFallback>
    </Avatar>
  );
}
