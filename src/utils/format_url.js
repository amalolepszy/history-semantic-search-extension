// utils/format_url.js

/**
 * Strips http/https/www and optionally truncates the URL.
 * * @param {string} url - The raw URL string.
 * @param {boolean} [shouldTruncate=false] - If true, cuts string to 60 chars.
 * @returns {string} The formatted URL.
 */
export const getFormattedUrl = (url, shouldTruncate = false) => {
  if (!url) return '';

  // 1. Remove http://, https://, and www. (case insensitive)
  const cleanUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");

  // 2. Truncate if requested (for UI display)
  if (shouldTruncate && cleanUrl.length > 60) {
    return cleanUrl.substring(0, 60);
  }

  return cleanUrl;
};