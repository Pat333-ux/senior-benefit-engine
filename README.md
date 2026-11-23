# Senior Benefit Engine

An event-driven prototype for senior-benefit profile and webhook workflows, with Indiana pre-screening and referral helpers.

## Indiana modules

The modules in `modules/` provide pre-screening, neutral referral schemas, accessible summaries, and printable HTML prefill packets for Indiana senior-services workflows. Area 7 routing identifies service categories for Vigo County; it does not assert provider availability or automatically submit referrals.

All eligibility outputs are **pre-screening only**. CHOICE, PathWays for Aging, property-tax relief, EAP/LIHEAP, Medicare Savings Programs, and Extra Help rules change and may depend on facts not captured here. Supply dated, authoritative policy configuration before using threshold-based screening; absent configuration, the calculators return undetermined rather than inventing limits. Confirm all determinations and filing steps with Indiana FSSA, the county auditor, the utility/EAP provider, Area 7, or the Social Security Administration as appropriate.

No module submits applications or contacts an agency. The caregiver delegate adapter creates EIP-712 typed-data payloads for a separate, reviewed signer/verifier integration. It does not validate a cryptographic signature or independently establish POA/guardian authority. The printable bundler creates HTML for review/printing, not an official form or PDF. Handle all personal information using an approved secure storage and privacy process.

## Example

```js
const IndianaSeniorCareEngine = require('./modules/IndianaSeniorCareEngine');
const engine = new IndianaSeniorCareEngine({ policyVersion: 'reviewed-policy-2026-01' });
const result = engine.evaluateHoosierSeniorEligibility(
  { age: 68, county: 'Vigo', adlLimitations: ['bathing'], medicaidEnrolled: false },
  { emergencyClear: true, policyApproved: true, piiScrubbed: true, citizenConsentGiven: true }
);
// result.status === 'staged'; no application is submitted.
```
