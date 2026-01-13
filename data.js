/**
 * Enteral Nutrition Products Database
 * Contains all nutritional information for available products
 */


const ENTERAL_PRODUCTS = Object.freeze([
    {
        name: "PentaSure (Standard)",
        qty: 50,
        dilution: 180,
        volume: 215,
        calories: 224,
        protein: 10.5,
        fat: 7.75,
        cho: 28,
        sodium: 145,
        potassium: 140,
        phosphorus: 140,
        features: "3P Protein blend - Whey, Soy & SMP, HMB Advantage with added Leucine, Low Electrolytes",
        preparation: "4 level scoops (50g) in 180ml water",
        scoopsText: "4 level scoops"
    },
    {
        name: "PentaSure DM (Diabetes Care)",
        qty: 50,
        dilution: 200,
        volume: 237,
        calories: 229,
        protein: 11.3,
        fat: 9.35,
        cho: 25,
        sodium: 150,
        potassium: 225,
        phosphorus: 162.5,
        features: "4P Protein blend - Whey, Casein, Soy & SMP, High Fiber, Low GI, Zero Sucrose, Zero Maltodextrin",
        preparation: "4 level scoops (50g) in 200ml water",
        scoopsText: "4 level scoops"
    },
    {
        name: "PentaSure HP (High Protein)",
        qty: 50,
        dilution: 120,
        volume: 144,
        calories: 116,
        protein: 13.5,
        fat: 1.04,
        cho: 13.2,
        sodium: 180,
        potassium: 240,
        phosphorus: 171,
        features: "3P Protein blend with HMB Advantage, Immunity Support Complex (Whey-Soy-ALA), Lactose Free, Low GI",
        preparation: "4 level scoops (50g) in 120ml water",
        scoopsText: "4 level scoops"
    },
    {
        name: "PentaSure Plus",
        qty: 54,
        dilution: 65,
        volume: 108,
        calories: 243,
        protein: 18.74,
        fat: 8.64,
        cho: 23.22,
        sodium: 67.83,
        potassium: 113.4,
        phosphorus: 81,
        features: "High Protein High Calorie, Low GI, Low Sugar, Enriched with MCT, Low Electrolytes, Sucrose Free",
        preparation: "4 level scoops (54g) in 65ml water",
        scoopsText: "4 level scoops"
    },
    {
        name: "PentaSure Hepatic",
        qty: 50,
        dilution: 100,
        volume: 138,
        calories: 207,
        protein: 8.75,
        fat: 4.5,
        cho: 32.5,
        sodium: 60,
        potassium: 180,
        phosphorus: 100,
        features: "100% Whey Protein, 70% MCT, Enriched with BCAA, Sucrose Free, Low GI",
        preparation: "4 level scoops (50g) in 100ml water",
        scoopsText: "4 level scoops"
    },
    {
        name: "PentaSure Critipep",
        qty: 85,
        dilution: 42.5,
        volume: 51,
        calories: 51,
        protein: 4,
        fat: 4.50,
        cho: 10.50,
        sodium: 30,
        potassium: 125,
        phosphorus: 70,
        features: "100% Whey Peptide, 70% MCT, High IGF, Sucrose Free, Low Sodium",
        preparation: "2 level scoops (85g) in 42.5ml water",
        scoopsText: "2 level scoops"
    },
    {
        name: "PentaSure Renal",
        qty: 84,
        dilution: 132,
        volume: 200,
        calories: 398.1,
        protein: 10.92,
        fat: 18.48,
        cho: 47.04,
        sodium: 84,
        potassium: 100.8,
        phosphorus: 126,
        features: "100% HBV Whey Protein, High Calorie, Low Electrolytes, Sucrose Free",
        preparation: "8 heaped scoops (84g) in 132ml water",
        scoopsText: "8 heaped scoops"
    },
    {
        name: "PentaSure DLS (Dialysis Care)",
        qty: 84,
        dilution: 132,
        volume: 200,
        calories: 413.3,
        protein: 21,
        fat: 20.8,
        cho: 35.5,
        sodium: 117.6,
        potassium: 197,
        phosphorus: 119,
        features: "100% HBV Whey Protein, High Calorie, High Protein, Low Electrolytes, Sucrose Free",
        preparation: "8 heaped scoops (84g) in 132ml water",
        scoopsText: "8 heaped scoops"
    },
    {
        name: "PentaSure ImmunoMax",
        qty: 61,
        dilution: 200,
        volume: 250,
        calories: 250,
        protein: 14,
        fat: 7.05,
        cho: 32.89,
        sodium: 250,
        potassium: 350,
        phosphorus: 200,
        features: "100% Whey Protein, Enriched with L-Arginine, Omega-3 Fatty Acids, RNA Nucleotides, Safe for Diabetes",
        preparation: "1 sachet (61g) in 200ml water",
        scoopsText: "1 sachet"
    },
    {
        name: "Obesigo (Weight Management)",
        qty: 50,
        dilution: 200,
        volume: 235,
        calories: 202,
        protein: 20.4,
        fat: 6,
        cho: 16.62,
        sodium: 62.5,
        potassium: 162.5,
        phosphorus: 125,
        features: "Less than 1 Kcal/ml, High Protein, Enriched with Fiber, L-Carnitine & Garcinia Cambogia, MCT, Safe for Diabetes",
        preparation: "1 sachet (50g) in 200ml water",
        scoopsText: "1 sachet"
    },
    {
        name: "PediaGold (Pediatric)",
        qty: 40,
        dilution: 160,
        volume: 190,
        calories: 190,
        protein: 5.9,
        fat: 7.4,
        cho: 25,
        sodium: 58.8,
        potassium: 160,
        phosphorus: 60,
        features: "100% Whey Protein, Complete Balanced Nutrition Formula, Enriched with Micronutrients, DHA & GOS",
        preparation: "2 heaped scoops (40g) in 160ml water",
        scoopsText: "2 heaped scoops"
    },
    {
        name: "PediaGold Plus (Pediatric Enhanced)",
        qty: 40,
        dilution: 160,
        volume: 190,
        calories: 190,
        protein: 5.7,
        fat: 7.4,
        cho: 25.2,
        sodium: 58.8,
        potassium: 160,
        phosphorus: 60,
        features: "100% Whey Peptide, 70% MCT, Low Electrolytes, Enriched with DHA & FOS",
        preparation: "2 heaped scoops (40g) in 160ml water",
        scoopsText: "2 heaped scoops"
    }
]);


/**
 * Filter thresholds for product categorization
 */
const FILTER_THRESHOLDS = Object.freeze({
    LOW_SODIUM: 200,        // mg
    FLUID_RESTRICTION: 2.0, // cal/ml
    HIGH_PROTEIN: 15,       // g/100g
    LOW_PROTEIN: 12         // g/100g
});