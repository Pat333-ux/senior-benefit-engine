'use strict';

/** Produces printable HTML for a user-reviewed prefill packet (not an official PDF/form). */
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

class PrintablePaperFormPrefillBundler {
  build({ citizen = {}, intake = {}, destination = 'Area 7 intake desk' } = {}) {
    const rows = Object.entries({ ...citizen, ...intake }).map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(Array.isArray(value) ? value.join(', ') : value)}</td></tr>`).join('\n');
    return {
      format: 'text/html', suggestedDestination: destination,
      autoSubmit: false, requiresCitizenReview: true,
      html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Benefits intake prefill</title><style>body{font:18px/1.5 Arial,sans-serif;color:#111;background:#fff;margin:2rem}h1{font-size:1.6rem}table{border-collapse:collapse;width:100%}th,td{border:1px solid #444;padding:.65rem;text-align:left;vertical-align:top}th{width:30%}.notice{border:2px solid #111;padding:1rem;margin:1rem 0}@media print{body{margin:1cm}}</style></head><body><h1>Senior benefits intake — prefill for review</h1><p class="notice">Not an official application or eligibility decision. Review every field, correct errors, and sign any required agency forms before submission. This packet has not been sent.</p><p>Suggested destination: ${escapeHtml(destination)}</p><table><tbody>${rows}</tbody></table><p>Generated: ${escapeHtml(new Date().toISOString())}</p></body></html>`
    };
  }
}

module.exports = PrintablePaperFormPrefillBundler;
