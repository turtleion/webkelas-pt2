import DOMPurify from "dompurify";
import { marked } from "marked";

/**
 * Render user-authored Markdown to safe HTML.
 *
 * `marked` (v18) has no sanitizer and passes raw HTML / javascript: URLs
 * through unchanged. DOMPurify strips dangerous markup so the result is safe
 * to place into `dangerouslySetInnerHTML`.
 */
export function renderMarkdown(markdown: string): string {
  return DOMPurify.sanitize(marked.parse(markdown) as string);
}