import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserType } from "@/prisma/types";

type UserAvatarProps = {
  user: UserType;
};

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user?.imageUrl} alt={user?.name} />
        <AvatarFallback className="capitalize">
          {user ? user.name : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-500">
        {user ? user.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;