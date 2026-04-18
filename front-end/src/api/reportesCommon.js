export const buildParams = (params = {}) => {
  const clean = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = value;
    }
  });
  return clean;
};

const BUSINESS_OFFSET = "-04:00";

export const toApiOffsetDateTime = (value) => {
  if (!value) return undefined;

  const withSeconds = value.length === 16 ? `${value}:00` : value;
  if (/([+-]\d{2}:\d{2}|Z)$/.test(withSeconds)) {
    return withSeconds;
  }

  return `${withSeconds}${BUSINESS_OFFSET}`;
};

export const toApiOffsetDateTimeFromDate = (date) => {
  if (!(date instanceof Date)) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${BUSINESS_OFFSET}`;
};

export const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const NO_TIMEOUT_CONFIG = { timeout: 0 };
