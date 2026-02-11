/**
 * Core calculation functions for clinical diet and nutrition
 */

/**
 * Calculate Ideal Body Weight using three methods
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
 * Calculate Resting Energy Expenditure using Harris-Benedict equation
 */
function calculateREE(weightKg, heightCm, age, gender) {
    if (gender === 'male') {
        return 66.47 + (13.75 * weightKg) + (5.0 * heightCm) - (6.76 * age);
    } else {
        return 655.1 + (9.56 * weightKg) + (1.85 * heightCm) - (4.68 * age);
    }
}

/**
 * Calculate non-protein calories (25-30 kcal/kg)
 */
function calculateNonProteinCalories(ibw) {
    return {
        min: ibw * 25,
        max: ibw * 30
    };
}

/**
 * Calculate protein calories based on selected range
 */
function calculateProteinCalories(proteinRange, ibw) {
    let proteinMin, proteinMax;
   
    if (proteinRange.includes('-')) {
        const [min, max] = proteinRange.split('-').map(parseFloat);
        proteinMin = min * ibw;
        proteinMax = max * ibw;
    } else {
        proteinMin = proteinMax = parseFloat(proteinRange) * ibw;
    }
   
    return {
        gramsMin: proteinMin,
        gramsMax: proteinMax,
        caloriesMin: proteinMin * 4,
        caloriesMax: proteinMax * 4
    };
}

/**
 * Calculate total calories (100%) and target (70%)
 */
function calculateTotalAndTargetCalories(nonProteinCal, proteinCal) {
    const totalCalMin = nonProteinCal.min + proteinCal.caloriesMin;
    const totalCalMax = nonProteinCal.max + proteinCal.caloriesMax;
   
    const targetCalMin = totalCalMin * 0.7;
    const targetCalMax = totalCalMax * 0.7;
   
    return {
        totalCalMin,
        totalCalMax,
        targetCalMin,
        targetCalMax
    };
}

/**
 * Apply dilution multiplier to product values
 */
function applyDilution(standardDilution, dilutionType) {
    const multipliers = {
        half: 0.5,
        standard: 1,
        double: 2
    };
   
    const multiplier = multipliers[dilutionType] || 1;
   
    return {
        scoops: standardDilution.scoops * multiplier,
        scoopsText: standardDilution.scoopsText,
        powderGrams: standardDilution.powderGrams * multiplier,
        waterMl: standardDilution.waterMl * multiplier,
        finalVolumeMl: standardDilution.finalVolumeMl * multiplier,
        calories: standardDilution.calories * multiplier,
        protein: standardDilution.protein * multiplier,
        fat: standardDilution.fat * multiplier,
        carbohydrate: standardDilution.carbohydrate * multiplier,
        sodium: standardDilution.sodium * multiplier,
        potassium: standardDilution.potassium * multiplier,
        phosphorus: standardDilution.phosphorus * multiplier
    };
}

/**
 * Evaluate product against filter criteria
 */
function evaluateProductFilters(product) {
    const standard = product.standardDilution;
    const caloriesPerMl = standard.calories / standard.finalVolumeMl;
    const proteinPerPrep = standard.protein;
    const sodiumPerPrep = standard.sodium;
   
    return {
        lowSodium: sodiumPerPrep <= FILTER_THRESHOLDS.LOW_SODIUM,
        fluidRestriction: caloriesPerMl >= FILTER_THRESHOLDS.FLUID_RESTRICTION,
        highProtein: proteinPerPrep >= FILTER_THRESHOLDS.HIGH_PROTEIN,
        lowProtein: proteinPerPrep <= FILTER_THRESHOLDS.LOW_PROTEIN,
        sodiumValue: sodiumPerPrep,
        caloriesPerMlValue: caloriesPerMl,
        proteinPerPrepValue: proteinPerPrep
    };
}

/**
 * Format number to specified decimal places
 */
function formatNumber(value, decimals = 1) {
    return value.toFixed(decimals);
}

/**
 * Get calorie density in kcal/ml
 */
function getCalorieDensity(standardDilution) {
    return standardDilution.calories / standardDilution.finalVolumeMl;
}