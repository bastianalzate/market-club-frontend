import { constants } from "@/config/constants";

export interface CardData {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface TokenizeCardResponse {
  success: boolean;
  data?: {
    id: string;
    type: string;
    last_four?: string;
    card_holder?: string;
  };
  error?: string;
}

/**
 * Tokenizar tarjeta con Wompi a través del backend
 */
export async function tokenizeCard(cardData: CardData): Promise<TokenizeCardResponse> {
  try {
    const response = await fetch(`${constants.api_url}/payments/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(cardData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al tokenizar la tarjeta');
    }

    return data;
  } catch (error) {
    console.error('Error tokenizing card:', error);
    throw error;
  }
}

/**
 * Obtener últimos 4 dígitos de una tarjeta
 */
export function getLastFourDigits(cardNumber: string): string {
  return cardNumber.replace(/\s/g, '').slice(-4);
}

/**
 * Validar número de tarjeta (Luhn algorithm)
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validar fecha de expiración
 */
export function validateExpirationDate(month: string, year: string): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  // Si el año es de 2 dígitos, convertir a 4
  const fullYear = expYear < 100 ? 2000 + expYear : expYear;

  // Validar mes (1-12)
  if (expMonth < 1 || expMonth > 12) {
    return false;
  }

  // Validar que no esté vencida
  if (fullYear < currentYear) {
    return false;
  }

  if (fullYear === currentYear && expMonth < currentMonth) {
    return false;
  }

  return true;
}

/**
 * Validar CVC
 */
export function validateCVC(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc);
}

/**
 * Formatear número de tarjeta con espacios
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

/**
 * Obtener tipo de tarjeta basado en el número
 */
export function getCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  
  return 'Desconocida';
}

