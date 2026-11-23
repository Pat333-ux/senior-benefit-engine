'use strict';

/** CHOICE pre-screening. Configure assessment criteria from current FSSA guidance. */
class IndianaChoiceEngine {
  constructor({ policyVersion = null, assessmentRequired = true } = {}) {
    this.policyVersion = policyVersion;
    this.assessmentRequired = assessmentRequired;
  }

  evaluate(intake = {}) {
    const age = Number.isFinite(Number(intake.age)) ? Number(intake.age) : null;
    const ageOrDisabilityScreen = age !== null && age >= 60 || intake.disabilityReported === true;
    const adls = Array.isArray(intake.adlLimitations) ? intake.adlLimitations : [];
    const financialDataProvided = Number.isFinite(Number(intake.monthlyIncome)) && Number.isFinite(Number(intake.countableResources));
    return {
      program: 'Indiana CHOICE', policyVersion: this.policyVersion,
      screening: ageOrDisabilityScreen && (adls.length > 0 || intake.needsFunctionalAssessment === true),
      ageOrDisabilityScreen, reportedAdlLimitations: adls,
      financialDataProvided,
      financialScreening: 'not_determined_without_current_verified_policy',
      functionalEligibility: 'requires_area_agency_assessment',
      requiresManualReview: true,
      referral: 'Area 7 / Wabash Valley Area Agency on Aging',
      disclaimer: 'Pre-screening only; the Area Agency on Aging determines service eligibility and available funding.'
    };
  }
}

module.exports = IndianaChoiceEngine;
