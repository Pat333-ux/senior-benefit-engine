'use strict';

const crypto = require('crypto');

/**
 * Conservative Indiana senior-benefit pre-screening coordinator.
 * This produces referral and prefill data only; it is not an agency determination.
 * Program rules must be supplied from a dated, verified policy configuration.
 */
class IndianaSeniorCareEngine {
  constructor({ citizenId = 'NWO-0001', region = 'Indiana Region 7 - Vigo County', policyVersion = null } = {}) {
    this.citizenId = citizenId;
    this.areaAgencyOnAging = 'Area 7 (Wabash Valley / West Central Indiana)';
    this.region = region;
    this.policyVersion = policyVersion;
  }

  evaluateHoosierSeniorEligibility(intake = {}, gates = {}) {
    const timestamp = new Date().toISOString();
    const requiredGates = ['emergencyClear', 'policyApproved', 'piiScrubbed', 'citizenConsentGiven'];
    const failedGates = requiredGates.filter((gate) => gates[gate] !== true);

    if (failedGates.length) {
      return {
        status: 'blocked', autoSubmit: false, requiresManualApproval: true,
        reason: 'Safety, policy, PII, or consent gate failed.', failedGates
      };
    }

    const programs = {};
    const numericAge = Number(intake.age);
    const age = Number.isFinite(numericAge) ? numericAge : null;
    const adlDeficits = Array.isArray(intake.adlLimitations) ? intake.adlLimitations.length : null;

    // These are screening indicators, not eligibility findings. Final functional and
    // financial determinations are made by FSSA/Area 7 using current program rules.
    programs.indianaCHOICE = {
      screening: age !== null && (age >= 60 || intake.disabilityReported === true),
      age, adlLimitationsReported: adlDeficits,
      requiresArea7Assessment: true,
      providerAgency: this.areaAgencyOnAging,
      determination: 'referral_required'
    };
    programs.pathWaysForAging = {
      screening: age !== null && age >= 60,
      age, medicaidEnrollmentReported: intake.medicaidEnrolled === true,
      requiresMedicaidAndLevelOfCareReview: true,
      determination: 'referral_required'
    };

    return {
      status: 'staged', autoSubmit: false, requiresManualApproval: true,
      citizenId: this.citizenId, region: this.region, evaluatedAt: timestamp,
      policyVersion: this.policyVersion,
      disclaimer: 'Pre-screening only. This is not an eligibility determination or application.',
      programs,
      stagedPayload: {
        schemaVersion: '1.0', applicationType: 'INDIANA_SENIOR_CARE_PREFILL_ONLY',
        intakeHash: `0x${crypto.createHash('sha256').update(JSON.stringify(intake)).digest('hex')}`
      }
    };
  }
}

module.exports = IndianaSeniorCareEngine;
