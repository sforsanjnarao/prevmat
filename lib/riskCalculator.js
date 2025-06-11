// lib/riskCalculator.js

// Assumes input is a UserApp object with nested App data: userApp.app
export function calculateAppRiskScore(userApp) {
    if (!userApp) return 0;
  
    let score = 0;
    if (userApp.emailUsed) score += 1;
    if (userApp.phoneUsed) score += 2;
    if (userApp.locationAccess) score += 5;
    // Add points for notes?
  
    // --- Check Breach Status ---
    if (userApp.app?.hasKnownBreaches === true) {
      score += 10; // Or another significant value
    }
    // ---------------------------
  
    return score;
  }
  
  // calculateOverallRisk function remains the same or adapt as needed
  export function calculateOverallRisk(userAppsWithScores) {
      if (!userAppsWithScores || userAppsWithScores.length === 0) {
          return { score: 0, level: 'Low' };
      }
      const maxScore = Math.max(0, ...userAppsWithScores.map(app => app.riskScore)); // Ensure score is not negative
  
      let level = 'Low';
      if (maxScore >= 21) level = 'Critical';
      else if (maxScore >= 11) level = 'High';
      else if (maxScore >= 6) level = 'Medium';
  
      return { score: maxScore, level: level };
  }