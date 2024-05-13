import { z } from "zod";

export const schemaAddTasksExtended = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  typeTask: z.enum(["personal", "teams"]).refine(val => ["personal", "teams"].includes(val), { message: "Type Task is required" }),
  dueDate: z.string().min(1, { message: "Due Date is required" }),
  dueTime: z.string().min(1, { message: "Due Time is required" }),
  priority: z.enum(["tinggi", "sedang", "kecil"]).refine(val => ["tinggi", "sedang", "kecil"].includes(val), { message: "Priority is required" }),
  assigned: z
  .array(z.string().min(1))
  .max(10).optional(),
  notes: z.string().min(1, { message: "Notes is required" }),
  category: z
    .array(z.string().min(1))
    .max(10)
    .nonempty("Please select at least one framework."),
    attachments: z.string().min(1, { message: "Attachments is required" }),
});

export const schemaEditTasks = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  description: z.string().min(1, { message: "Description is required" }).optional(),
  typeTask: z.enum(["personal", "teams"]).refine(val => ["personal", "teams"].includes(val), { message: "Type Task is required" }).optional(),
  dueDate: z.string().min(1, { message: "Due Date is required" }).optional(),
  dueTime: z.string().min(1, { message: "Due Time is required" }).optional(),
  priority: z.enum(["tinggi", "sedang", "kecil"]).refine(val => ["tinggi", "sedang", "kecil"].includes(val), { message: "Priority is required" }).optional(),
  assigned: z
    .array(z.string().min(1))
    .max(10)
    .optional(),
    statusTask: z.enum(["on going", "completed", "pending", "cancel"]).refine(val => ["on going", "completed", "pending", "cancel"].includes(val), { message: "Status Task is required" }).optional(),
});

export const schemaAddTeamsExtended = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  members: z.array(z.string()).min(1, { message: "Members is required" }),
})

export const schemaEditTeamsExtended = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  description: z.string().min(1, { message: "Description is required" }).optional(),
  members: z.array(z.string()).min(1, { message: "Members is required" }).optional(),
})

export const schemaAddSubstask = z.object({
  subname: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  dueDate: z.string().min(1, { message: "Due Date is required" }),
  dueTime: z.string().min(1, { message: "Due Time is required" }),
})

// members: z.array(z.object({
//   label: z.string(),
//   value: z.string(),
//   id: z.string(),
//   email: z.string(),
//   fullname: z.string(),
//   profileUrl: z.string().optional(),
// })).min(1, { message: "Members is required" }),
// export function useFormSchemaAddTasks() {
//     const form = useForm<z.infer<typeof schemaAddTasksExtended>>({
//       resolver: zodResolver(schemaAddTasksExtended),
//     });
  
//     return form;
//   }

