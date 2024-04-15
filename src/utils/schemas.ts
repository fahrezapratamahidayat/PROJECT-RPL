import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const schemaAddTasksExtended = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  typeTask: z.enum(["personal", "teams"]).refine(val => ["personal", "teams"].includes(val), { message: "Type Task is required" }),
  dueDate: z.string().min(1, { message: "Due Date is required" }),
  dueTime: z.string().min(1, { message: "Due Time is required" }),
});

// export function useFormSchemaAddTasks() {
//     const form = useForm<z.infer<typeof schemaAddTasksExtended>>({
//       resolver: zodResolver(schemaAddTasksExtended),
//     });
  
//     return form;
//   }

