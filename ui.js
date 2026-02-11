/**
 * UI rendering and DOM manipulation functions
 */

/**
 * Render IBW selection cards
 */
function renderIBWCards(ibwValues, onSelect) {
    const container = document.getElementById('ibw-cards');
    container.innerHTML = '';
   
    Object.keys(ibwValues).forEach(key => {
        const ibw = ibwValues[key];
        const card = createIBWCard(key, ibw, () => onSelect(key));
        container.appendChild(card);
    });
}

/**
 * Create a single IBW card element
 */
function createIBWCard(key, ibw, onClick) {
    const card = document.createElement('div');
    card.className = 'ibw-selection-card';
    card.id = `ibw-card-${key}`;
    card.onclick = onClick;
   
    card.innerHTML = `
        <div class="ibw-method-name">${ibw.name} Method</div>
        <div class="ibw-weight-value">${formatNumber(ibw.value, 2)} kg</div>
        <div class="ibw-description">${ibw.description}</div>
    `;
   
    return card;
}

/**
 * Update calculation display
 */
function updateCalculationDisplay(reeValue, nonProteinCal, proteinCal, totals) {
    // Harris-Benedict REE
    const reeElement = document.getElementById('ree-value');
    if (reeElement) reeElement.textContent = `${formatNumber(reeValue)} kcal/day`;
    
    // Non-protein calories (25-30 kcal/kg)
    const nonProteinElement = document.getElementById('non-protein-cal');
    if (nonProteinElement) {
        nonProteinElement.textContent = `${formatNumber(nonProteinCal.min)} - ${formatNumber(nonProteinCal.max)} kcal/day`;
    }
    
    // Protein calories
    const proteinCalElement = document.getElementById('protein-cal');
    if (proteinCalElement) {
        proteinCalElement.textContent = `${formatNumber(proteinCal.caloriesMin)} - ${formatNumber(proteinCal.caloriesMax)} kcal/day`;
    }
    
    // Total calories (100%)
    const totalCalElement = document.getElementById('total-cal');
    if (totalCalElement) {
        totalCalElement.textContent = `${formatNumber(totals.totalCalMin)} - ${formatNumber(totals.totalCalMax)} kcal/day`;
    }
    
    // Target calories (70%)
    const targetCalElement = document.getElementById('target-cal');
    if (targetCalElement) {
        targetCalElement.textContent = `${formatNumber(totals.targetCalMin)} - ${formatNumber(totals.targetCalMax)} kcal/day`;
    }
}

/**
 * Render product cards with filtering and sorting
 */
function renderProducts(products, filters, sortAscending, onSelect) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
   
    let filteredProducts = filterProducts(products, filters);
   
    if (filteredProducts.length === 0) {
        container.innerHTML =
            '<div class="no-products">No products match the selected filters. Please adjust your filter criteria.</div>';
        return;
    }
   
    filteredProducts = sortProducts(filteredProducts, filters, sortAscending);
   
    filteredProducts.forEach(({ product, index, filterData }) => {
        const card = createProductCard(product, index, filterData, () => onSelect(index));
        container.appendChild(card);
    });
}

/**
 * Filter products based on active filters
 */
function filterProducts(products, filters) {
    return products
        .map((product, index) => ({
            product,
            index,
            filterData: evaluateProductFilters(product)
        }))
        .filter(({ filterData }) => {
            if (filters.lowSodium && !filterData.lowSodium) return false;
            if (filters.fluidRestriction && !filterData.fluidRestriction) return false;
            if (filters.highProtein && !filterData.highProtein) return false;
            if (filters.lowProtein && !filterData.lowProtein) return false;
            return true;
        });
}

/**
 * Sort filtered products
 */
function sortProducts(filteredProducts, filters, ascending) {
    let sortKey = 'name';
   
    if (filters.lowSodium) sortKey = 'sodiumValue';
    else if (filters.fluidRestriction) sortKey = 'caloriesPerMlValue';
    else if (filters.highProtein || filters.lowProtein) sortKey = 'proteinPerPrepValue';
   
    return filteredProducts.sort((a, b) => {
        if (sortKey === 'name') {
            const comparison = a.product.name.localeCompare(b.product.name);
            return ascending ? comparison : -comparison;
        }
       
        const valA = a.filterData[sortKey];
        const valB = b.filterData[sortKey];
       
        if (sortKey === 'caloriesPerMlValue') {
            return ascending ? valB - valA : valA - valB;
        }
       
        return ascending ? valA - valB : valB - valA;
    });
}

