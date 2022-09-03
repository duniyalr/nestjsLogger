export const scapeSqlLikeOperator = (str: string): string => {
  return str.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_")
}