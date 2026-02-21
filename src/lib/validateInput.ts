import { z } from "zod";

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: ValidationErrorDetail[],
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; errors: ValidationErrorDetail[] } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
1;
