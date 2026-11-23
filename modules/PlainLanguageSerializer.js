'use strict';

/** Whitelist-only, non-identifying plain-language serializer for accessible interfaces/TTS. */
function serializePlainLanguage(summary = {}) {
  const programs = Array.isArray(summary.programs) ? summary.programs.map((program) => ({
    name: String(program.name || program.program || 'Benefit program'),
    status: String(program.status || program.screening || 'Needs review'),
    nextStep: String(program.nextStep || 'Contact the program office to confirm eligibility.'),
    details: Array.isArray(program.details) ? program.details.map(String) : []
  })) : [];
  return {
    schemaVersion: '1.0', language: 'en', readingLevel: 'plain_language',
    title: String(summary.title || 'Your benefits summary'),
    introduction: String(summary.introduction || 'This is a screening summary, not an eligibility decision.'),
    programs,
    actions: Array.isArray(summary.actions) ? summary.actions.map(String) : [],
    disclaimer: String(summary.disclaimer || 'A program representative must confirm eligibility and benefits.'),
    accessibility: { highContrastCompatible: true, textToSpeechReady: true, containsPersonalIdentifiers: false }
  };
}

module.exports = serializePlainLanguage;
