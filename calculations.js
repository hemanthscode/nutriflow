/**
 * Core calculation functions for clinical diet and nutrition
 */


/**
 * Calculate Ideal Body Weight using three methods
 * @param {number} heightCm - Height in centimeters
 * @param {string} gender - 'male' or 'female'
 * @returns {Object} IBW values for all three methods
 */
function calculateIBWMethods(heightCm, gender) {
    const heightInches = heightCm / 2.54;
    const inchesOver5Feet = heightInches - 60;
   
    const isMale = gender === 'male';
   
    return {
        hamwi: {
            value: isMale
                ? 48.0 + (2.7 * inchesOver5Feet)
                : 45.5 + (2.2 * inchesOver5Feet),
            name: 'Hamwi',
            description: 'Most widely used in clinical practice'
        },
        devine: {
            value: isMale
                ? 50.0 + (2.3 * inchesOver5Feet)
                : 45.5 + (2.3 * inchesOver5Feet),
            name: 'Devine',
            description: 'Commonly used for drug dosing calculations'
        },
        robinson: {
            value: isMale
                ? 52.0 + (1.9 * inchesOver5Feet)
                : 49.0 + (1.7 * inchesOver5Feet),
            name: 'Robinson',
            description: 'Alternative validated formula'
        }
    };
}


/**
 * Calculate Resting Energy Expenditure using five validated equations
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {Object} REE values from all five methods
 */
function calculateREE(weightKg, heightCm, age, gender) {
    const isMale = gender === 'male';
   
    return {
        harrisBenedict: isMale
            ? 66.47 + (13.75 * weightKg) + (5.0 * heightCm) - (6.76 * age)
            : 655.1 + (9.56 * weightKg) + (1.85 * heightCm) - (4.68 * age),
       
        who: isMale
            ? (15.057 * weightKg) + 692.2
            : (14.818 * weightKg) + 486.6,
       
        owen: isMale
            ? (10.2 * weightKg) + 875
            : (7.18 * weightKg) + 795,
       
        mifflinStJeor: isMale
            ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
            : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161,
       
        liu: isMale
            ? (13.88 * weightKg) + (4.16 * heightCm) - (3.43 * age)
            : (13.88 * weightKg) + (4.16 * heightCm) - (3.43 * age) - 112.40
    };
}


/**
 * Calculate average REE from all methods
 * @param {Object} reeValues - REE values from calculateREE
 * @returns {number} Average REE
 */
function calculateAverageREE(reeValues) {
    const values = Object.values(reeValues);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}


/**
 * Calculate recommended calorie range based on IBW
 * @param {number} ibw - Ideal Body Weight in kg
 * @returns {Object} Min and max calorie recommendations
 */
function calculateCalorieRange(ibw) {
    return {
        min: ibw * 25,
        max: ibw * 30
    };
}


/**
 * Parse protein requirement string and calculate protein needs
 * @param {string} activityLevel - Activity level string (e.g., "1.5-2.0")
 * @param {number} ibw - Ideal Body Weight in kg
 * @returns {Object} Protein requirements in grams and calories
 */
function calculateProteinRequirements(activityLevel, ibw) {
    let proteinMin, proteinMax;
   
    if (activityLevel.includes('-')) {
        const [min, max] = activityLevel.split('-').map(parseFloat);
        proteinMin = min * ibw;
        proteinMax = max * ibw;
    } else {
        proteinMin = proteinMax = parseFloat(activityLevel) * ibw;
    }
   
    return {
        gramsMin: proteinMin,
        gramsMax: proteinMax,
        caloriesMin: proteinMin * 4,
        caloriesMax: proteinMax * 4
    };
}


/**
 * Calculate total energy requirements
 * @param {Object} calorieRange - From calculateCalorieRange
 * @param {Object} proteinReqs - From calculateProteinRequirements
 * @returns {Object} Total and non-protein calories, target calories
 */
function calculateEnergyRequirements(calorieRange, proteinReqs) {
    const totalCalMin = calorieRange.min;
    const totalCalMax = calorieRange.max;
   
    const nonProteinCalMin = totalCalMin + proteinReqs.caloriesMin;
    const nonProteinCalMax = totalCalMax + proteinReqs.caloriesMax;
   
    const targetCalMin = nonProteinCalMin * 0.7;
    const targetCalMax = nonProteinCalMax * 0.7;
   
    return {
        totalCalMin,
        totalCalMax,
        nonProteinCalMin,
        nonProteinCalMax,
        targetCalMin,
        targetCalMax
    };
}


/**
 * Calculate protein percentage of total calories
 * @param {Object} proteinReqs - From calculateProteinRequirements
 * @param {Object} energyReqs - From calculateEnergyRequirements
 * @returns {Object} Min and max percentages
 */
function calculateProteinPercentage(proteinReqs, energyReqs) {
    return {
        min: ((proteinReqs.caloriesMin / energyReqs.totalCalMax) * 100).toFixed(1),
        max: ((proteinReqs.caloriesMax / energyReqs.totalCalMin) * 100).toFixed(1)
    };
}


/**
 * Evaluate product against filter criteria
 * @param {Object} product - Product from ENTERAL_PRODUCTS
 * @returns {Object} Filter evaluation results
 */
function evaluateProductFilters(product) {
    const sodiumPerServing = product.sodium;
    const caloriesPerMl = product.calories / product.volume;
    const proteinPer100g = (product.protein / product.qty) * 100;
   
    return {
        lowSodium: sodiumPerServing <= FILTER_THRESHOLDS.LOW_SODIUM,
        fluidRestriction: caloriesPerMl >= FILTER_THRESHOLDS.FLUID_RESTRICTION,
        highProtein: proteinPer100g >= FILTER_THRESHOLDS.HIGH_PROTEIN,
        lowProtein: proteinPer100g <= FILTER_THRESHOLDS.LOW_PROTEIN,
        sodiumValue: sodiumPerServing,
        caloriesPerMlValue: caloriesPerMl,
        proteinPer100gValue: proteinPer100g
    };
}


/**
 * Apply dilution multiplier to product values
 * @param {Object} product - Product from ENTERAL_PRODUCTS
 * @param {string} dilutionType - 'half', 'standard', or 'double'
 * @returns {Object} Adjusted product values
 */
function applyDilution(product, dilutionType) {
    const multipliers = {
        half: 0.5,
        standard: 1,
        double: 2
    };
   
    const multiplier = multipliers[dilutionType] || 1;
   
    return {
        qty: product.qty * multiplier,
        dilution: product.dilution * multiplier,
        volume: product.volume * multiplier,
        calories: product.calories * multiplier,
        protein: product.protein * multiplier,
        fat: product.fat * multiplier,
        cho: product.cho * multiplier
    };
}


/**
 * Calculate feeding schedule details
 * @param {Object} dilutedProduct - Product values after dilution
 * @param {number} rate - Feeding rate in ml/hour
 * @param {number} targetCalories - Target daily calories
 * @returns {Object} Feeding schedule calculations
 */
function calculateFeedingSchedule(dilutedProduct, rate, targetCalories) {
    const prepsNeeded = targetCalories / dilutedProduct.calories;
    const timePerPrep = dilutedProduct.volume / rate;
   
    return {
        prepsNeeded,
        timePerPrep,
        totalCalories: prepsNeeded * dilutedProduct.calories,
        totalProtein: prepsNeeded * dilutedProduct.protein,
        totalVolume: prepsNeeded * dilutedProduct.volume
    };
}


/**
 * Format number to specified decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
function formatNumber(value, decimals = 1) {
    return value.toFixed(decimals);
}