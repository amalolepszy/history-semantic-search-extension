/**
 * Strips http/https/www and optionally truncates the URL.
 * * @param {string} url - The raw URL string.
 * @returns {string} The formatted URL.
 */
export const getFormattedUrl = (url) => {
  if (!url) return '';

  // Remove http://, https://, and www. (case insensitive)
  const cleanUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");

  if (cleanUrl.length > 100) {
    return cleanUrl.substring(0, 100);
  }

  return cleanUrl;
};