/**
 * Create a single product card element
 */
function createProductCard(product, index, filterData, onClick) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.id = `product-${index}`;
    card.onclick = onClick;
   
    const badges = createBadges(filterData);
    const specs = createProductSpecs(product, filterData);
   
    card.innerHTML = `
        <div class="product-header">
            <div class="product-name">${product.name}</div>
            <div class="product-badges">${badges}</div>
        </div>
        <div class="product-category">${product.category} • ${product.manufacturer}</div>
        <div class="product-feature">${product.features}</div>
        <div class="product-specs">${specs}</div>
        <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 8px; font-size: 0.9em; color: #0277bd;">
            <strong>Standard Dilution:</strong> ${product.standardDilution.preparationInstruction}
        </div>
    `;
   
    return card;
}

/**
 * Create badge HTML for product
 */
function createBadges(filterData) {
    let badges = '';
    if (filterData.lowSodium)
        badges += '<span class="badge badge-sodium">Low Sodium</span>';
    if (filterData.fluidRestriction)
        badges += '<span class="badge badge-fluid">Fluid Restriction</span>';
    if (filterData.highProtein)
        badges += '<span class="badge badge-protein-high">High Protein</span>';
    if (filterData.lowProtein)
        badges += '<span class="badge badge-protein-low">Low Protein</span>';
    return badges;
}

/**
 * Create product specifications HTML
 */
function createProductSpecs(product, filterData) {
    const standard = product.standardDilution;
    const calorieDensity = getCalorieDensity(standard);
    
    const specs = [
        { label: 'Calories', value: `${Math.round(standard.calories)} kcal` },
        { label: 'Cal Density', value: `${formatNumber(calorieDensity, 2)} kcal/ml` },
        { label: 'Protein', value: `${formatNumber(standard.protein, 1)} g` },
        { label: 'Fat', value: `${formatNumber(standard.fat, 1)} g` },
        { label: 'CHO', value: `${formatNumber(standard.carbohydrate, 1)} g` },
        { label: 'Sodium', value: `${Math.round(standard.sodium)} mg` },
        { label: 'Potassium', value: `${Math.round(standard.potassium)} mg` },
        { label: 'Phosphorus', value: `${Math.round(standard.phosphorus)} mg` },
        { label: 'Total Volume', value: `${standard.finalVolumeMl} ml` }
    ];
   
    return specs.map(({ label, value }) => `
        <div class="spec-item">
            <span class="spec-label">${label}</span>
            <span class="spec-value">${value}</span>
        </div>
    `).join('');
}

/**
 * Generate prescription text with target analysis
 */
