import { useMutation } from "@tanstack/react-query";
import usersService from "../services/users";

export const useUser = () => {
  const createUserMutation = useMutation({
    mutationFn: (credentials) => {
      return usersService.createUser(credentials);
    },
    onSuccess: (CreatedUser) => {
      console.log("login onSuccess", CreatedUser);
    },
  });

  return {
    createUser: (credentials) => createUserMutation.mutate(credentials),
  };
};
