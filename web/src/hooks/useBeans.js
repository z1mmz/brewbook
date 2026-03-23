import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import beansService from "../services/beans";
import LoginContext from "../contexts/loginContext";
import { toaster } from "../components/ui/toaster";

const useBeans = () => {
  const queryClient = useQueryClient();
  const { loggedInUser } = useContext(LoginContext);

  const beansQuery = useQuery({
    queryKey: ["myBeans"],
    queryFn: beansService.getMyBeans,
    enabled: !!loggedInUser,
  });

  const createBeanMutation = useMutation({
    mutationFn: (bean) => beansService.createBean(bean),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBeans"] });
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        title: "Failed to save bean",
        description: error.response?.data?.error || "Something went wrong",
      });
    },
  });

  const updateBeanMutation = useMutation({
    mutationFn: ({ id, bean }) => beansService.updateBean(id, bean),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBeans"] });
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        title: "Failed to update bean",
        description: error.response?.data?.error || "Something went wrong",
      });
    },
  });

  const deleteBeanMutation = useMutation({
    mutationFn: (id) => beansService.deleteBean(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBeans"] });
    },
    onError: () => {
      toaster.create({ type: "error", title: "Failed to delete bean" });
    },
  });

  return {
    beans: beansQuery.data ?? [],
    isLoading: beansQuery.isLoading,
    createBean: (bean) => createBeanMutation.mutate(bean),
    updateBean: (id, bean) => updateBeanMutation.mutate({ id, bean }),
    deleteBean: (id) => deleteBeanMutation.mutate(id),
    isCreating: createBeanMutation.isPending,
    isUpdating: updateBeanMutation.isPending,
  };
};

export default useBeans;
