/**
 * Main application state and event handlers
 */

// Application State
const AppState = {
    patientData: null,
    ibwValues: null,
    selectedIBW: null,
    selectedMethod: '',
    calculationResults: null,
    selectedProduct: null,
    selectedProductIndex: null,
    filters: {
        lowSodium: false,
        fluidRestriction: false,
        highProtein: false,
        lowProtein: false
    },
    sortAscending: true,
    dilutionType: 'standard',
    selectedRate: null,
    feedingHours: 18
};

/**
 * Initialize the application
 */
function initializeApp() {
    setupEventListeners();
    console.log('Clinical Diet Calculator initialized');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Patient form submission
    const patientForm = document.getElementById('patient-form');
    patientForm.addEventListener('submit', handlePatientFormSubmit);
   
    // Calculate diet button
    const calcDietBtn = document.getElementById('calculate-diet-btn');
    calcDietBtn.addEventListener('click', handleCalculateDiet);
   
    // Filter checkboxes
    document.getElementById('filter-low-sodium').addEventListener('change', handleFilterChange);
    document.getElementById('filter-fluid-restriction').addEventListener('change', handleFilterChange);
    document.getElementById('filter-high-protein').addEventListener('change', handleFilterChange);
    document.getElementById('filter-low-protein').addEventListener('change', handleFilterChange);
   
    // Sort toggle
    document.getElementById('sort-toggle').addEventListener('click', handleSortToggle);
   
    // Dilution cards
    document.querySelectorAll('.dilution-card').forEach(card => {
        card.addEventListener('click', handleDilutionSelect);
    });
   
    // Feeding hours selection
    document.querySelectorAll('.feeding-hours-btn').forEach(btn => {
        btn.addEventListener('click', handleFeedingHoursSelect);
    });
   
    // Rate buttons
    setupRateButtons();
   
    // Generate prescription button
    const generateBtn = document.querySelector('.btn-secondary');
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGeneratePrescription);
    }
   
    // Copy prescription button
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopyPrescription);
    }
}

/**
 * Setup rate buttons
 */
function setupRateButtons() {
    const container = document.getElementById('rate-buttons');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create rate buttons from 30 to 120 in increments of 10
    for (let rate = 30; rate <= 120; rate += 10) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rate-btn';
        btn.textContent = `${rate} ml/hr`;
        btn.setAttribute('data-rate', rate);
        btn.addEventListener('click', handleRateSelect);
        container.appendChild(btn);
    }
}

/**
 * Handle patient form submission
 */
