import { useMutation } from "@tanstack/react-query";
import usersService from "../services/users";
import { toaster } from "../components/ui/toaster";

export const useUser = () => {
  const createUserMutation = useMutation({
    mutationFn: (credentials) => {
      return usersService.createUser(credentials);
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        title: "Sign up failed",
        description: error.response?.data?.error || "Could not create account",
      });
    },
  });

  return {
    createUser: (credentials) => createUserMutation.mutate(credentials),
  };
};
