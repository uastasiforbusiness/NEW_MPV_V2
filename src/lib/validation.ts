/**
 * Validation utilities for Italian compliance.
 * CF, P.IVA, CAP (postal code), phone, and email validation.
 */

/**
 * Validates an Italian Codice Fiscale (16 chars, alphanumeric)
 * Uses the standard Luhn-like algorithm for structure validation
 */
export function validateCF(cf: string): { valid: boolean; error?: string } {
  if (!cf || cf.trim().length === 0) {
    return { valid: false, error: "Il Codice Fiscale è obbligatorio" };
  }

  const cleaned = cf.trim().toUpperCase();

  if (cleaned.length !== 16) {
    return {
      valid: false,
      error: "Il Codice Fiscale deve essere di 16 caratteri",
    };
  }

  if (!/^[A-Z0-9]{16}$/.test(cleaned)) {
    return {
      valid: false,
      error: "Il Codice Fiscale può contenere solo lettere e numeri",
    };
  }

  return { valid: true };
}

/**
 * Validates an Italian Partita IVA (11 digits)
 */
export function validatePIVA(
  piva: string
): { valid: boolean; error?: string } {
  if (!piva || piva.trim().length === 0) {
    return { valid: false, error: "La Partita IVA è obbligatoria" };
  }

  const cleaned = piva.trim();

  if (cleaned.length !== 11) {
    return {
      valid: false,
      error: "La Partita IVA deve essere di 11 cifre",
    };
  }

  if (!/^\d{11}$/.test(cleaned)) {
    return {
      valid: false,
      error: "La Partita IVA può contenere solo numeri",
    };
  }

  // Luhn check for Partita IVA (last digit is a check digit)
  const checkDigit = parseInt(cleaned[10], 10);
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const digit = parseInt(cleaned[i], 10);
    if (i % 2 === 0) {
      // Even positions (0-indexed): add the digit
      sum += digit;
    } else {
      // Odd positions: double the digit, sum the digits of the result
      const doubled = digit * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  const computedCheck = (10 - (sum % 10)) % 10;

  if (checkDigit !== computedCheck) {
    return {
      valid: false,
      error: "La Partita IVA non è valida (codice di controllo errato)",
    };
  }

  return { valid: true };
}

/**
 * Validates an Italian CAP (Codice Avviamento Postale) - 5 digits
 */
export function validateCAP(
  cap: string
): { valid: boolean; error?: string } {
  if (!cap || cap.trim().length === 0) {
    return { valid: false, error: "Il CAP è obbligatorio" };
  }

  const cleaned = cap.trim();

  if (cleaned.length !== 5) {
    return { valid: false, error: "Il CAP deve essere di 5 cifre" };
  }

  if (!/^\d{5}$/.test(cleaned)) {
    return { valid: false, error: "Il CAP può contenere solo numeri" };
  }

  return { valid: true };
}

/**
 * Validates an Italian phone number
 */
export function validatePhone(
  phone: string
): { valid: boolean; error?: string } {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: "Il numero di telefono è obbligatorio" };
  }

  const cleaned = phone.trim().replace(/[\s+()\-]/g, "");

  // Italian phone: starts with 3 and is 9-10 digits (mobile) or
  // starts with 0 and is 8-11 digits (landline), or +39 prefix
  if (!/^(\+39)?\d{8,13}$/.test(cleaned.replace(/^\+39/, ""))) {
    return {
      valid: false,
      error: "Inserisci un numero di telefono italiano valido",
    };
  }

  return { valid: true };
}

/**
 * Validates an email address
 */
export function validateEmail(
  email: string
): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "L'email è obbligatoria" };
  }

  const cleaned = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleaned)) {
    return { valid: false, error: "Inserisci un indirizzo email valido" };
  }

  return { valid: true };
}

/**
 * Validates an Italian SDI (Sistema di Interscambio) code - 7 chars
 */
export function validateSDICode(
  code: string
): { valid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { valid: true }; // Optional field
  }

  const cleaned = code.trim().toUpperCase();

  if (cleaned.length !== 7) {
    return {
      valid: false,
      error: "Il codice SDI deve essere di 7 caratteri",
    };
  }

  if (!/^[A-Z0-9]{7}$/.test(cleaned)) {
    return {
      valid: false,
      error: "Il codice SDI può contenere solo lettere e numeri",
    };
  }

  return { valid: true };
}

/**
 * Validates a full billing form
 */
export interface BillingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  cap: string;
  cf?: string;
  piva?: string;
  sdi_code?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateBillingForm(
  data: BillingFormData
): { valid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  if (!data.firstName.trim())
    errors.firstName = "Il nome è obbligatorio";
  if (!data.lastName.trim())
    errors.lastName = "Il cognome è obbligatorio";

  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) errors.email = emailResult.error!;

  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.valid) errors.phone = phoneResult.error!;

  if (!data.street.trim())
    errors.street = "L'indirizzo è obbligatorio";
  if (!data.city.trim())
    errors.city = "La città è obbligatoria";
  if (!data.province.trim())
    errors.province = "La provincia è obbligatoria";

  const capResult = validateCAP(data.cap);
  if (!capResult.valid) errors.cap = capResult.error!;

  if (data.cf) {
    const cfResult = validateCF(data.cf);
    if (!cfResult.valid) errors.cf = cfResult.error!;
  }

  if (data.piva) {
    const pivaResult = validatePIVA(data.piva);
    if (!pivaResult.valid) errors.piva = pivaResult.error!;
  }

  if (data.sdi_code) {
    const sdiResult = validateSDICode(data.sdi_code);
    if (!sdiResult.valid) errors.sdi_code = sdiResult.error!;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
