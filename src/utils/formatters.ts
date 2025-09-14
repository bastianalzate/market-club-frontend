// Utility functions for formatting

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(numPrice);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Colombian phone numbers
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('57')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone; // Return original if can't format
};

export const formatCreditCardNumber = (cardNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Format as XXXX XXXX XXXX XXXX
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const formatExpiryDate = (expiryDate: string): string => {
  // Remove all non-numeric characters
  const cleaned = expiryDate.replace(/\D/g, '');
  
  // Format as MM/YY
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  
  return expiryDate; // Return original if can't format
};
