'use strict';

/**
 * State-specific schema mapping only. No external API call is performed here.
 */
class StateConnector {
  constructor(stateCode = 'IN') { this.stateCode = stateCode; }

  formatStateWaiverPayload(senior = {}) {
    return {
      state_senior_id: senior.id || null,
      fssa_program: 'Indiana PathWays for Aging',
      medicaid_status_reported: senior.fssaStatus || null,
      residence_state: this.stateCode,
      county: senior.county || null,
      submission_mode: 'prefill_only', auto_submit: false,
      requires_agency_review: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = StateConnector;
