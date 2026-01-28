/**
 * Strips http/https/www and truncates the URL.
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

/**
 * Converts a history item date from epoch to locale.
 * * @param {Date} date - date in epoch format.
 * @returns {Date} Formatted date.
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
