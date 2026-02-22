/**
 * UI rendering and DOM manipulation functions
 */

// ─── IBW Cards ────────────────────────────────────────────────────────────────

function renderIBWCards(ibwValues, onSelect) {
    const container = document.getElementById('ibw-cards');
    container.innerHTML = '';
    Object.keys(ibwValues).forEach(key => {
        container.appendChild(createIBWCard(key, ibwValues[key], () => onSelect(key)));
    });
}

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

// ─── Calculation Display ──────────────────────────────────────────────────────

function updateCalculationDisplay(reeValue, nonProteinCal, proteinCal, totals, targetPct) {
    const pctLabel = Math.round((targetPct || 0.7) * 100);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('ree-value',        `${Math.round(reeValue)} kcal/day`);
    set('non-protein-cal',  `${Math.round(nonProteinCal.min)} – ${Math.round(nonProteinCal.max)} kcal/day`);
    set('protein-cal',      `${Math.round(proteinCal.caloriesMin)} – ${Math.round(proteinCal.caloriesMax)} kcal/day`);
    set('total-cal',        `${Math.round(totals.totalCalMin)} – ${Math.round(totals.totalCalMax)} kcal/day`);
    set('target-cal',       `${Math.round(totals.targetCalMin)} – ${Math.round(totals.targetCalMax)} kcal/day`);

    // Update target label dynamically
    const targetLabel = document.getElementById('target-cal-label');
    if (targetLabel) targetLabel.textContent = `🎯 Target Calories (${pctLabel}%)`;
}

// ─── Product List ─────────────────────────────────────────────────────────────

function renderProducts(products, filters, sortAscending, onSelect) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    let filtered = filterProducts(products, filters);
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-products">No products match the selected filters. Please adjust your filter criteria.</div>';
        return;
    }

    sortProducts(filtered, filters, sortAscending)
        .forEach(({ product, index, filterData }) => {
            container.appendChild(createProductCard(product, index, filterData, () => onSelect(index)));
        });
}

function filterProducts(products, filters) {
    return products
        .map((product, index) => ({ product, index, filterData: evaluateProductFilters(product) }))
        .filter(({ filterData }) => {
            if (filters.lowSodium         && !filterData.lowSodium)         return false;
            if (filters.fluidRestriction  && !filterData.fluidRestriction)  return false;
            if (filters.highProtein       && !filterData.highProtein)       return false;
            if (filters.lowProtein        && !filterData.lowProtein)        return false;
            if (filters.lowCalorieDensity && !filterData.lowCalorieDensity) return false;
            if (filters.highCalorieDensity&& !filterData.highCalorieDensity)return false;
            return true;
        });
}

function sortProducts(filteredProducts, filters, ascending) {
    let sortKey = 'name';
    if      (filters.lowSodium)                                sortKey = 'sodiumValue';
    else if (filters.fluidRestriction)                         sortKey = 'caloriesPerMlValue';
    else if (filters.highProtein || filters.lowProtein)        sortKey = 'proteinPerPrepValue';
    else if (filters.lowCalorieDensity||filters.highCalorieDensity) sortKey = 'calorieDensityValue';

    return filteredProducts.sort((a, b) => {
        if (sortKey === 'name') {
            const cmp = a.product.name.localeCompare(b.product.name);
            return ascending ? cmp : -cmp;
        }
        const valA = a.filterData[sortKey], valB = b.filterData[sortKey];
        if (sortKey === 'caloriesPerMlValue') return ascending ? valB - valA : valA - valB;
        return ascending ? valA - valB : valB - valA;
    });
}

function createProductCard(product, index, filterData, onClick) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.id = `product-${index}`;
    card.onclick = onClick;
    card.innerHTML = `
        <div class="product-header">
            <div class="product-name">${product.name}</div>
            <div class="product-badges">${createBadges(filterData)}</div>
        </div>
        <div class="product-category">${product.category} • ${product.manufacturer}</div>
        <div class="product-feature">${product.features}</div>
        <div class="product-specs">${createProductSpecs(product, filterData)}</div>
        <div style="margin-top:15px;padding:10px;background:#f0f9ff;border-radius:8px;font-size:0.9em;color:#0277bd;">
            <strong>Standard Dilution:</strong> ${product.standardDilution.preparationInstruction}
        </div>
    `;
    return card;
}