function generatePrescriptionText(patientData, calculationResults, product, dilutionType, rate, feedingHours, schedule) {
    const { heightCm } = patientData;
    const { selectedIBW, selectedMethod, proteinRange, reeValue,
            nonProteinCalMin, nonProteinCalMax, proteinGramsMin, proteinGramsMax,
            proteinCalMin, proteinCalMax, totalCalMin, totalCalMax,
            targetCalMin, targetCalMax } = calculationResults;
   
    const diluted = applyDilution(product.standardDilution, dilutionType);
    const targetProteinAvg = (proteinGramsMin + proteinGramsMax) / 2;
   
    const dilutionLabels = {
        half: '½ Standard Dilution',
        standard: 'Standard Dilution',
        double: '2× Standard Dilution'
    };
   
    const preparationText = dilutionType === 'standard'
        ? product.standardDilution.preparationInstruction
        : `${formatNumber(diluted.scoops, 0)} ${diluted.scoopsText} (${formatNumber(diluted.powderGrams, 1)}g) in ${Math.round(diluted.waterMl)}ml water (${dilutionLabels[dilutionType]})`;
   
    const scheduleFeedingWindow = feedingHours === 18
        ? '6AM to 12AM (18-hour feeding)'
        : 'Continuous 24-hour feeding';
    
    // Determine status messages
    let calorieStatusMsg = '✅ Calorie target met';
    if (schedule.exceedsCalorieMax) {
        calorieStatusMsg = `⚠️ Exceeds upper limit by ${formatNumber(schedule.actualCalories - targetCalMax, 0)} kcal`;
    } else if (!schedule.meetsCalorieTarget) {
        calorieStatusMsg = `⚠️ Calorie deficit: ${formatNumber(schedule.calorieDeficitMin, 0)}-${formatNumber(schedule.calorieDeficitMax, 0)} kcal`;
    }
    
    let proteinStatusMsg = '✅ Protein target met';
    if (schedule.exceedsProteinMax) {
        proteinStatusMsg = `⚠️ Exceeds upper limit by ${formatNumber(schedule.actualProtein - schedule.targetProteinMax, 1)} g`;
    } else if (!schedule.meetsProteinTarget) {
        proteinStatusMsg = `⚠️ Protein deficit: ${formatNumber(schedule.proteinDeficitMin, 1)}-${formatNumber(schedule.proteinDeficitMax, 1)} g`;
    }

    return `Diet Prescription:
--------------------------------------------------------------------
PATIENT DATA:
Height: ${Math.round(heightCm)}cm
IBW (${selectedMethod} method): ${formatNumber(selectedIBW, 1)}kg
Protein requirement: ${proteinRange} g/kg/day

NUTRITION CALCULATIONS:
Harris-Benedict REE: ${formatNumber(reeValue, 0)} kcal/day
Non-protein calories (25-30 kcal/kg): ${formatNumber(nonProteinCalMin)}-${Math.round(nonProteinCalMax)} kcal/day
Protein: ${formatNumber(proteinGramsMin, 2)}-${Math.round(proteinGramsMax)} g/day

TOTAL REQUIREMENTS (100%):
${formatNumber(totalCalMin)}-${Math.round(totalCalMax)} kcal/day

TARGET FEEDING (70%):
Calories: ${formatNumber(targetCalMin, 2)}-${formatNumber(targetCalMax, 1)} kcal/day
Protein: ${formatNumber(proteinGramsMin, 1)}-${formatNumber(proteinGramsMax, 1)} g/day

SELECTED PRODUCT:
${product.name} (${product.category})
${product.features}

FEED CONFIGURATION:
${dilutionLabels[dilutionType]}
Preparation: ${preparationText}
Feeding schedule: ${scheduleFeedingWindow}
Selected infusion rate: ${rate} ml/hour
Time per feed: ${formatNumber(schedule.timePerPrep, 1)} hours

FEED SCHEDULE:
Feeds per day: ${schedule.feedsPerDay} (every ${formatNumber(schedule.timePerPrep, 1)} hours)
Each feed contains: ${Math.round(schedule.caloriesPerPrep)} kcal, ${formatNumber(schedule.proteinPerPrep, 1)} g protein
Feed volume: ${Math.round(schedule.volumePerPrep)} ml per feed

TARGET ANALYSIS:
Calorie Target (70%): ${formatNumber(schedule.targetCalMin, 0)}-${formatNumber(schedule.targetCalMax, 0)} kcal/day
Delivered: ${Math.round(schedule.actualCalories)} kcal/day
${calorieStatusMsg}

Protein Target: ${formatNumber(schedule.targetProteinMin, 1)}-${formatNumber(schedule.targetProteinMax, 1)} g/day
Delivered: ${formatNumber(schedule.actualProtein, 1)} g/day
${proteinStatusMsg}

DAILY DELIVERY:
Total feeds: ${schedule.feedsPerDay}
Total volume: ${Math.round(schedule.actualVolume)} ml
Total calories: ${Math.round(schedule.actualCalories)} kcal
Total protein: ${formatNumber(schedule.actualProtein, 1)} g

${(!schedule.meetsCalorieTarget && !schedule.exceedsCalorieMax) || (!schedule.meetsProteinTarget && !schedule.exceedsProteinMax) ? 
`SUGGESTED ADJUSTMENT:
To meet both targets, consider using rate: ${schedule.suggestedRate} ml/hour` : ''}

NURSING INSTRUCTIONS:
1. Prepare fresh feed every ${formatNumber(schedule.timePerPrep, 1)} hours
2. Each feed: ${Math.round(schedule.volumePerPrep)} ml over ${formatNumber(schedule.timePerPrep, 1)} hours
3. Do NOT mix entire day's feed at once
4. Shake feed in bag every hour
5. Confirm tube placement before starting feeds
6. Monitor blood glucose as advised
7. Report GRBS >180mg/dL to consultant
8. Any change in dilution/rate must be discussed with ICU consultant

--------------------------------------------------------------------
Prescription generated on: ${new Date().toLocaleDateString()}`;
}

/**
 * Show/hide elements with animation
 */
function toggleVisibility(elementId, show) {
    const element = document.getElementById(elementId);
    if (show) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

/**
 * Scroll to element smoothly
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}