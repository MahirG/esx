// ETB (Ethiopian Birr) currency formatter
export function formatETB(amount: number, options?: { compact?: boolean }): string {
  if (options?.compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `ETB ${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `ETB ${(amount / 1_000).toFixed(1)}K`;
    }
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + " ETB";
}

export function formatNumber(num: number, compact = false): string {
  if (compact) {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  }
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPercent(num: number): string {
  return `${num > 0 ? "+" : ""}${num.toFixed(1)}%`;
}

// Ethiopian Birr symbol
export const ETB_SYMBOL = "Br";
export const ETB_CODE = "ETB";