function createBadges(filterData) {
    let b = '';
    if (filterData.lowSodium)          b += '<span class="badge badge-sodium">Low Sodium</span>';
    if (filterData.fluidRestriction)   b += '<span class="badge badge-fluid">Fluid Restriction</span>';
    if (filterData.highProtein)        b += '<span class="badge badge-protein-high">High Protein</span>';
    if (filterData.lowProtein)         b += '<span class="badge badge-protein-low">Low Protein</span>';
    if (filterData.lowCalorieDensity)  b += '<span class="badge badge-calden-low">Low Cal Density</span>';
    if (filterData.highCalorieDensity) b += '<span class="badge badge-calden-high">High Cal Density</span>';
    return b;
}

function createProductSpecs(product, filterData) {
    const s   = product.standardDilution;
    const den = filterData.calorieDensity.value; // kcal/ml = calories / finalVolumeMl
    return [
        { label:'Calories',     value:`${Math.round(s.calories)} kcal` },
        { label:'Cal Density',  value:`${den.toFixed(2)} kcal/ml`, highlight:true },
        { label:'Protein',      value:`${s.protein.toFixed(1)} g` },
        { label:'Fat',          value:`${s.fat.toFixed(1)} g` },
        { label:'CHO',          value:`${s.carbohydrate.toFixed(1)} g` },
        { label:'Sodium',       value:`${Math.round(s.sodium)} mg` },
        { label:'Potassium',    value:`${Math.round(s.potassium)} mg` },
        { label:'Phosphorus',   value:`${Math.round(s.phosphorus)} mg` },
        { label:'Total Volume', value:`${s.finalVolumeMl} ml` }
    ].map(({ label, value, highlight }) =>
        `<div class="spec-item${highlight?' spec-item--highlight':''}">
            <span class="spec-label">${label}</span>
            <span class="spec-value">${value}</span>
        </div>`
    ).join('');
}

// ─── Prescription Text ────────────────────────────────────────────────────────

/**
 * Generate prescription in the exact client-specified format.
 * All numbers are rounded to clean integers or 1 decimal — no ugly floating point.
 */
