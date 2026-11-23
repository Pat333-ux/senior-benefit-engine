'use strict';

/** One-intake screening for Medicare Savings Programs and Extra Help. */
class MedicareSavingsScreen {
  constructor({ policy = {} } = {}) { this.policy = policy; }

  evaluate(intake = {}) {
    const household = intake.householdSize === 2 ? 'couple' : 'individual';
    const income = Number(intake.monthlyIncome);
    const resources = Number(intake.countableResources);
    const configured = this.policy.limits?.[household] || {};
    const incomeLimit = Number(configured.monthlyIncome);
    const resourceLimit = Number(configured.resources);
    const complete = [income, resources, incomeLimit, resourceLimit].every(Number.isFinite);
    const within = complete && income <= incomeLimit && resources <= resourceLimit;
    return {
      policyYear: this.policy.policyYear || null, policySource: this.policy.source || null,
      screening: complete ? (within ? 'potential_match' : 'over_configured_limit') : 'insufficient_data_or_policy',
      programs: ['QMB', 'SLMB', 'QI', 'Medicare Extra Help'].map((program) => ({
        program,
        screening: within ? 'refer_for_program_specific_review' : complete ? 'not_matched_to_shared_configured_limit' : 'undetermined',
        note: 'Each program has distinct rules; verify income/resource methodology, exclusions, and current limits with Indiana FSSA/SSA.'
      })),
      autoSubmit: false
    };
  }
}

module.exports = MedicareSavingsScreen;
