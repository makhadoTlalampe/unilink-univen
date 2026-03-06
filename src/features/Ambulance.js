// src/features/Ambulance.js
// Emergency Ambulance Service Feature

class EmergencyAmbulanceService {
    constructor() {
        this.ambulanceAvailable = true;
    }

    requestAmbulance(location) {
        if (this.ambulanceAvailable) {
            console.log(`Ambulance requested at ${location}.`);
            this.ambulanceAvailable = false; // Mark ambulance as unavailable until dispatched
            this.dispatchAmbulance(location);
        } else {
            console.log("Sorry, no ambulances available at the moment.");
        }
    }

    dispatchAmbulance(location) {
        console.log(`Ambulance is on its way to ${location}.`);
        setTimeout(() => {
            console.log("Ambulance has arrived.");
            this.ambulanceAvailable = true; // After reaching the location, mark ambulance as available
        }, 3000); // Simulating delay for ambulance to arrive
    }
}

module.exports = EmergencyAmbulanceService;