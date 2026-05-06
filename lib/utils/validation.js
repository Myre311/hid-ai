import { z } from "zod";

export const branchSchema = z.enum(["specialist", "engineer", "business"]);

export const phoneSchema = z
  .string()
  .min(8, "Numéro trop court")
  .max(20, "Numéro trop long")
  .regex(/^\+[1-9]\d{6,18}$/, "Format E.164 invalide (ex. +2250707000000)");

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, "Code à 6 chiffres requis");

export const profileStep1Schema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(80),
  lastName: z.string().min(1, "Nom requis").max(80),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (AAAA-MM-JJ)"),
  country: z.string().min(2, "Pays requis"),
  city: z.string().min(1, "Ville requise").max(120),
});

export const profileStep2Schema = z.object({
  lastDiploma: z.string().min(1, "Diplôme requis").max(160),
  institution: z.string().min(1, "Établissement requis").max(160),
  graduationYear: z
    .number()
    .int()
    .min(1960)
    .max(new Date().getFullYear() + 1),
});

export const ENGINEER_SKILLS = [
  "NLP",
  "Vision par ordinateur",
  "RLHF",
  "Optimisation",
  "Médical",
  "Financier",
];

export const profileStep3EngineerSchema = z.object({
  skills: z.array(z.enum(ENGINEER_SKILLS)).min(1, "Au moins une compétence"),
  languages: z.array(z.string()).min(1, "Au moins une langue"),
  yearsXp: z.number().int().min(0).max(60),
});

export const businessStep1Schema = z.object({
  companyName: z.string().min(1).max(200),
  registrationNumber: z.string().min(1).max(40),
  sector: z.string().min(1),
  country: z.string().min(2),
  size: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]),
});

export const businessStep2Schema = z.object({
  email: z.string().email("E-mail invalide"),
  phone: phoneSchema,
});

export const SERVICE_TYPES = ["annotation", "rlhf", "recrutement"];

export const businessStep3Schema = z.object({
  serviceTypes: z.array(z.enum(SERVICE_TYPES)).min(1),
});
