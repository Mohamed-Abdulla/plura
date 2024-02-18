"use client";
import { useModal } from "@/hooks/use-modal";
import { userDataSchema } from "@/schemas";
import { AuthUserWithAgencySidebarOptionsSubAccounts, UserWithPermissionsAndSubAccounts } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubAccount, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  z,
} from "../components-imports";
import { FileUpload } from "@/components/file-upload";
import { Loading } from "@/components/loading";
import { changeUserPermissions, getAuthUserDetails, getUserPermissions, updateUser } from "@/actions/user.actions";
import { saveActivityLogsNotification } from "@/actions/notification.actions";
import { toast } from "sonner";
import { da } from "date-fns/locale";
import { v4 } from "uuid";

interface UserDetailsProps {
  type: "agency" | "subaccount";
  agencyId: string | null;
  subAccounts: SubAccount[];
  userData?: Partial<User>;
}

export const UserDetails: FC<UserDetailsProps> = ({ agencyId, subAccounts, type, userData }) => {
  const [subAccountPermissions, setSubAccountPermissions] = useState<UserWithPermissionsAndSubAccounts | null>(null);

  const { data, setClose } = useModal();
  const [roleState, setRoleState] = useState("");
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] = useState<AuthUserWithAgencySidebarOptionsSubAccounts | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const res = await getAuthUserDetails();
        if (res) {
          setAuthUserData(res);
        }
      };
      fetchDetails();
    }
  }, [data]);

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permission = await getUserPermissions(data.user?.id);
      setSubAccountPermissions(permission);
    };
    getPermissions();
  }, [data, form]);

  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [userData, data]);

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!agencyId) return;
    if (userData || data?.user) {
      const updatedUser = await updateUser(values);
      authUserData?.Agency?.SubAccount.filter((subacc) =>
        authUserData.Permissions.find((p) => p.subAccountId === subacc.id && p.access)
      ).forEach(async (subaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} information`,
          subaccountId: subaccount.id,
        });
      });

      if (updatedUser) {
        toast.success("Update User Information");
        setClose();
        router.refresh();
      } else {
        toast.error("Could not update user information");
      }
    } else {
      console.log("Error could not submit");
    }
  };

  const onChangePermission = async (subAccountId: string, val: boolean, permissionId: string | undefined) => {
    if (!data?.user?.email) return;
    setLoadingPermissions(true);
    const response = await changeUserPermissions(
      permissionId ? permissionId : v4(),
      data?.user?.email,
      subAccountId,
      val
    );

    if (type === "agency") {
      await saveActivityLogsNotification({
        agencyId: authUserData?.Agency?.id,
        description: `Gave ${userData?.name} access to | ${
          subAccountPermissions?.Permissions.find((p) => p.subAccountId === subAccountId)?.SubAccount.name
        } `,
        subaccountId: subAccountPermissions?.Permissions.find((p) => p.subAccountId === subAccountId)?.SubAccount.id,
      });
    }

    if (response) {
      toast.success("Permission changed");

      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((p) => {
          if (p.subAccountId === subAccountId) {
            return { ...p, access: !p.access };
          }
          return p;
        });
      }
    } else {
      toast.error("Could not change permission");
    }
    router.refresh();
    setLoadingPermissions(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload apiEndPoint="avatar" value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={userData?.role === "AGENCY_OWNER" || form.formState.isSubmitting}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    //agency owner should not be able to change their role
                    disabled={field.value === "AGENCY_OWNER"}
                    onValueChange={(value) => {
                      if (value === "SUBACCOUNT_USER" || value === "SUBACCOUNT_GUEST") {
                        setRoleState("You need to have subaccounts to assign Subaccount access to team members.");
                      } else {
                        setRoleState("");
                      }
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      {(data?.user?.role === "AGENCY_OWNER" || userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">Agency Owner</SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">Sub Account User</SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">Sub Account Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save User Details"}
            </Button>

            {data?.user?.role === "AGENCY_OWNER" && (
              <div>
                <Separator className="my-4" />
                <FormLabel> User Permissions</FormLabel>
                <FormDescription className="mb-4">
                  You can give Sub Account access to team member by turning on access control for each Sub Account. This
                  is only visible to agency owners
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {subAccounts?.map((subAccount) => {
                    const subAccountPermissionsDetails = subAccountPermissions?.Permissions.find(
                      (p) => p.subAccountId === subAccount.id
                    );
                    return (
                      <div key={subAccount.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p>{subAccount.name}</p>
                        </div>
                        <Switch
                          disabled={loadingPermissions}
                          checked={subAccountPermissionsDetails?.access}
                          onCheckedChange={(permission) => {
                            onChangePermission(subAccount.id, permission, subAccountPermissionsDetails?.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
