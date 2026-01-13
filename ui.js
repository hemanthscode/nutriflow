/**
 * UI rendering and DOM manipulation functions
 */


/**
 * Render IBW selection cards
 * @param {Object} ibwValues - IBW values from calculateIBWMethods
 * @param {Function} onSelect - Callback when card is selected
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
 * Update REE display with calculated values
 */
function updateREEDisplay(reeValues, reeAverage, calorieRange) {
    document.getElementById('ree-hb').textContent = `${formatNumber(reeValues.harrisBenedict)} kcal/day`;
    document.getElementById('ree-who').textContent = `${formatNumber(reeValues.who)} kcal/day`;
    document.getElementById('ree-owen').textContent = `${formatNumber(reeValues.owen)} kcal/day`;
    document.getElementById('ree-mifflin').textContent = `${formatNumber(reeValues.mifflinStJeor)} kcal/day`;
    document.getElementById('ree-liu').textContent = `${formatNumber(reeValues.liu)} kcal/day`;
    document.getElementById('ree-average').textContent = `${formatNumber(reeAverage)} kcal/day`;
    document.getElementById('ree-range').textContent =
        `${formatNumber(calorieRange.min)} - ${formatNumber(calorieRange.max)} kcal/day`;
}


/**
 * Update protein requirements display
 */
function updateProteinDisplay(activityText, proteinReqs, proteinPercent) {
    document.getElementById('protein-activity').textContent = activityText;
   
    if (proteinReqs.gramsMin === proteinReqs.gramsMax) {
        document.getElementById('protein-range').textContent =
            `${formatNumber(proteinReqs.gramsMin, 2)} g/day`;
        document.getElementById('protein-cal').textContent =
            `${formatNumber(proteinReqs.caloriesMin)} kcal/day`;
    } else {
        document.getElementById('protein-range').textContent =
            `${formatNumber(proteinReqs.gramsMin, 2)} - ${formatNumber(proteinReqs.gramsMax, 2)} g/day`;
        document.getElementById('protein-cal').textContent =
            `${formatNumber(proteinReqs.caloriesMin)} - ${formatNumber(proteinReqs.caloriesMax)} kcal/day`;
    }
   
    document.getElementById('protein-percent').textContent =
        `${proteinPercent.min}% - ${proteinPercent.max}%`;
}


/**
 * Update energy requirements display
 */
function updateEnergyDisplay(energyReqs) {
    document.getElementById('total-cal').textContent =
        `${formatNumber(energyReqs.totalCalMin)} - ${formatNumber(energyReqs.totalCalMax)} kcal/day`;
    document.getElementById('non-protein-cal').textContent =
        `${formatNumber(energyReqs.nonProteinCalMin)} - ${formatNumber(energyReqs.nonProteinCalMax)} kcal/day`;
    document.getElementById('target-cal').textContent =
        `${formatNumber(energyReqs.targetCalMin)} - ${formatNumber(energyReqs.targetCalMax)} kcal/day`;
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
    else if (filters.highProtein || filters.lowProtein) sortKey = 'proteinPer100gValue';
   
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
        <div class="product-feature">${product.features}</div>
        <div class="product-specs">${specs}</div>
        <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 8px; font-size: 0.9em; color: #0277bd;">
            <strong>Standard Dilution:</strong> ${product.preparation}
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
    const specs = [
        { label: 'Calories', value: `${product.calories} kcal` },
        { label: 'Cal Density', value: `${formatNumber(filterData.caloriesPerMlValue, 2)} kcal/ml` },
        { label: 'Protein', value: `${product.protein} g` },
        { label: 'Protein %', value: `${formatNumber(filterData.proteinPer100gValue, 1)}g/100g` },
        { label: 'Fat', value: `${product.fat} g` },
        { label: 'CHO', value: `${product.cho} g` },
        { label: 'Sodium', value: `${product.sodium} mg` },
        { label: 'Potassium', value: `${product.potassium} mg` },
        { label: 'Phosphorus', value: `${product.phosphorus} mg` },
        { label: 'Volume', value: `${product.volume} ml` }
    ];
   
    return specs.map(({ label, value }) => `
        <div class="spec-item">
            <span class="spec-label">${label}</span>
            <span class="spec-value">${value}</span>
        </div>
    `).join('');
}


/**
 * Render feeding rate buttons
 */
function renderRateButtons(selectedRate, onSelect) {
    const container = document.getElementById('rate-buttons');
    container.innerHTML = '';
   
    for (let rate = 30; rate <= 100; rate += 10) {
        const btn = document.createElement('div');
        btn.className = 'rate-btn' + (rate === selectedRate ? ' selected' : '');
        btn.textContent = `${rate} ml/hr`;
        btn.onclick = () => onSelect(rate);
        container.appendChild(btn);
    }
}


/**
 * Update dilution preview display
 */
