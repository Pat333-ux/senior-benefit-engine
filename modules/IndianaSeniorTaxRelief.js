'use strict';

/**
 * Uses caller-supplied, dated policy inputs; avoids embedding thresholds that may change.
 * Inputs should be verified against current Indiana DLGF/county auditor guidance.
 */
class IndianaSeniorTaxRelief {
  constructor({ policy = {} } = {}) { this.policy = policy; }

  evaluate(intake = {}) {
    const age = Number(intake.age);
    const assessedValue = Number(intake.assessedHomeValue);
    const income = Number(intake.annualAGI);
    const ageRequirement = Number(this.policy.minimumAge);
    const incomeLimit = Number(this.policy.agiLimit);
    const valueLimit = this.policy.assessedValueLimit == null ? null : Number(this.policy.assessedValueLimit);
    const dataComplete = [age, assessedValue, income, ageRequirement, incomeLimit].every(Number.isFinite);
    const meetsInputs = dataComplete && age >= ageRequirement && income <= incomeLimit &&
      (valueLimit === null || assessedValue <= valueLimit) && intake.primaryResidence === true;
    return {
      program: this.policy.program || 'Indiana Over 65 property tax relief',
      policyYear: this.policy.policyYear || null, policySource: this.policy.source || null,
      screening: dataComplete ? (meetsInputs ? 'potential_match' : 'no_match_on_configured_inputs') : 'insufficient_data_or_policy',
      assessedHomeValue: Number.isFinite(assessedValue) ? assessedValue : null,
      annualAGI: Number.isFinite(income) ? income : null,
      estimatedBenefit: null,
      requiresCountyAuditorReview: true,
      disclaimer: 'No tax benefit is calculated; confirm deduction/credit rules, ownership, residency, filing deadline, and income definition with the county auditor.'
    };
  }
}

module.exports = IndianaSeniorTaxRelief;
