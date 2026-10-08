import { supabase } from "./supabase";
import { contactSchema, newsletterSchema, type ContactInput } from "./forms";
export async function submitContactRequest(
  input: ContactInput,
): Promise<string> {
  const value = contactSchema.parse(input);
  const { data, error } = await supabase.rpc("submit_contact_request", {
    p_name: value.name,
    p_email: value.email,
    p_phone: value.phone,
    p_service: value.service,
    p_options: value.options,
    p_details: value.details,
    p_message: value.message,
    p_consent: value.consent,
    p_website: value.website,
  });
  if (error) throw error;
  if (typeof data !== "string" || !data)
    throw new Error("Request not confirmed.");
  return data;
}
export async function subscribeNewsletter(input: {
  email: string;
  consent: boolean;
  website: string;
}): Promise<void> {
  const value = newsletterSchema.parse(input);
  const { data, error } = await supabase.rpc("subscribe_newsletter", {
    p_email: value.email,
    p_consent: value.consent,
    p_website: value.website,
  });
  if (error) throw error;
  if (data !== true) throw new Error("Subscription not confirmed.");
}
