import { BENEFICIARIES, type Beneficiary } from "../data";

const BENEFICIARIES_KEY = "alrajhi-prototype:beneficiaries:v1";
const LAST_BENEFICIARY_KEY = "alrajhi-prototype:last-beneficiary:v1";

function isBeneficiary(value: unknown): value is Beneficiary {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ["id", "name", "idNumber", "nationality", "country", "countryCode", "bank", "iban", "currency"]
    .every((key) => typeof item[key] === "string");
}

export function loadSavedBeneficiaries(): Beneficiary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BENEFICIARIES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isBeneficiary) : [];
  } catch {
    return [];
  }
}

export function getAllBeneficiaries(): Beneficiary[] {
  const saved = loadSavedBeneficiaries();
  const savedIds = new Set(saved.map((item) => item.id));
  return [...BENEFICIARIES.filter((item) => !savedIds.has(item.id)), ...saved];
}

export function getLastSavedBeneficiaryId() {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(LAST_BENEFICIARY_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveDemoBeneficiary(beneficiary: Beneficiary) {
  if (typeof window === "undefined") return false;
  try {
    const saved = loadSavedBeneficiaries().filter((item) => item.id !== beneficiary.id);
    window.localStorage.setItem(BENEFICIARIES_KEY, JSON.stringify([...saved, beneficiary]));
    window.localStorage.setItem(LAST_BENEFICIARY_KEY, beneficiary.id);
    return true;
  } catch {
    return false;
  }
}
