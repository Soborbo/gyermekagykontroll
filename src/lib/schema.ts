import { z } from "zod";

export const signupSchema = z.object({
  courseType: z.enum(["gyermekagykontroll", "tantorta"], {
    required_error: "Kérjük, válasszon tanfolyamot!",
  }),
  courseDate: z.string().min(1, "Kérjük, válasszon időpontot!"),
  grade: z.string().min(1, "Kérjük, válasszon osztályt!"),
  parentAttends: z.enum(["igen", "nem"]).optional(),
  childName: z.string().min(2, "Kérjük, adja meg a résztvevő nevét! (min. 2 karakter)"),
  successSubject: z.string().optional(),
  specialAttention: z.enum(["igen", "nem"], {
    required_error: "Kérjük, válasszon!",
  }),
  psychiatricTreatment: z.enum(["igen", "nem"], {
    required_error: "Kérjük, válasszon!",
  }),
  specialAttentionReason: z.string().optional(),
  discount: z.enum(["none", "sibling", "repeat", "agykontroll"]),
  photoConsent: z.enum(["igen", "nem"]).optional(),
  parentName: z.string().min(2, "Kérjük, adja meg a nevét! (min. 2 karakter)"),
  parentEmail: z.string().email("Kérjük, adjon meg érvényes email címet!"),
  parentPhone: z.string().min(6, "Kérjük, adjon meg érvényes telefonszámot!"),
  message: z.string().optional(),
});

export type SignupFormData = z.infer<typeof signupSchema>;
