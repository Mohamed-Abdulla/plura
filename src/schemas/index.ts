import * as z from "zod";

export const agencyDetailsFormSchema = z.object({
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars." }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
});

export const subaccountDetailsFormSchema = z.object({
  name: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string().min(1),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
});

export const userDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string(),
  role: z.enum(["AGENCY_OWNER", "AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]),
});

export const invitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(["AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]),
});

export const mediaSchema = z.object({
  link: z.string().min(1, { message: "Media File is required!" }),
  name: z.string().min(1, { message: "Name is required!" }),
});

export const createPipelineFormSchema = z.object({
  name: z.string().min(1),
});
export const LaneFormSchema = z.object({
  name: z.string().min(1),
});

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;
export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), { message: "Value must be a valid price" }),
});
