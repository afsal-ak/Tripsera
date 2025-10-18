export function parseJsonFields<T extends Record<string, any>>(data: T, fields: (keyof T)[]): T {
  const parsed: any = { ...data };

  fields.forEach((field) => {
    const val = parsed[field];
    if (typeof val === 'string') {
      try {
        parsed[field] = JSON.parse(val);
      } catch {
        // keep as string if not valid JSON
      }
    }
  });

  return parsed;
}
