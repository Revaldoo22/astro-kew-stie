// src/utils/mapper.ts
export function mapData<T>(
  data: Record<string, any> | Record<string, any>[],
  schema: Record<string, any>
): T | T[] {
  if (Array.isArray(data)) {
    return data.map((item) => mapData<T>(item, schema)) as T[];
  }

  const result: any = {};
  for (const key in schema) {
    const backendKey = schema[key];

    // kalau schema[key] berupa object → berarti nested mapping
    if (typeof backendKey === "object" && !Array.isArray(backendKey)) {
      result[key] = mapData(data[key], backendKey);
    }
    // kalau schema[key] berupa array → berarti sub array
    else if (Array.isArray(backendKey)) {
      const [subSchema, sourceKey] = backendKey;
      
      // Handle recursive schema (when subSchema is "self")
      const actualSubSchema = subSchema === "self" ? schema : subSchema;
      
      result[key] = Array.isArray(data[sourceKey])
        ? data[sourceKey].map((item: any) => mapData(item, actualSubSchema))
        : [];
    }
    // kalau field biasa
    else {
      result[key] = data[backendKey] ?? null;
    }
  }
  return result as T;
}