function handlePatientFormSubmit(e) {
    e.preventDefault();
   
    const heightCm = parseFloat(document.getElementById('height').value);
    const age = parseFloat(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
   
    // Validation
    if (!heightCm || heightCm < 100 || heightCm > 250) {
        alert('Please enter a valid height between 100 and 250 cm');
        return;
    }
   
    if (!age || age < 1 || age > 120) {
        alert('Please enter a valid age between 1 and 120 years');
        return;
    }
   
    // Store patient data
    AppState.patientData = { heightCm, age, gender };
   
    // Calculate IBW
    AppState.ibwValues = calculateIBWMethods(heightCm, gender);
   
    // Render IBW cards
    renderIBWCards(AppState.ibwValues, handleIBWSelect);
   
    // Show IBW selection section
    toggleVisibility('ibw-selection', true);
    scrollToElement('ibw-selection');
}

/**
 * Handle IBW method selection
 */
function handleIBWSelect(method) {
    // Remove selection from all cards
    document.querySelectorAll('.ibw-selection-card').forEach(card => {
        card.classList.remove('selected');
    });
   
    // Select clicked card
    document.getElementById(`ibw-card-${method}`).classList.add('selected');
   
    // Update state
    AppState.selectedIBW = AppState.ibwValues[method].value;
    AppState.selectedMethod = AppState.ibwValues[method].name;
   
    // Show calculate diet button
    toggleVisibility('calculate-diet-btn', true);
}

/**
 * Handle calculate diet button click
 */
function handleCalculateDiet() {
    if (!AppState.selectedIBW) {
        alert('Please select an IBW method first');
        return;
    }
   
    const proteinRange = document.getElementById('protein-range-select').value;
    const { heightCm, age, gender } = AppState.patientData;
    const weightKg = AppState.selectedIBW;
   
    // Calculate Harris-Benedict REE
    const reeValue = calculateREE(weightKg, heightCm, age, gender);
   
    // Calculate non-protein calories (25-30 kcal/kg)
    const nonProteinCal = calculateNonProteinCalories(weightKg);
   
    // Calculate protein calories
    const proteinCal = calculateProteinCalories(proteinRange, weightKg);
   
    // Calculate total (100%) and target (70%)
    const totals = calculateTotalAndTargetCalories(nonProteinCal, proteinCal);
   
    // Store calculation results
    AppState.calculationResults = {
        selectedIBW: AppState.selectedIBW,
        selectedMethod: AppState.selectedMethod,
        proteinRange: proteinRange,
        reeValue: reeValue,
        nonProteinCalMin: nonProteinCal.min,
        nonProteinCalMax: nonProteinCal.max,
        proteinGramsMin: proteinCal.gramsMin,
        proteinGramsMax: proteinCal.gramsMax,
        proteinCalMin: proteinCal.caloriesMin,
        proteinCalMax: proteinCal.caloriesMax,
        totalCalMin: totals.totalCalMin,
        totalCalMax: totals.totalCalMax,
        targetCalMin: totals.targetCalMin,
        targetCalMax: totals.targetCalMax,
        targetProteinMin: proteinCal.gramsMin,
        targetProteinMax: proteinCal.gramsMax
    };
   
    // Update UI
    document.getElementById('selected-method').textContent = `${AppState.selectedMethod} Method`;
    document.getElementById('selected-ibw').textContent = `${formatNumber(AppState.selectedIBW, 2)} kg`;
    document.getElementById('selected-protein-range').textContent = proteinRange;
   
    updateCalculationDisplay(reeValue, nonProteinCal, proteinCal, totals);
   
    // Render products
    renderProducts(ENTERAL_PRODUCTS, AppState.filters, AppState.sortAscending, handleProductSelect);
   
    // Show results
    toggleVisibility('results', true);
    scrollToElement('results');
}

/**
 * Handle filter change
 */
function handleFilterChange(e) {
    const filterId = e.target.id;
    const filterMap = {
        'filter-low-sodium': 'lowSodium',
        'filter-fluid-restriction': 'fluidRestriction',
        'filter-high-protein': 'highProtein',
        'filter-low-protein': 'lowProtein'
    };
   
    AppState.filters[filterMap[filterId]] = e.target.checked;
   
    // Update filter chip styling
    const chip = e.target.closest('.filter-chip');
    if (e.target.checked) {
        chip.classList.add('active');
    } else {
        chip.classList.remove('active');
    }
   
    // Re-render products
    renderProducts(ENTERAL_PRODUCTS, AppState.filters, AppState.sortAscending, handleProductSelect);
}

/**
 * Handle sort toggle
 */
function handleSortToggle() {
    AppState.sortAscending = !AppState.sortAscending;
   
    const toggle = document.getElementById('sort-toggle');
    const icon = document.getElementById('sort-icon');
    const text = document.getElementById('sort-text');
   
    icon.textContent = AppState.sortAscending ? '↑' : '↓';
    text.textContent = AppState.sortAscending ? 'Ascending' : 'Descending';
   
    // Visual feedback
    toggle.classList.add('active');
    setTimeout(() => toggle.classList.remove('active'), 300);
   
    // Re-render products
    renderProducts(ENTERAL_PRODUCTS, AppState.filters, AppState.sortAscending, handleProductSelect);
}

/**
 * Handle product selection
 */
function handleProductSelect(index) {
    // Remove selection from all cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
   
    // Select clicked card
    const card = document.getElementById(`product-${index}`);
    if (card) {
        card.classList.add('selected');
        AppState.selectedProduct = ENTERAL_PRODUCTS[index];
        AppState.selectedProductIndex = index;
       
        // Show dilution controls
        toggleVisibility('dilution-controls', true);
       
        // Calculate and set suggested rate
        calculateAndSetSuggestedRate();
       
        scrollToElement('dilution-controls');
    }
}

/**
 * Calculate and set suggested rate based on targets
 */
function calculateAndSetSuggestedRate() {
    if (!AppState.selectedProduct || !AppState.calculationResults) return;
   
    const diluted = applyDilution(AppState.selectedProduct.standardDilution, AppState.dilutionType);
    const targetCalAvg = (AppState.calculationResults.targetCalMin + AppState.calculationResults.targetCalMax) / 2;
    
    const caloriesPerPrep = diluted.calories;
    const volumePerPrep = diluted.finalVolumeMl;
   
    // Calculate required rate to meet average calorie target
    const requiredPreps = targetCalAvg / caloriesPerPrep;
    const requiredVolume = requiredPreps * volumePerPrep;
    const requiredRate = requiredVolume / AppState.feedingHours;
    
    // Round to nearest 10 and clamp to safe range (30-120)
    let suggestedRate = Math.round(requiredRate / 10) * 10;
    suggestedRate = Math.min(Math.max(suggestedRate, 30), 120);
    
    // Set the rate in state
    AppState.selectedRate = suggestedRate;
    
    // Update button selection
    updateRateButtonSelection(suggestedRate);
    
    // Update preview with new rate
    updateDilutionPreview();
}

/**
 * Update rate button selection
 */
function updateRateButtonSelection(rate) {
    document.querySelectorAll('.rate-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.getAttribute('data-rate')) === rate) {
            btn.classList.add('selected');
        }
    });
}

