/**
 * Strips http/https/www and truncates the URL.
 * * @param {string} url - The raw URL string.
 * @returns {string} The formatted URL.
 */
export const getFormattedUrl = (url) => {
  if (!url) return '';

  // Remove http://, https://, and www. (case insensitive)
  const cleanUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");

  const URL_CUTOFF = 80;
  if (cleanUrl.length > URL_CUTOFF) {
    return cleanUrl.substring(0, URL_CUTOFF);
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

export const getContextStringFromHistoryItem = (item) => {
  const formattedLastVisitTime = formatDate(item.lastVisitTime);
  const formattedURL = getFormattedUrl(item.url)

  return `Title: ${item.title || "Untitled"} - URL: ${formattedURL} - Last Visit Time: ${formattedLastVisitTime} - Visit Count: ${item.visitCount}`;
};
