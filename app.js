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
    selectedRate: 60
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
   
    const activity = document.getElementById('activity').value;
    const { heightCm, age, gender } = AppState.patientData;
    const weightKg = AppState.selectedIBW;
   
    // Calculate REE
    const reeValues = calculateREE(weightKg, heightCm, age, gender);
    const reeAverage = calculateAverageREE(reeValues);
    const calorieRange = calculateCalorieRange(weightKg);
   
    // Calculate protein requirements
    const proteinReqs = calculateProteinRequirements(activity, weightKg);
   
    // Calculate energy requirements
    const energyReqs = calculateEnergyRequirements(calorieRange, proteinReqs);
   
    // Calculate protein percentage
    const proteinPercent = calculateProteinPercentage(proteinReqs, energyReqs);
   
    // Store calculation results
    AppState.calculationResults = {
        selectedIBW: AppState.selectedIBW,
        selectedMethod: AppState.selectedMethod,
        reeRangeMin: calorieRange.min,
        reeRangeMax: calorieRange.max,
        proteinMin: proteinReqs.gramsMin,
        proteinMax: proteinReqs.gramsMax,
        proteinCalMin: proteinReqs.caloriesMin,
        proteinCalMax: proteinReqs.caloriesMax,
        ...energyReqs,
        proteinPercentMin: proteinPercent.min,
        proteinPercentMax: proteinPercent.max,
        activity
    };
   
    // Update UI
    document.getElementById('selected-method').textContent = `${AppState.selectedMethod} Method`;
    document.getElementById('selected-ibw').textContent = `${formatNumber(AppState.selectedIBW, 2)} kg`;
   
    updateREEDisplay(reeValues, reeAverage, calorieRange);
   
    const activityElement = document.getElementById('activity');
    const activityText = activityElement.options[activityElement.selectedIndex].text;
    updateProteinDisplay(activityText, proteinReqs, proteinPercent);
   
    updateEnergyDisplay(energyReqs);
   
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
       
        // Initialize dilution controls
        renderRateButtons(AppState.selectedRate, handleRateSelect);
        updateDilutionPreview(AppState.selectedProduct, AppState.dilutionType, AppState.selectedRate);
       
        scrollToElement('dilution-controls');
    }
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
       
        // Update preview
        if (AppState.selectedProduct) {
            updateDilutionPreview(AppState.selectedProduct, AppState.dilutionType, AppState.selectedRate);
        }
    }
}


/**
 * Handle feeding rate selection
 */
function handleRateSelect(rate) {
    AppState.selectedRate = rate;
   
    // Update button styling
    document.querySelectorAll('.rate-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
   
    // Update preview
    if (AppState.selectedProduct) {
        updateDilutionPreview(AppState.selectedProduct, AppState.dilutionType, AppState.selectedRate);
    }
}


/**
 * Handle generate prescription button click
 */
function handleGeneratePrescription() {
    if (!AppState.selectedProduct || !AppState.calculationResults) {
        alert('Please complete all previous steps first');
        return;
    }
   
    const feedHours = parseInt(document.getElementById('feed-hours').value, 10);
   
    const prescriptionText = generatePrescriptionText(
        AppState.patientData,
        AppState.calculationResults,
        AppState.selectedProduct,
        AppState.dilutionType,
        AppState.selectedRate,
        feedHours
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