/**
 * Handle dilution type selection
 */
function handleDilutionSelect(e) {
    const card = e.currentTarget;
    const radio = card.querySelector('input[type="radio"]');
   
    if (radio) {
        AppState.dilutionType = radio.value;
       
        // Update UI
        document.querySelectorAll('.dilution-card').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');
       
        // Recalculate and set suggested rate for new dilution
        calculateAndSetSuggestedRate();
    }
}

/**
 * Handle feeding hours selection
 */
function handleFeedingHoursSelect(e) {
    const hours = parseInt(e.currentTarget.getAttribute('data-hours'));
    AppState.feedingHours = hours;
   
    // Update UI
    document.querySelectorAll('.feeding-hours-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    e.currentTarget.classList.add('selected');
   
    // Recalculate and set suggested rate for new feeding hours
    calculateAndSetSuggestedRate();
}

/**
 * Handle rate selection
 */
function handleRateSelect(e) {
    const rate = parseInt(e.currentTarget.getAttribute('data-rate'));
    AppState.selectedRate = rate;
    
    // Update button selection
    updateRateButtonSelection(rate);
   
    // Update preview immediately (optimistic update)
    updateDilutionPreview();
}

/**
 * Update dilution preview with target analysis
 */
function updateDilutionPreview() {
    if (!AppState.selectedProduct || !AppState.calculationResults) {
        return;
    }
   
    const diluted = applyDilution(AppState.selectedProduct.standardDilution, AppState.dilutionType);
    const targetCalMin = AppState.calculationResults.targetCalMin;
    const targetCalMax = AppState.calculationResults.targetCalMax;
    const targetProteinMin = AppState.calculationResults.targetProteinMin;
    const targetProteinMax = AppState.calculationResults.targetProteinMax;
    
    // Use current rate or default to 60
    const currentRate = AppState.selectedRate || 60;
    
    // Calculate at current rate
    const caloriesPerPrep = diluted.calories;
    const proteinPerPrep = diluted.protein;
    const volumePerPrep = diluted.finalVolumeMl;
    
    const timePerPrep = volumePerPrep / currentRate;
    const prepsPerDay = AppState.feedingHours / timePerPrep;
    const actualCalories = prepsPerDay * caloriesPerPrep;
    const actualProtein = prepsPerDay * proteinPerPrep;
    const actualVolume = prepsPerDay * volumePerPrep;
    
    // Calculate deficits (don't allow negative deficits)
    const calorieDeficitMin = Math.max(0, targetCalMin - actualCalories);
    const calorieDeficitMax = Math.max(0, targetCalMax - actualCalories);
    const proteinDeficitMin = Math.max(0, targetProteinMin - actualProtein);
    const proteinDeficitMax = Math.max(0, targetProteinMax - actualProtein);
    
    // Check if targets are met (within range)
    const meetsCalorieTarget = actualCalories >= targetCalMin && actualCalories <= targetCalMax;
    const meetsProteinTarget = actualProtein >= targetProteinMin && actualProtein <= targetProteinMax;
    
    // Check if exceeding upper limits
    const exceedsCalorieMax = actualCalories > targetCalMax;
    const exceedsProteinMax = actualProtein > targetProteinMax;
    
    // Calculate suggested rate (rounded to nearest 10)
    const targetCalAvg = (targetCalMin + targetCalMax) / 2;
    const requiredPreps = targetCalAvg / caloriesPerPrep;
    const requiredVolume = requiredPreps * volumePerPrep;
    const requiredRate = requiredVolume / AppState.feedingHours;
    let suggestedRate = Math.round(requiredRate / 10) * 10;
    suggestedRate = Math.min(Math.max(suggestedRate, 30), 120);
    
    // Calculate feeds per day (rounded to nearest 0.5)
    const feedsPerDay = Math.round(prepsPerDay * 2) / 2;
    
    // Store schedule for prescription generation
    AppState.currentSchedule = {
        timePerPrep,
        prepsPerDay,
        feedsPerDay,
        actualCalories,
        actualProtein,
        actualVolume,
        caloriesPerPrep,
        proteinPerPrep,
        volumePerPrep,
        calorieDeficitMin,
        calorieDeficitMax,
        proteinDeficitMin,
        proteinDeficitMax,
        meetsCalorieTarget,
        meetsProteinTarget,
        suggestedRate,
        targetCalMin,
        targetCalMax,
        targetProteinMin,
        targetProteinMax,
        exceedsCalorieMax,
        exceedsProteinMax
    };
   
    // Update preview display
    const preview = document.getElementById('dilution-preview');
    const dilutionLabels = {
        half: '½ Standard Dilution',
        standard: 'Standard Dilution',
        double: '2× Standard Dilution'
    };
    
    // Determine status colors and messages
    let calorieColor = '#4CAF50'; // Green
    let calorieStatus = '✅ Within target range';
    
    if (exceedsCalorieMax) {
        calorieColor = '#ff9800'; // Orange
        calorieStatus = '⚠️ Exceeds upper limit';
    } else if (!meetsCalorieTarget) {
        calorieColor = '#f44336'; // Red
        calorieStatus = '⚠️ Below target range';
    }
    
    let proteinColor = '#4CAF50'; // Green
    let proteinStatus = '✅ Within target range';
    
    if (exceedsProteinMax) {
        proteinColor = '#ff9800'; // Orange
        proteinStatus = '⚠️ Exceeds upper limit';
    } else if (!meetsProteinTarget) {
        proteinColor = '#f44336'; // Red
        proteinStatus = '⚠️ Below target range';
    }
    
    preview.innerHTML = `
        <h4 style="color: #2e7d32; margin-bottom: 15px;">📊 Feed Configuration</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <strong style="color: #667eea;">Dilution Type:</strong><br>
                <span style="font-size: 1.2em; font-weight: 700;">${dilutionLabels[AppState.dilutionType]}</span>
            </div>
            <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <strong style="color: #667eea;">Feeding Hours:</strong><br>
                <span style="font-size: 1.2em; font-weight: 700;">${AppState.feedingHours} hours</span>
            </div>
            <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <strong style="color: #667eea;">Current Rate:</strong><br>
                <span style="font-size: 1.2em; font-weight: 700; color: #2196F3;">${currentRate} ml/hour</span>
            </div>
            <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <strong style="color: #667eea;">Time per Feed:</strong><br>
                <span style="font-size: 1.2em; font-weight: 700;">${formatNumber(timePerPrep, 1)} hours</span>
            </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 2px solid #e0e0e0; margin-bottom: 20px;">
            <h5 style="color: #2196F3; margin-bottom: 15px;">🎯 Target Analysis</h5>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid ${calorieColor};">
                    <strong style="color: #667eea;">Calorie Target (70%):</strong><br>
                    <span style="font-size: 1.2em; font-weight: bold; color: #333;">
                        ${formatNumber(targetCalMin, 0)} - ${formatNumber(targetCalMax, 0)} kcal/day
                    </span>
                    <hr style="margin: 10px 0; border: none; border-top: 1px solid #eee;">
                    <strong>Delivered:</strong> ${Math.round(actualCalories)} kcal/day<br><br>
                    
                    <div style="padding: 8px; background: ${exceedsCalorieMax ? '#fff3e0' : (meetsCalorieTarget ? '#e8f5e9' : '#ffebee')}; border-radius: 4px;">
                        <strong style="color: ${calorieColor};">${calorieStatus}</strong>
                        ${!meetsCalorieTarget && !exceedsCalorieMax ? 
                            `<br>Deficit: ${formatNumber(calorieDeficitMin, 0)} - ${formatNumber(calorieDeficitMax, 0)} kcal` : 
                        exceedsCalorieMax ? 
                            `<br>Exceeds by: ${formatNumber(actualCalories - targetCalMax, 0)} kcal` : ''}
                    </div>
                </div>
                
                <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid ${proteinColor};">
                    <strong style="color: #667eea;">Protein Target:</strong><br>
                    <span style="font-size: 1.2em; font-weight: bold; color: #333;">
                        ${formatNumber(targetProteinMin, 1)} - ${formatNumber(targetProteinMax, 1)} g/day
                    </span>
                    <hr style="margin: 10px 0; border: none; border-top: 1px solid #eee;">
                    <strong>Delivered:</strong> ${formatNumber(actualProtein, 1)} g/day<br><br>
                    
                    <div style="padding: 8px; background: ${exceedsProteinMax ? '#fff3e0' : (meetsProteinTarget ? '#e8f5e9' : '#ffebee')}; border-radius: 4px;">
                        <strong style="color: ${proteinColor};">${proteinStatus}</strong>
                        ${!meetsProteinTarget && !exceedsProteinMax ? 
                            `<br>Deficit: ${formatNumber(proteinDeficitMin, 1)} - ${formatNumber(proteinDeficitMax, 1)} g` : 
                        exceedsProteinMax ? 
                            `<br>Exceeds by: ${formatNumber(actualProtein - targetProteinMax, 1)} g` : ''}
                    </div>
                </div>
            </div>
        </div>
        
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border: 2px solid #4CAF50;">
            <h5 style="color: #2e7d32; margin-bottom: 15px;">🍼 Feed Schedule</h5>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                <div style="padding: 15px; background: white; border-radius: 8px; text-align: center;">
                    <strong style="color: #667eea; display: block; margin-bottom: 5px;">Feeds per Day</strong>
                    <span style="font-size: 1.5em; font-weight: bold; color: #2196F3;">${feedsPerDay}</span><br>
                    <small style="color: #666;">(Every ${formatNumber(timePerPrep, 1)} hours)</small>
                </div>
                <div style="padding: 15px; background: white; border-radius: 8px; text-align: center;">
                    <strong style="color: #667eea; display: block; margin-bottom: 5px;">Each Feed Contains</strong>
                    <div style="font-size: 1.2em;">
                        <span style="font-weight: bold; color: #4CAF50;">${Math.round(caloriesPerPrep)} kcal</span><br>
                        <span style="font-weight: bold; color: #2196F3;">${formatNumber(proteinPerPrep, 1)} g protein</span>
                    </div>
                </div>
                <div style="padding: 15px; background: white; border-radius: 8px; text-align: center;">
                    <strong style="color: #667eea; display: block; margin-bottom: 5px;">Feed Volume</strong>
                    <span style="font-size: 1.5em; font-weight: bold; color: #FF9800;">${Math.round(volumePerPrep)} ml</span><br>
                    <small style="color: #666;">per feed</small>
                </div>
            </div>
            
            <div style="background: #f1f8e9; padding: 15px; border-radius: 6px; margin-top: 10px;">
                <h6 style="color: #2e7d32; margin-bottom: 10px;">📊 Daily Total</h6>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
                    <div style="padding: 10px; background: white; border-radius: 6px; text-align: center;">
                        <strong>Calories</strong><br>
                        <span style="font-weight: bold; color: #4CAF50;">${Math.round(actualCalories)} kcal</span>
                    </div>
                    <div style="padding: 10px; background: white; border-radius: 6px; text-align: center;">
                        <strong>Protein</strong><br>
                        <span style="font-weight: bold; color: #2196F3;">${formatNumber(actualProtein, 1)} g</span>
                    </div>
                    <div style="padding: 10px; background: white; border-radius: 6px; text-align: center;">
                        <strong>Volume</strong><br>
                        <span style="font-weight: bold; color: #FF9800;">${Math.round(actualVolume)} ml</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 15px; padding: 10px; background: #fff8e1; border-radius: 6px; border: 1px solid #ffd54f;">
                <small style="color: #5d4037;">
                    💡 <strong>Instruction:</strong> Prepare fresh feed every ${formatNumber(timePerPrep, 1)} hours. 
                    Each feed requires ${Math.round(volumePerPrep)} ml to be administered over ${formatNumber(timePerPrep, 1)} hours.
                </small>
            </div>
        </div>
    `;
}

/**
 * Handle generate prescription button click
 */
function handleGeneratePrescription() {
    if (!AppState.selectedProduct || !AppState.calculationResults || !AppState.selectedRate) {
        alert('Please select a feeding rate first');
        return;
    }
   
    const prescriptionText = generatePrescriptionText(
        AppState.patientData,
        AppState.calculationResults,
        AppState.selectedProduct,
        AppState.dilutionType,
        AppState.selectedRate,
        AppState.feedingHours,
        AppState.currentSchedule
    );
   
    document.getElementById('prescription-text').textContent = prescriptionText;
    toggleVisibility('feeding-results', true);
    scrollToElement('feeding-results');
}

/**
 * Handle copy prescription button click
 */
function handleCopyPrescription() {
    const prescriptionText = document.getElementById('prescription-text').textContent;
   
    navigator.clipboard.writeText(prescriptionText)
        .then(() => {
            const btn = document.querySelector('.copy-btn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy prescription. Please copy manually.');
        });
}

/**
 * Start the application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}