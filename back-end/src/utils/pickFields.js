// utils/pickFields.js
export function pickFields(source, allowedFields) {
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => allowedFields.includes(key))
  );
}
