// Mock KYC review detail for the Compliance "Review" sheet. The Compliance
// queue itself is REAL API data; this supplies the document/PEP/source-of-funds
// detail the backend has no endpoint for. UI-only.

export type DocStatus = "submitted" | "verified" | "flagged"

export interface KycDocument {
  label: string
  type: string
  status: DocStatus
}

export interface KycReviewDetail {
  fullName: string
  dateOfBirth: string
  country: string
  idType: "PASSPORT" | "DRIVER_LICENSE" | "NATIONAL_ID"
  idNumber: string
  idExpiry: string
  documents: KycDocument[]
  employmentStatus: string
  sourceOfFunds: string
  expectedMonthlyVolume: string
  accountPurpose: string
  politicallyExposed: boolean
  sanctionsMatch: boolean
  riskScore: "Low" | "Medium" | "High"
}

/** Deterministic illustrative KYC detail seeded off the applicant's email. */
export function buildKycDetail(seed: { name: string | null; email: string }): KycReviewDetail {
  const n = seed.email.length
  const idTypes: KycReviewDetail["idType"][] = ["PASSPORT", "DRIVER_LICENSE", "NATIONAL_ID"]
  return {
    fullName: seed.name ?? "—",
    dateOfBirth: "1994-08-12",
    country: "Nigeria",
    idType: idTypes[n % idTypes.length],
    idNumber: `A0${(n * 137).toString().slice(0, 7)}`,
    idExpiry: "2030-05-01",
    documents: [
      { label: "Selfie", type: "image/jpeg", status: "verified" },
      { label: "ID document", type: "image/jpeg", status: n % 4 === 0 ? "flagged" : "verified" },
      { label: "Proof of address", type: "application/pdf", status: "submitted" },
    ],
    employmentStatus: ["EMPLOYED", "SELF_EMPLOYED", "STUDENT"][n % 3],
    sourceOfFunds: ["SALARY", "BUSINESS", "INVESTMENT", "SAVINGS"][n % 4],
    expectedMonthlyVolume: ["$0–100", "$100–1,000", "$1,000–10,000", "$10,000+"][n % 4],
    accountPurpose: n % 2 === 0 ? "PERSONAL" : "BUSINESS",
    politicallyExposed: n % 5 === 0,
    sanctionsMatch: false,
    riskScore: (["Low", "Low", "Medium", "High"] as const)[n % 4],
  }
}