function updateDilutionPreview(product, dilutionType, rate) {
    const diluted = applyDilution(product, dilutionType);
    const timeHours = diluted.volume / rate;
   
    const dilutionLabels = {
        half: '½ Standard Dilution',
        standard: 'Standard Dilution',
        double: '2× Standard Dilution'
    };
   
    const preview = document.getElementById('dilution-preview');
    preview.innerHTML = `
        <h4 style="color: #2e7d32; margin-bottom: 15px;">📊 Feed Configuration Preview</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            ${createPreviewItem('Dilution Type', dilutionLabels[dilutionType])}
            ${createPreviewItem('Powder', `${formatNumber(diluted.qty, 1)}g`)}
            ${createPreviewItem('Water', `${Math.round(diluted.dilution)}ml`)}
            ${createPreviewItem('Total Volume', `${Math.round(diluted.volume)}ml`)}
            ${createPreviewItem('Feeding Rate', `${rate}ml/hr`)}
            ${createPreviewItem('Time Required', `${formatNumber(timeHours, 1)} hours`, '#4caf50')}
            ${createPreviewItem('Calories', `${Math.round(diluted.calories)} kcal`)}
            ${createPreviewItem('Protein', `${formatNumber(diluted.protein, 1)}g`)}
        </div>
    `;
}


/**
 * Create a preview item HTML
 */
function createPreviewItem(label, value, color = '#333') {
    return `
        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <strong style="color: #667eea;">${label}:</strong><br>
            <span style="font-size: 1.2em; font-weight: 700; color: ${color};">${value}</span>
        </div>
    `;
}


/**
 * Generate prescription text
 */
function generatePrescriptionText(patientData, calculationResults, product, dilutionType, rate, feedHours) {
    const { heightCm } = patientData;
    const { selectedIBW, selectedMethod, reeRangeMin, reeRangeMax,
            proteinMin, proteinMax, proteinCalMin, proteinCalMax,
            nonProteinCalMin, nonProteinCalMax, targetCalMin, targetCalMax } = calculationResults;
   
    const diluted = applyDilution(product, dilutionType);
    const targetCalAvg = (targetCalMin + targetCalMax) / 2;
    const schedule = calculateFeedingSchedule(diluted, rate, targetCalAvg);
   
    const dilutionLabels = {
        half: '½ Standard Dilution',
        standard: 'Standard Dilution',
        double: '2× Standard Dilution'
    };
   
    const preparationText = dilutionType === 'standard'
        ? product.preparation
        : `${formatNumber(diluted.qty, 1)}g powder in ${Math.round(diluted.dilution)}ml water (${dilutionLabels[dilutionType]})`;
   
    const scheduleFeedingWindow = feedHours === 18
        ? '6AM to 12AM'
        : 'Continuous 24-hour feeding';
   
    return `Diet Prescription:


Measured height ~ ${Math.round(heightCm)}cm
IBW - ${selectedMethod} method: ~ ${formatNumber(selectedIBW, 1)}kg


REE: 25-30Kcal/kg/day = ${formatNumber(reeRangeMin)}-${Math.round(reeRangeMax)} kCal per day
Recommended protein intake: ${formatNumber(proteinMin/selectedIBW, 1)}-${formatNumber(proteinMax/selectedIBW, 1)}gm/kg/day = ${formatNumber(proteinMin, 2)}-${Math.round(proteinMax)}g of protein per day


Calories from Protein = ${Math.round(proteinCalMin)}-${Math.round(proteinCalMax)} Kcal


Total Non protein calories required: ${formatNumber(nonProteinCalMin)}-${Math.round(nonProteinCalMax)}Kcal per day


Target is to meet at least 70% (Kcal) = ${formatNumber(targetCalMin, 2)}-${formatNumber(targetCalMax, 1)} Kcal


Enteral formula selected = ${product.name}
Configuration = ${dilutionLabels[dilutionType]}


(${scheduleFeedingWindow})
Dilution: ${preparationText} to be administered at ${rate}ml per hour over ${formatNumber(schedule.timePerPrep, 1)} hours
Prepare fresh feed every ${formatNumber(schedule.timePerPrep, 1)} hours
Shake feed in bag every hour


Total calories = ${Math.round(schedule.totalCalories)} Kcal, Protein = ${formatNumber(schedule.totalProtein, 1)} g per day
Total volume from Enteral feed - ${Math.round(schedule.totalVolume)} mL per day



Standard precautions to be followed while preparing feeds:


Cap and mask on
Wash hands with soap for about 40-60 seconds
Use Hand care gloves and plastic apron while preparing the feed
Prepare feed as per prescription
After mixing thoroughly put the prepared feed in feeding bag
Confirm position of Ryles tube/Freka tube with hissing sound in epigastric area before starting feeds, (If any doubt - inform the consultant)
Start feed at prescribed rate
Whenever a patient is in NBM, please confirm with ICU consultant about need for starting IV fluids
Monitor GRBS as advised and inform ICU Consultant if GRBS>180mg/dL
Any change in dilutions or rate of administration has to be discussed with ICU consultant`;
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