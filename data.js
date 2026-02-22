/**
 * Enteral Nutrition Products Database
 * Structured according to the new schema
 */

const ENTERAL_PRODUCTS = Object.freeze([
    {
        name: "PentaSure (Standard)",
        category: "Standard",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 1,
        features: "3P Protein blend - Whey, Soy & SMP, HMB Advantage with added Leucine, Low Electrolytes",
        standardDilution: {
            scoops: 4,
            scoopsText: "level scoops",
            powderGrams: 50,
            waterMl: 180,
            finalVolumeMl: 215,
            calories: 224,
            protein: 10.5,
            fat: 7.75,
            carbohydrate: 28,
            sodium: 145,
            potassium: 140,
            phosphorus: 140,
            preparationInstruction: "4 level scoops (50g) in 180ml water"
        }
    },
    {
        name: "PentaSure DM (Diabetes Care)",
        category: "Diabetes",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 2,
        features: "4P Protein blend - Whey, Casein, Soy & SMP, High Fiber, Low GI, Zero Sucrose, Zero Maltodextrin",
        standardDilution: {
            scoops: 4,
            scoopsText: "level scoops",
            powderGrams: 50,
            waterMl: 200,
            finalVolumeMl: 237,
            calories: 229,
            protein: 11.3,
            fat: 9.35,
            carbohydrate: 25,
            sodium: 150,
            potassium: 225,
            phosphorus: 162.5,
            preparationInstruction: "4 level scoops (50g) in 200ml water"
        }
    },
    {
        name: "PentaSure HP (High Protein)",
        category: "High Protein",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 3,
        features: "3P Protein blend with HMB Advantage, Immunity Support Complex (Whey-Soy-ALA), Lactose Free, Low GI",
        standardDilution: {
            scoops: 4,
            scoopsText: "level scoops",
            powderGrams: 50,
            waterMl: 120,
            finalVolumeMl: 144,
            calories: 116,
            protein: 13.5,
            fat: 1.04,
            carbohydrate: 13.2,
            sodium: 180,
            potassium: 240,
            phosphorus: 171,
            preparationInstruction: "4 level scoops (50g) in 120ml water"
        }
    },
    {
        name: "PentaSure 2.0",
        category: "High Calorie",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 4,
        features: "High Protein High Calorie, Low GI, Low Sugar, Enriched with MCT, Low Electrolytes, Sucrose Free",
        standardDilution: {
            scoops: 4,
            scoopsText: "level scoops",
            powderGrams: 54,
            waterMl: 65,
            finalVolumeMl: 108,
            calories: 243,
            protein: 18.74,
            fat: 8.64,
            carbohydrate: 23.22,
            sodium: 67.83,
            potassium: 113.4,
            phosphorus: 81,
            preparationInstruction: "4 level scoops (54g) in 65ml water"
        }
    },
    {
        name: "PentaSure Hepatic",
        category: "Hepatic",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 5,
        features: "100% Whey Protein, 70% MCT, Enriched with BCAA, Sucrose Free, Low GI",
        standardDilution: {
            scoops: 4,
            scoopsText: "level scoops",
            powderGrams: 50,
            waterMl: 100,
            finalVolumeMl: 138,
            calories: 207,
            protein: 8.75,
            fat: 4.5,
            carbohydrate: 32.5,
            sodium: 60,
            potassium: 180,
            phosphorus: 100,
            preparationInstruction: "4 level scoops (50g) in 100ml water"
        }
    },
    {
        name: "PentaSure Critipep",
        category: "Critical Care",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 6,
        features: "100% Whey Peptide, 70% MCT, High IGF, Sucrose Free, Low Sodium",
        standardDilution: {
            scoops: 2,
            scoopsText: "level scoops",
            powderGrams: 85,
            waterMl: 42.5,
            finalVolumeMl: 51,
            calories: 51,
            protein: 4,
            fat: 4.50,
            carbohydrate: 10.50,
            sodium: 30,
            potassium: 125,
            phosphorus: 70,
            preparationInstruction: "2 level scoops (85g) in 42.5ml water"
        }
    },
    {
        name: "PentaSure Renal",
        category: "Renal",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 7,
        features: "100% HBV Whey Protein, High Calorie, Low Electrolytes, Sucrose Free",
        standardDilution: {
            scoops: 8,
            scoopsText: "heaped scoops",
            powderGrams: 84,
            waterMl: 132,
            finalVolumeMl: 200,
            calories: 398.1,
            protein: 10.92,
            fat: 18.48,
            carbohydrate: 47.04,
            sodium: 84,
            potassium: 100.8,
            phosphorus: 126,
            preparationInstruction: "8 heaped scoops (84g) in 132ml water"
        }
    },
    {
        name: "PentaSure DLS (Dialysis Care)",
        category: "Dialysis",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 8,
        features: "100% HBV Whey Protein, High Calorie, High Protein, Low Electrolytes, Sucrose Free",
        standardDilution: {
            scoops: 8,
            scoopsText: "heaped scoops",
            powderGrams: 84,
            waterMl: 132,
            finalVolumeMl: 200,
            calories: 413.3,
            protein: 21,
            fat: 20.8,
            carbohydrate: 35.5,
            sodium: 117.6,
            potassium: 197,
            phosphorus: 119,
            preparationInstruction: "8 heaped scoops (84g) in 132ml water"
        }
    },
    {
        name: "PentaSure ImmunoMax",
        category: "Immunity",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 9,
        features: "100% Whey Protein, Enriched with L-Arginine, Omega-3 Fatty Acids, RNA Nucleotides, Safe for Diabetes",
        standardDilution: {
            scoops: 1,
            scoopsText: "sachet",
            powderGrams: 61,
            waterMl: 200,
            finalVolumeMl: 250,
            calories: 250,
            protein: 14,
            fat: 7.05,
            carbohydrate: 32.89,
            sodium: 250,
            potassium: 350,
            phosphorus: 200,
            preparationInstruction: "1 sachet (61g) in 200ml water"
        }
    },
    {
        name: "Obesigo (Weight Management)",
        category: "Weight Management",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 10,
        features: "Less than 1 Kcal/ml, High Protein, Enriched with Fiber, L-Carnitine & Garcinia Cambogia, MCT, Safe for Diabetes",
        standardDilution: {
            scoops: 1,
            scoopsText: "sachet",
            powderGrams: 50,
            waterMl: 200,
            finalVolumeMl: 235,
            calories: 202,
            protein: 20.4,
            fat: 6,
            carbohydrate: 16.62,
            sodium: 62.5,
            potassium: 162.5,
            phosphorus: 125,
            preparationInstruction: "1 sachet (50g) in 200ml water"
        }
    },
    {
        name: "PediaGold (Pediatric)",
        category: "Pediatric",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 11,
        features: "100% Whey Protein, Complete Balanced Nutrition Formula, Enriched with Micronutrients, DHA & GOS",
        standardDilution: {
            scoops: 2,
            scoopsText: "heaped scoops",
            powderGrams: 40,
            waterMl: 160,
            finalVolumeMl: 190,
            calories: 190,
            protein: 5.9,
            fat: 7.4,
            carbohydrate: 25,
            sodium: 58.8,
            potassium: 160,
            phosphorus: 60,
            preparationInstruction: "2 heaped scoops (40g) in 160ml water"
        }
    },
    {
        name: "PediaGold Plus (Pediatric Enhanced)",
        category: "Pediatric",
        manufacturer: "Pentasure",
        isActive: true,
        displayOrder: 12,
        features: "100% Whey Peptide, 70% MCT, Low Electrolytes, Enriched with DHA & FOS",
        standardDilution: {
            scoops: 2,
            scoopsText: "heaped scoops",
            powderGrams: 40,
            waterMl: 160,
            finalVolumeMl: 190,
            calories: 190,
            protein: 5.7,
            fat: 7.4,
            carbohydrate: 25.2,
            sodium: 58.8,
            potassium: 160,
            phosphorus: 60,
            preparationInstruction: "2 heaped scoops (40g) in 160ml water"
        }
    },
    {
        name: "Resource Opti",
        category: "Standard",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 13,
        features: "Balanced nutrition, Complete formula",
        standardDilution: {
            scoops: 6,
            scoopsText: "scoops",
            powderGrams: 50,
            waterMl: 160,
            finalVolumeMl: 210,
            calories: 36.5,
            protein: 1.7,
            fat: 1.2,
            carbohydrate: 4.6,
            sodium: 11.66,
            potassium: 37.5,
            phosphorus: 16.66,
            preparationInstruction: "6 scoops (50g) in 160ml water"
        }
    },
    {
        name: "Resource High Protein",
        category: "High Protein",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 14,
        features: "High Protein, Low Calorie, Supports muscle maintenance",
        standardDilution: {
            scoops: 6,
            scoopsText: "scoops",
            powderGrams: 50,
            waterMl: 151,
            finalVolumeMl: 201,
            calories: 24.5,
            protein: 3.5,
            fat: 0.2,
            carbohydrate: 3.6,
            sodium: 17.5,
            potassium: 0,
            phosphorus: 35.8,
            preparationInstruction: "6 scoops (50g) in 151ml water"
        }
    },
    {
        name: "Resource Diabetic",
        category: "Diabetes",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 15,
        features: "Diabetes management, High Fiber, Low GI",
        standardDilution: {
            scoops: 6,
            scoopsText: "scoops",
            powderGrams: 50,
            waterMl: 193,
            finalVolumeMl: 243,
            calories: 35.83,
            protein: 2.0,
            fat: 1.35,
            carbohydrate: 4.25,
            sodium: 17.9,
            potassium: 45.66,
            phosphorus: 25.0,
            preparationInstruction: "6 scoops (50g) in 193ml water"
        }
    },
    {
        name: "Resource Dialysis",
        category: "Dialysis",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 16,
        features: "High Calorie, High Protein for dialysis patients",
        standardDilution: {
            scoops: 6,
            scoopsText: "scoops",
            powderGrams: 50,
            waterMl: 90,
            finalVolumeMl: 140,
            calories: 36.2,
            protein: 2.25,
            fat: 1.4,
            carbohydrate: 3.9,
            sodium: 12.1,
            potassium: 28.1,
            phosphorus: 19.3,
            preparationInstruction: "6 scoops (50g) in 90ml water"
        }
    },
    {
        name: "Resource Renal",
        category: "Renal",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 17,
        features: "Low electrolytes, Renal care formula",
        standardDilution: {
            scoops: 6,
            scoopsText: "scoops",
            powderGrams: 50,
            waterMl: 90,
            finalVolumeMl: 140,
            calories: 37.3,
            protein: 1.0,
            fat: 1.3,
            carbohydrate: 5.0,
            sodium: 11.8,
            potassium: 25.0,
            phosphorus: 11.9,
            preparationInstruction: "6 scoops (50g) in 90ml water"
        }
    },
    {
        name: "Resource Hepatic",
        category: "Hepatic",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 18,
        features: "Enriched with BCAA, Hepatic support",
        standardDilution: {
            scoops: 6,
            scoopsText: "scoops",
            powderGrams: 50,
            waterMl: 90,
            finalVolumeMl: 140,
            calories: 35.5,
            protein: 2.0,
            fat: 1.0,
            carbohydrate: 4.59,
            sodium: 12.2,
            potassium: 27.7,
            phosphorus: 18.5,
            preparationInstruction: "6 scoops (50g) in 90ml water"
        }
    },
    {
        name: "Peptamen",
        category: "Peptide",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 19,
        features: "Peptide-based, MCT enriched, Easy digestion",
        standardDilution: {
            scoops: 7,
            scoopsText: "scoops",
            powderGrams: 55,
            waterMl: 212,
            finalVolumeMl: 267,
            calories: 35.7,
            protein: 1.42,
            fat: 1.42,
            carbohydrate: 4.6,
            sodium: 29.0,
            potassium: 54.0,
            phosphorus: 20.0,
            preparationInstruction: "7 scoops (55g) in 212ml water"
        }
    },
    {
        name: "Peptamen Junior",
        category: "Pediatric Peptide",
        manufacturer: "Nestle",
        isActive: true,
        displayOrder: 20,
        features: "Pediatric peptide formula, MCT enriched",
        standardDilution: {
            scoops: 7,
            scoopsText: "scoops",
            powderGrams: 55,
            waterMl: 212,
            finalVolumeMl: 267,
            calories: 36.42,
            protein: 1.0,
            fat: 0,
            carbohydrate: 5.89,
            sodium: 21.65,
            potassium: 42.58,
            phosphorus: 19.56,
            preparationInstruction: "7 scoops (55g) in 212ml water"
        }
    },
    {
        name: "Celevida Maxx",
        category: "High Protein",
        manufacturer: "Celevida",
        isActive: true,
        displayOrder: 21,
        features: "High Protein, Muscle health, Immunity support",
        standardDilution: {
            scoops: 1,
            scoopsText: "SACHET",
            powderGrams: 33,
            waterMl: 200,
            finalVolumeMl: 233,
            calories: 156.26,
            protein: 16.17,
            fat: 6.4,
            carbohydrate: 8.42,
            sodium: 177.33,
            potassium: 0,
            phosphorus: 0,
            preparationInstruction: "1 SACHET (33g) in 200ml water"
        }
    },
    {
        name: "Celevida DLS",
        category: "Dialysis",
        manufacturer: "Celevida",
        isActive: true,
        displayOrder: 22,
        features: "Dialysis care, Low electrolytes",
        standardDilution: {
            scoops: 3,
            scoopsText: "SCOOPs",
            powderGrams: 40,
            waterMl: 541,
            finalVolumeMl: 581,
            calories: 58.52,
            protein: 6.38,
            fat: 2.29,
            carbohydrate: 2.7,
            sodium: 33.38,
            potassium: 59.25,
            phosphorus: 28.33,
            preparationInstruction: "3 SCOOPs (40g) in 541ml water"
        }
    },
    {
        name: "Celevida EN",
        category: "Standard",
        manufacturer: "Celevida",
        isActive: true,
        displayOrder: 23,
        features: "Complete balanced nutrition",
        standardDilution: {
            scoops: 2,
            scoopsText: "SCOOPS",
            powderGrams: 55,
            waterMl: 400,
            finalVolumeMl: 455,
            calories: 121.0,
            protein: 5.78,
            fat: 4.4,
            carbohydrate: 14.3,
            sodium: 119.63,
            potassium: 75.0,
            phosphorus: 47.83,
            preparationInstruction: "2 SCOOPS (55g) in 400ml water"
        }
    }
]);


/**
 * Filter thresholds for product categorization
 */
const FILTER_THRESHOLDS = Object.freeze({
    LOW_SODIUM: 200,            // mg per standard preparation
    FLUID_RESTRICTION: 2.0,     // kcal/ml (calorie density, high energy dense)
    HIGH_PROTEIN: 15,           // g per standard preparation
    LOW_PROTEIN: 12,            // g per standard preparation
    LOW_CALORIE_DENSITY: 0.7,   // kcal/ml — dilute formulas (≤0.7 kcal/ml)
    HIGH_CALORIE_DENSITY: 1.5   // kcal/ml — concentrated formulas (≥1.5 kcal/ml)
});