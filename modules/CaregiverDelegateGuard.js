'use strict';

const crypto = require('crypto');

/**
 * Builds auditable delegate-consent typed data. It intentionally does not verify
 * signatures or legal authority; integrate a reviewed EIP-712 verifier and authority
 * verification service before treating a delegate as authorized.
 */
class CaregiverDelegateGuard {
  constructor({ name = 'Senior Benefit Engine Consent', version = '1', chainId = 1, verifyingContract = '0x0000000000000000000000000000000000000000' } = {}) {
    this.domain = { name, version, chainId, verifyingContract };
    this.audit = [];
  }

  createConsent({ citizenId, delegateId, authorityType, scope, expiresAt, authorityVerified = false } = {}) {
    if (!citizenId || !delegateId || !Array.isArray(scope) || !scope.length) throw new TypeError('citizenId, delegateId, and non-empty scope are required');
    if (!['power_of_attorney', 'legal_guardian', 'citizen_designated'].includes(authorityType)) throw new TypeError('Unsupported authorityType');
    if (authorityType !== 'citizen_designated' && authorityVerified !== true) throw new Error('POA/guardian authority must be independently verified before consent is accepted');
    const message = { citizenId, delegateId, authorityType, scope: [...new Set(scope)].sort(), expiresAt: expiresAt || null };
    const typedData = {
      domain: this.domain,
      primaryType: 'DelegateConsent',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' }, { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' }, { name: 'verifyingContract', type: 'address' }
        ],
        DelegateConsent: [
          { name: 'citizenId', type: 'string' }, { name: 'delegateId', type: 'string' },
          { name: 'authorityType', type: 'string' }, { name: 'scope', type: 'string[]' },
          { name: 'expiresAt', type: 'string' }
        ]
      },
      message
    };
    const event = { event: 'delegate_consent_prepared', at: new Date().toISOString(), consentHash: crypto.createHash('sha256').update(JSON.stringify(typedData)).digest('hex'), citizenId, delegateId, authorityType, authorityVerified, status: 'awaiting_signature_and_server_verification' };
    this.audit.push(Object.freeze(event));
    return { typedData, auditEvent: event, authorized: false };
  }

  getAuditTrail() { return this.audit.map((event) => ({ ...event })); }
}

module.exports = CaregiverDelegateGuard;
