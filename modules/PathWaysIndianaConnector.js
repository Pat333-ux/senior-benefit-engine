'use strict';

/** Maps intake data to a neutral PathWays referral payload; does not call FSSA. */
class PathWaysIndianaConnector {
  constructor({ stateCode = 'IN', policyVersion = null } = {}) {
    this.stateCode = stateCode;
    this.policyVersion = policyVersion;
  }

  formatReferral(intake = {}) {
    const age = Number.isFinite(Number(intake.age)) ? Number(intake.age) : null;
    return {
      schemaVersion: '1.0', state: this.stateCode,
      program: 'Indiana PathWays for Aging', policyVersion: this.policyVersion,
      individual: {
        id: intake.citizenId || null,
        age,
        county: intake.county || null,
        medicaidEnrollmentReported: intake.medicaidEnrolled === true,
        longTermServicesNeedsReported: Array.isArray(intake.longTermServicesNeeds) ? intake.longTermServicesNeeds : []
      },
      screening: { ageScreen: age !== null && age >= 60, requiresFssaEligibilityAndLevelOfCareReview: true },
      submissionMode: 'prefill_only', autoSubmit: false
    };
  }
}

module.exports = PathWaysIndianaConnector;
