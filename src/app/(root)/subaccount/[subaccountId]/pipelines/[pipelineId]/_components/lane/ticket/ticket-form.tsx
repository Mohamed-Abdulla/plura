"use client";
import { searchContacts } from "@/actions/contacts.actions";
import { getSubAccountTeamMembers } from "@/actions/tickets.actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal";
import { TicketFormSchema } from "@/schemas";
import { TicketWithTags } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Tag, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { setTimeout } from "timers/promises";
import { z } from "zod";

interface TicketFormProps {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
}

export const TicketForm: FC<TicketFormProps> = ({ getNewTicket, laneId, subaccountId }) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  //ticket can be assigned for one contact only
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);

  const [assignedTo, setAssignedTo] = useState(defaultData.ticket?.Assigned?.id || "");
  //for search debounce
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  //subaccount team members to assign ticket
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name || "",
      description: defaultData.ticket?.description || "",
      value: String(defaultData.ticket?.value || 0),
    },
  });
  const isLoading = form.formState.isLoading;

  useEffect(() => {
    if (subaccountId) {
      const fetchData = async () => {
        const res = await getSubAccountTeamMembers(subaccountId);
        if (res) {
          setAllTeamMembers(res);
        }
      };
      fetchData();
    }
  }, [subaccountId]);

  //if we try to update a default ticket data, we need to set the default values from modal we passed
  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || "",
        description: defaultData.ticket.description || "",
        value: String(defaultData.ticket.value || 0),
      });

      //for stripe payment

      if (defaultData.ticket.customerId) {
        setContact(defaultData.ticket.customerId);
      }

      const fetchData = async () => {
        const res = await searchContacts(defaultData.ticket?.Customer?.name || "");
        setContactList(res);
      };
      fetchData();
    }
  }, [defaultData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
    </Card>
  );
};
