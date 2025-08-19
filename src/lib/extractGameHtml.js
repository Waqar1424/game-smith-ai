const HTML_REGEX = /<!--BEGIN_GAME_HTML-->([\s\S]*?)<!--END_GAME_HTML-->/;

/**
 * Extracts game HTML from AI response between the required markers
 * @param {string} text - The raw AI response text
 * @returns {string} - The extracted HTML content
 * @throws {Error} - If no valid HTML markers are found
 */
export function extractGameHtml(text) {
  const match = HTML_REGEX.exec(text);
  
  if (!match) {
    throw new Error("No HTML markers found in model output. The AI response should contain <!--BEGIN_GAME_HTML--> and <!--END_GAME_HTML--> markers.");
  }
  
  const html = match[1].trim();
  
  if (!html) {
    throw new Error("Empty HTML content found between markers.");
  }
  
  // Basic validation to ensure we have a complete HTML document
  if (!html.includes('<html') || !html.includes('</html>')) {
    throw new Error("Invalid HTML structure: missing html tags.");
  }
  
  return html;
}

/**
 * Creates a blob URL for the game HTML to be rendered in an iframe
 * @param {string} html - The game HTML content
 * @returns {string} - Blob URL for the iframe
 */
export function createGameBlob(html) {
  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}

/**
 * Revokes a blob URL to free up memory
 * @param {string} blobUrl - The blob URL to revoke
 */
export function revokeBlobUrl(blobUrl) {
  if (blobUrl && blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl);
  }
}