'use strict';

/** Vigo County service categories for referral navigation; no provider availability is implied. */
class Area7ResourceRouter {
  constructor({ county = 'Vigo', region = 'West Central Indiana' } = {}) {
    this.county = county;
    this.region = region;
    this.services = {
      homeDeliveredMeals: 'home-delivered meals',
      nonEmergencyMedicalTransportation: 'non-emergency medical transportation',
      homemaker: 'homemaker services',
      caregiverRespite: 'caregiver respite'
    };
  }

  route(request = {}) {
    const requested = Array.isArray(request.services) ? request.services : [];
    const valid = requested.filter((name) => Object.hasOwn(this.services, name));
    return {
      county: request.county || this.county, region: this.region,
      referralAgency: 'Area 7 - Wabash Valley Area Agency on Aging',
      requestedServices: valid.map((key) => ({ key, description: this.services[key] })),
      needsIntakeConfirmation: true,
      providerAvailability: 'must_be_confirmed_with_agency',
      autoReferral: false
    };
  }
}

module.exports = Area7ResourceRouter;
