export type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null | string;
};
