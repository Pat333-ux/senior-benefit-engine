'use strict';

/** Configurable Indiana EAP/LIHEAP screening; seasonal protections require verified dates/rules. */
class IndianaEnergyAssistance {
  constructor({ policy = {} } = {}) { this.policy = policy; }

  evaluate(intake = {}, asOf = new Date()) {
    const householdSize = Number(intake.householdSize);
    const income = Number(intake.grossMonthlyIncome);
    const incomeLimit = Number(this.policy.monthlyIncomeLimits?.[householdSize]);
    const date = asOf instanceof Date ? asOf : new Date(asOf);
    const seasonStart = this.policy.seasonStart ? new Date(this.policy.seasonStart) : null;
    const seasonEnd = this.policy.seasonEnd ? new Date(this.policy.seasonEnd) : null;
    const inSeason = !!seasonStart && !!seasonEnd && date >= seasonStart && date <= seasonEnd;
    const configuredLimit = Number.isFinite(incomeLimit);
    return {
      program: 'Indiana Energy Assistance Program (EAP/LIHEAP)',
      policyYear: this.policy.policyYear || null, policySource: this.policy.source || null,
      screening: configuredLimit && Number.isFinite(income) ? (income <= incomeLimit ? 'potential_match' : 'over_configured_income_limit') : 'insufficient_data_or_policy',
      seasonOpen: inSeason,
      seniorCrisisProtection: 'contact_utility_and_local_intake_agency_to_confirm_current_protections',
      shutoffRiskReported: intake.shutoffNotice === true,
      crisisReferralRecommended: intake.shutoffNotice === true,
      autoSubmit: false,
      disclaimer: 'Season dates, income rules, crisis assistance, and disconnection protections must be confirmed with the current Indiana EAP provider/utility.'
    };
  }
}

module.exports = IndianaEnergyAssistance;
