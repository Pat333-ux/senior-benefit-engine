/**
 * Handles state-level sync for Indiana PathWays for Aging & FSSA Medicaid updates
 */
class StateConnector {
    constructor(stateCode = 'IN') {
        this.stateCode = stateCode;
    }

    // Format payload for Indiana FSSA INconnect alliance
    formatStateWaiverPayload(senior) {
        return {
            state_senior_id: senior.id,
            fssa_program: 'Indiana PathWays for Aging',
            medicaid_status: senior.fssaStatus,
            residence_state: this.stateCode,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = StateConnector;
