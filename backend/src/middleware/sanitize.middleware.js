import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

/**
 * Sanitization middleware to prevent NoSQL injection and XSS attacks
 */
export const sanitizeInputs = [
  // Prevent MongoDB operator injection
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized potentially dangerous key: ${key} from ${req.method} ${req.url}`);
    },
  }),

  // Prevent XSS attacks
  xss(),
];

/**
 * Additional string sanitization for text fields
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  // Remove any script tags
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove any HTML tags except basic formatting
  str = str.replace(/<(?!\/?(?:b|i|u|strong|em|p|br)\b)[^>]+>/gi, '');

  // Trim whitespace
  str = str.trim();

  return str;
};

/**
 * Sanitize object fields recursively
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};
