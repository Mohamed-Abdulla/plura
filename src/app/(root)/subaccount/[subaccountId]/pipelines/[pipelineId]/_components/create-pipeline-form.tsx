import { FC, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPipelineFormSchema } from "@/schemas";
import { Pipeline } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { upsertPipeline } from "@/actions/pipleline.actions";
import { saveActivityLogsNotification } from "@/actions/notification.actions";
interface CreatePipelineFormProps {
  defaultData?: Pipeline;
  subAccountId: string;
}

export const CreatePipelineForm: FC<CreatePipelineFormProps> = ({ subAccountId, defaultData }) => {
  const router = useRouter();
  const { data, isOpen, setOpen, setClose } = useModal();

  const form = useForm<z.infer<typeof createPipelineFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(createPipelineFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });
  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof createPipelineFormSchema>) => {
    if (!subAccountId) return;

    try {
      const res = await upsertPipeline({
        ...values,
        id: defaultData?.id,
        subAccountId,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updates a pipeline | ${res?.name}`,
        subaccountId: subAccountId,
      });

      toast.success("Pipeline created successfully");
      setClose();
      router.refresh();
    } catch (error) {
      toast.error("Oopse!", {
        description: "Could not save pipeline details",
      });
      setClose();
    }
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
