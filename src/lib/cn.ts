/** クラス名を連結する小さなヘルパー。falsy な値は捨てる。 */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