function generatePrescriptionText(patientData, calculationResults, product, dilutionType, rate, feedingHours, schedule) {
    const { heightCm, age, gender } = patientData;
    const {
        selectedIBW, selectedMethod, proteinRange, reeValue,
        nonProteinCalMin, nonProteinCalMax,
        proteinGramsMin, proteinGramsMax,
        proteinCalMin, proteinCalMax,
        totalCalMin, totalCalMax,
        targetCalMin, targetCalMax,
        targetPct
    } = calculationResults;

    const diluted   = applyDilution(product.standardDilution, dilutionType);
    const pctLabel  = Math.round((targetPct || 0.7) * 100);
    const dayTarget = pctLabel === 70 ? 'day 3' : pctLabel === 50 ? 'day 2' : 'day 1';

    /* ── Harris-Benedict formula lines ── */
    const ibwStr = selectedIBW.toFixed(1);
    const hcmStr = Math.round(heightCm);
    
    // Standard formula for educational purpose
    const standardFormula = gender === 'male'
        ? '66.47 + (13.75 × weight in kg) + (5.0 × height in cm) - (6.76 × age in years)'
        : '655.1 + (9.56 × weight in kg) + (1.85 × height in cm) - (4.68 × age in years)';
    
    // Patient-specific calculation
    const patientCalculation = gender === 'male'
        ? `66.47 + (13.75 × ${ibwStr}) + (5.0 × ${hcmStr}) - (6.76 × ${age}) = ${Math.round(reeValue)} KCal/day`
        : `655.1 + (9.56 × ${ibwStr}) + (1.85 × ${hcmStr}) - (4.68 × ${age}) = ${Math.round(reeValue)} KCal/day`;

    /* ── Non-protein calories ── */
    const npMin = Math.round(nonProteinCalMin);
    const npMax = Math.round(nonProteinCalMax);

    /* ── Protein ── */
    const [proteinLo, proteinHi] = proteinRange.includes('-')
        ? proteinRange.split('-').map(parseFloat)
        : [parseFloat(proteinRange), parseFloat(proteinRange)];
    const proteinRangeStr = proteinLo === proteinHi ? `${proteinLo}` : `${proteinLo}–${proteinHi}`;
    const protGramsMin = Math.round(proteinGramsMin);
    const protGramsMax = Math.round(proteinGramsMax);
    const protCalMin   = Math.round(proteinCalMin);
    const protCalMax   = Math.round(proteinCalMax);

    /* ── Totals ── */
    const totMin    = Math.round(totalCalMin);
    const totMax    = Math.round(totalCalMax);
    const targMin   = Math.round(targetCalMin);
    const targMax   = Math.round(targetCalMax);
    const rEE       = Math.round(reeValue);

    /* ── Dilution instruction ── */
    const scoops    = Math.round(diluted.scoops);
    const scoopsTxt = diluted.scoopsText;
    const waterMl   = Math.round(diluted.waterMl);
    const totalVol  = Math.round(diluted.finalVolumeMl);

    /* ── Daily delivery ── */
    const totalCalDel  = Math.round(schedule.actualCalories);
    const totalProtDel = schedule.actualProtein.toFixed(1);
    const totalVolDel  = Math.round(schedule.actualVolume);
    const timeBetween  = schedule.timePerPrep.toFixed(1);

    /* ── Extra supplementation ── */
    let extraSupp = 'Nil';
    const calShort  = !schedule.meetsCalorieTarget && !schedule.exceedsCalorieMax;
    const protShort = !schedule.meetsProteinTarget && !schedule.exceedsProteinMax;
    if (calShort || protShort) {
        const parts = [];
        if (calShort) parts.push(`additional calories`);
        if (protShort) parts.push(`additional protein`);
        extraSupp = 'Consider supplementing ' + parts.join(' and ');
    }

    /* ── Assemble prescription ── */
    return `Enteral Nutrition Prescription :


Measured height                        ~ ${hcmStr} cm

Estimated IBW                          : ${ibwStr} Kg  (Formula chosen : ${selectedMethod})

Resting Energy Expenditure             :

  Harris Benedict equation             - ${standardFormula}
  Patient calculation                  - ${patientCalculation}

  Predicted body weight based calculation : 25-30 Kcal/kg/day
                                       = ${ibwStr} × 25-30 = ${npMin}–${npMax} KCal per day

Recommended protein intake             : ${proteinRangeStr} gm/kg/day = ${protGramsMin}–${protGramsMax} g of protein per day
Calories from Protein                  = ${protCalMin}–${protCalMax} Kcal
Total calories required (Calories from proteins to be added to total estimated)
                                       : ${totMin}–${totMax} Kcal per day
Target is to meet at least ${pctLabel}% by ${dayTarget} which is
                                       : ${targMin}–${targMax} KCal/day

Enteral formula selected               : ${product.name}
Manufacturer recommended Standard dilution : ${product.standardDilution.preparationInstruction}

Instructions to Nurse:
Dilution : ${scoops} ${scoopsTxt} in ${waterMl} mL of water will make a total volume of ${totalVol} mL
           to be administered at the rate of ${rate} mL per hour
Shake feed in bag every hour
Prepare fresh feed every ${timeBetween} hours
Total calories delivered               = ${totalCalDel} Kcal,
Total Protein delivered                = ${totalProtDel} g per day
Any extra supplementation needed       : ${extraSupp}
Total volume from Enteral feed per day : ${totalVolDel} mL

Standard precautions to be followed while preparing feeds:

•  All personal protective equipment on
•  Wash hands with soap for about 40-60 seconds
•  Use sterile plastic apron and hand care gloves while preparing the feed
•  Prepare feed as per prescription
•  After mixing thoroughly put the preparation into feeding bag
•  Confirm position of Ryles tube/Freka tube with hissing sound in epigastric area
   before starting feeds (If any doubt - inform the consultant immediately)
•  Start feed at prescribed rate only
•  Whenever a patient is in NBM, please confirm with ICU consultant about need
   for starting IV fluids
•  Measure Gastric residual volume once each morning before starting feeds.
   Anything above 100 mL has to be brought to the notice of ICU consultant
   on duty immediately
•  Monitor GRBS as advised in daily notes, and inform ICU Consultant if
   GRBS > 180 mg/dL
•  Any change in dilutions or rate of administration has to be brought to the
   notice of ICU consultant`;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function toggleVisibility(elementId, show) {
    const el = document.getElementById(elementId);
    show ? el.classList.remove('hidden') : el.classList.add('hidden');
}

function scrollToElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}