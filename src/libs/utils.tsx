export function shortenAddress(address: string | undefined) {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 4)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
}

export const isJson = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const copyToClipboard = (text: string, cb: () => void) => {
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(text).then(cb);
  } else if (document.queryCommandSupported("copy")) {
    const ele = document.createElement("textarea");
    ele.value = text;
    document.body.appendChild(ele);
    ele.select();
    document.execCommand("copy");
    document.body.removeChild(ele);
    cb?.();
  }
};

export const exponentToSubscript = (expo: number) => {
  const subscriptNumbers = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

  const number = expo
    .toString()
    .split("")
    .map((n) => subscriptNumbers[+n])
    .join("");
  return number || "";
};

export const shortenString = (
  string: string,
  maxLength: number = 15,
  ellipsis = true
): string => {
  if (!string) return "";
  if (string.length <= maxLength) {
    return string;
  }
  return string.slice(0, maxLength) + (ellipsis ? "..." : "");
};

export const getTradeSide = (
  order: "Buy" | "Sell" | "Add" | "Remove",
  prefix: string = "text"
) => {
  prefix = prefix || "text";
  switch (order) {
    case "Buy":
      return `${prefix}-green`;
    case "Add":
      return `${prefix}-purple`;
    case "Remove":
      return `${prefix}-yellow`;
    case "Sell":
    default:
      return `${prefix}-red`;
  }
};

export const formatPercent = (percent: number | undefined) => {
  if (!percent) {
    return 0;
  }

  if (percent < 0) {
    return <span className="text-red">{percent.toFixed(2)}%</span>;
  } else {
    return <span className="text-white">{percent.toFixed(2)}%</span>;
  }
};

export const formatPrice = (
  price: number | undefined,
  decimals: number = 4
) => {
  if (!price) return `$0`;
  return `$${Number(price.toFixed(decimals))}`;
};

export const buySellColor = (value: number) => {
  return value > 0 ? "text-green" : value < 0 ? "text-red" : "text-white";
};

export const formatNumber = (num: number, decimals: number = 2) => {
  if (!Number(num)) return 0;
  return Number(num.toFixed(decimals));
};

export const formatDuration = (time: number) => {
  if (!Number(time)) return "-";

  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor((time / (60 * 60)) % 24);
  const days = Math.floor((time / (60 * 60 * 24)) % 30);

  let res = "";
  if (days > 0) res += `${days}d `;
  if (hours > 0) res += `${hours}h `;
  if (minutes > 0) res += `${minutes}m `;

  return res;
};

export const formatShortMoment = (time: number) => {
  const moment = (Date.now() - time) / 1000;

  const seconds = Math.floor(moment % 60);
  const minutes = Math.floor((moment / 60) % 60);
  const hours = Math.floor((moment / (60 * 60)) % 24);
  const days = Math.floor((moment / (60 * 60 * 24)) % 30);
  const months = Math.floor(moment / (30 * 60 * 60 * 24));
  const years = Math.floor(moment / (365 * 60 * 60 * 24));
  if (years > 0) return `${months}y`;
  if (months > 0) return `${months}mth`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  if (seconds > 0) return `${seconds}s`;
  return "-";
};
