// script.js

// --- Global variables for data and state ---
let classData = []; // Start with an empty array, will be populated from JSON
let detailedSkillChanges = {};
const restrictionGroups = { // Keep this updated based on actual game restrictions
    "Group1": ["Mystic Muse", "Archmage", "Storm Screamer", "Soultaker"], // Wizards
    "Group2": ["Arcana Lord", "Elemental Master", "Spectral Master"], // Summoners
    "Group3": ["Adventurer", "Wind Rider", "Ghost Hunter"], // Daggers (Human, Elf, Dark Elf)
    "Group4": ["Sagittarius", "Moonlight Sentinel", "Ghost Sentinel", "Trickster"], // Archers
    "Group5": ["Death Knight"], // Example: Group all DKs if needed, adjust if race matters
    "Group6": ["Phoenix Knight", "Hell Knight", "Eva's Templar", "Shillien Templar"], // Main Tanks
    "Group7": ["Duelist", "Dreadnought", "Titan", "Grand Khavatari", "Maestro", "Doombringer", "Soul Hound"], // Warriors
    "Group8": ["Cardinal", "Eva's Saint", "Shillien Saint"], // Healers
    "Group9": ["Hierophant", "Sword Muse", "Spectral Dancer", "Dominator", "Doomcryer"] // Enchanters
};
const specificInvalidCombinations = [
    // Example: ["Mystic Muse", "Ghost Sentinel"] - Keep this if still relevant
];

// This will be populated dynamically from the loaded JSON
const classesByCategory = {
    "Damage Dealers": [],
    "Tanks": [],
    "Healers": [],
    "Enchanters": []
};

// --- Translations (remains the same) ---
const translations = {
    de: {
        mainTitle: "Mimir Klassenvergleich",
        categoryLabel: "Kategorie:",
        allCategories: "Alle Kategorien",
        damageDealers: "Damage Dealers",
        tanks: "Tanks",
        healers: "Heiler",
        enchanters: "Enchanter",
        sortLabel: "Sortieren nach:",
        overallRating: "Gesamt",
        dps: "DPS",
        survival: "Überleben",
        utility: "Nützlichkeit",
        mobility: "Mobilität",
        ease: "Spielbarkeit",
        pveRating: "PvE Wertung",
        pvpRating: "PvP Wertung",
        sortAscending: "Aufsteigend",
        sortDescending: "Absteigend",
        showLabel: "Anzeigen:",
        allClasses: "Alle Klassen",
        topClasses: "Top Klassen",
        noClassSelected: "Bitte Klasse wählen",
        errorSelectBothClasses: "Bitte beide Klassen auswählen.",
        comboTitle: "Klassen-Kombination finden",
        category1Label: "Erste Klasse:",
        category2Label: "Zweite Klasse:",
        findComboBtnText: "Kombinationen finden",
        perfectMatch: "Perfekte Kombination",
        goodSynergy: "Gute Synergie",
        neutralSynergy: "Neutrale Synergie",
        noComboFound: "Keine spezifische Synergie-Info. Prüfe Kompatibilität.",
        compatibilityTitle: "Dual-Class Kompatibilität:",
        compatible: "Diese Klassen sind kompatibel.",
        incompatible: "Diese Klassen sind NICHT kompatibel.",
        errorSameClassSelected: "Die Klassen müssen unterschiedlich sein.",
        errorSameGroup: "Beide Klassen gehören zur selben Restriktionsgruppe:",
        errorSpecificComboNotAllowed: "Diese spezifische Kombination ist nicht erlaubt.",
        alternativeSuggestion: "Versuche stattdessen eine dieser Klassen:",
        colHeaderName: "Klasse",
        colHeaderCategory: "Kategorie",
        colHeaderDps: "DPS",
        colHeaderSurvival: "Überleben",
        colHeaderUtility: "Nützlichkeit",
        colHeaderMobility: "Mobilität",
        colHeaderEase: "Spielbarkeit",
        colHeaderPve: "PvE",
        colHeaderPvp: "PvP",
        colHeaderOverall: "Gesamt",
        topCategoryRecommendationsTitle: "Top-Empfehlungen nach Kategorie",
        generalNotesTitle: "Allgemeine Hinweise & Balancing",
        dualClassSystemTitle: "Dual-Class-System & Beschränkungen",
        dualClassDescriptionText: "Das Dual-Class-System erlaubt es, zwei verschiedene Klassen zu spielen. Beachten Sie jedoch, dass es bestimmte Beschränkungen gibt - Sie können nicht zwei Klassen aus derselben der folgenden Gruppen wählen:",
        specificRestrictionNote: "Zusätzlich können bestimmte spezifische Kombinationen nicht erlaubt sein.",
        tankChangesTitle: "Änderungen bei Tanks",
        tankChangesText: "Die Bogenresistenz für viele Tank- und Kriegerklassen wurde angepasst. Neue Fähigkeiten und überarbeitete Rüstungsmeisterschaften helfen, ihre Rolle zu definieren.",
        healerChangesTitle: "Änderungen bei Heilern",
        healerChangesText: "Heiler haben Verbesserungen erhalten, darunter erhöhte Schadensreduktion, verbesserte Wiederbelebung und neue passive Fähigkeiten zur Stärkung ihrer Support-Rolle.",
        archerChangesTitle: "Änderungen bei Bogenschützen",
        archerChangesText: "Bogenschützen-Debuffs wurden teilweise angepasst. Die Effektivität hängt nun stärker von der Ausrüstung und den Buffs/Debuffs anderer Klassen ab.",
        modalClassDetailsTitle: "Klassendetails",
        modalRatingsTitle: "Bewertungen",
        modalSkillChangesTitle: "Skill-Änderungen",
        modalNoSkillData: "Keine detaillierten Skill-Daten für diese Klasse verfügbar.",
        newSkillHighlightText: "NEU",
        changedSkillHighlightText: "GEÄNDERT",
        damageFocusLabel: "Schadensfokus:",
        damageFocusAll: "Alle",
        damageFocusSingleTarget: "Single Target",
        damageFocusAoe: "AOE",
        damageFocusHybrid: "Hybrid",
        damageFocusSupport: "Support",
        gameplayStyleLabel: "Spielstil-Empfehlung:",
        gameplayStyleAll: "Alle Stile",
        gameplayStylePvpCombo: "PvP Gruppe",
        gameplayStylePveCombo: "PvE Gruppe",
        gameplayStyleAoeFarm: "AoE Farmen",
        gameplayStyleSingleTargetBoss: "Single Target Boss",
        gameplayStyleSoloPvp: "PvP Solo",
        loadingData: "Lade Daten...", // Added missing translation
        noResults: "Keine Klassen entsprechen den Filtern.", // Added missing translation
        strengths: "Stärken", // Added missing translation
    },
    en: { // English translations remain the same
        mainTitle: "Mimir Class Comparison",
        categoryLabel: "Category:",
        allCategories: "All Categories",
        damageDealers: "Damage Dealers",
        tanks: "Tanks",
        healers: "Healers",
        enchanters: "Enchanters",
        sortLabel: "Sort by:",
        overallRating: "Overall",
        dps: "DPS",
        survival: "Survival",
        utility: "Utility",
        mobility: "Mobility",
        ease: "Ease",
        pveRating: "PvE Rating",
        pvpRating: "PvP Rating",
        sortAscending: "Ascending",
        sortDescending: "Descending",
        showLabel: "Show:",
        allClasses: "All Classes",
        topClasses: "Top Classes",
        noClassSelected: "Please select a class",
        errorSelectBothClasses: "Please select both classes.",
        comboTitle: "Find Class Combination",
        category1Label: "First Class:",
        category2Label: "Second Class:",
        findComboBtnText: "Find Combinations",
        perfectMatch: "Perfect Match",
        goodSynergy: "Good Synergy",
        neutralSynergy: "Neutral Synergy",
        noComboFound: "No specific synergy info. Check compatibility.",
        compatibilityTitle: "Dual-Class Compatibility:",
        compatible: "These classes are compatible.",
        incompatible: "These classes are NOT compatible.",
        errorSameClassSelected: "Classes must be different.",
        errorSameGroup: "Both classes belong to the same restriction group:",
        errorSpecificComboNotAllowed: "This specific combination is not allowed.",
        alternativeSuggestion: "Try one of these classes instead:",
        colHeaderName: "Class",
        colHeaderCategory: "Category",
        colHeaderDps: "DPS",
        colHeaderSurvival: "Survival",
        colHeaderUtility: "Utility",
        colHeaderMobility: "Mobility",
        colHeaderEase: "Ease",
        colHeaderPve: "PvE",
        colHeaderPvp: "PvP",
        colHeaderOverall: "Overall",
        topCategoryRecommendationsTitle: "Top Recommendations by Category",
        generalNotesTitle: "General Notes & Balancing",
        dualClassSystemTitle: "Dual-Class System & Restrictions",
        dualClassDescriptionText: "The Dual-Class system allows playing two different classes. However, note there are restrictions - you cannot pick two classes from the same of the following groups:",
        specificRestrictionNote: "Additionally, certain specific combinations may not be allowed.",
        tankChangesTitle: "Changes to Tanks",
        tankChangesText: "Bow resistance for many tank and warrior classes has been adjusted. New skills and revised armor masteries help define their role.",
        healerChangesTitle: "Changes to Healers",
        healerChangesText: "Healers received improvements, including increased damage reduction, enhanced resurrection, and new passive skills to bolster their support role.",
        archerChangesTitle: "Changes to Archers",
        archerChangesText: "Archer debuffs have been partially adjusted. Effectiveness now depends more on gear and buffs/debuffs from other classes.",
        modalClassDetailsTitle: "Class Details",
        modalRatingsTitle: "Ratings",
        modalSkillChangesTitle: "Skill Changes",
        modalNoSkillData: "No detailed skill data available for this class.",
        newSkillHighlightText: "NEW",
        changedSkillHighlightText: "CHANGED",
        damageFocusLabel: "Damage Focus:",
        damageFocusAll: "All",
        damageFocusSingleTarget: "Single Target",
        damageFocusAoe: "AOE",
        damageFocusHybrid: "Hybrid",
        damageFocusSupport: "Support",
        gameplayStyleLabel: "Gameplay Style Recommendation:",
        gameplayStyleAll: "All Styles",
        gameplayStylePvpCombo: "PvP Group",
        gameplayStylePveCombo: "PvE Group",
        gameplayStyleAoeFarm: "AoE Farming",
        gameplayStyleSingleTargetBoss: "Single Target Boss",
        gameplayStyleSoloPvp: "PvP Solo",
        loadingData: "Loading data...",
        noResults: "No classes match the filters.",
        strengths: "Strengths",
    },
    es: { // Spanish translations remain the same
        mainTitle: "Comparación de Clases de Mimir",
        categoryLabel: "Categoría:",
        allCategories: "Todas las Categorías",
        damageDealers: "Causantes de Daño",
        tanks: "Tanques",
        healers: "Sanadores",
        enchanters: "Encantadores",
        sortLabel: "Ordenar por:",
        overallRating: "General",
        dps: "DPS",
        survival: "Supervivencia",
        utility: "Utilidad",
        mobility: "Movilidad",
        ease: "Facilidad",
        pveRating: "Valoración PvE",
        pvpRating: "Valoración PvP",
        sortAscending: "Ascendente",
        sortDescending: "Descendente",
        showLabel: "Mostrar:",
        allClasses: "Todas las Clases",
        topClasses: "Mejores Clases",
        noClassSelected: "Por favor selecciona una clase",
        errorSelectBothClasses: "Por favor, selecciona ambas clases.",
        comboTitle: "Encontrar Combinación de Clases",
        category1Label: "Primera Clase:",
        category2Label: "Segunda Clase:",
        findComboBtnText: "Encontrar Combinaciones",
        perfectMatch: "Combinación Perfecta",
        goodSynergy: "Buena Sinergia",
        neutralSynergy: "Sinergia Neutral",
        noComboFound: "Sin info de sinergia específica. Verifica compatibilidad.",
        compatibilityTitle: "Compatibilidad de Doble Clase:",
        compatible: "Estas clases son compatibles.",
        incompatible: "Estas clases NO son compatibles.",
        errorSameClassSelected: "Las clases deben ser diferentes.",
        errorSameGroup: "Ambas clases pertenecen al mismo grupo de restricción:",
        errorSpecificComboNotAllowed: "Esta combinación específica no está permitida.",
        alternativeSuggestion: "Prueba una de estas clases en su lugar:",
        colHeaderName: "Clase",
        colHeaderCategory: "Categoría",
        colHeaderDps: "DPS",
        colHeaderSurvival: "Supervivencia",
        colHeaderUtility: "Utilidad",
        colHeaderMobility: "Movilidad",
        colHeaderEase: "Facilidad",
        colHeaderPve: "PvE",
        colHeaderPvp: "PvP",
        colHeaderOverall: "General",
        topCategoryRecommendationsTitle: "Mejores Recomendaciones por Categoría",
        generalNotesTitle: "Notas Generales y Equilibrio",
        dualClassSystemTitle: "Sistema de Doble Clase y Restricciones",
        dualClassDescriptionText: "El sistema de Doble Clase permite jugar con dos clases diferentes. Sin embargo, ten en cuenta que hay restricciones: no puedes elegir dos clases del mismo de los siguientes grupos:",
        specificRestrictionNote: "Adicionalmente, ciertas combinaciones específicas pueden no estar permitidas.",
        tankChangesTitle: "Cambios en Tanques",
        tankChangesText: "La resistencia a arcos para muchas clases de tanques y guerreros ha sido ajustada. Nuevas habilidades y maestrías de armadura revisadas ayudan a definir su rol.",
        healerChangesTitle: "Cambios en Sanadores",
        healerChangesText: "Los sanadores recibieron mejoras, incluyendo reducción de daño aumentada, resurrección mejorada y nuevas habilidades pasivas para reforzar su rol de apoyo.",
        archerChangesTitle: "Cambios en Arqueros",
        archerChangesText: "Las desventajas de los arqueros han sido parcialmente ajustadas. La efectividad ahora depende más del equipo y de los buffs/debuffs de otras clases.",
        modalClassDetailsTitle: "Detalles de Clase",
        modalRatingsTitle: "Valoraciones",
        modalSkillChangesTitle: "Cambios de Habilidad",
        modalNoSkillData: "No hay datos detallados de habilidades disponibles para esta clase.",
        newSkillHighlightText: "NUEVO",
        changedSkillHighlightText: "CAMBIADO",
        damageFocusLabel: "Enfoque de Daño:",
        damageFocusAll: "Todos",
        damageFocusSingleTarget: "Objetivo Único",
        damageFocusAoe: "AOE",
        damageFocusHybrid: "Híbrido",
        damageFocusSupport: "Soporte",
        gameplayStyleLabel: "Recomendación de Estilo de Juego:",
        gameplayStyleAll: "Todos los Estilos",
        gameplayStylePvpCombo: "PvP Grupo",
        gameplayStylePveCombo: "PvE Grupo",
        gameplayStyleAoeFarm: "Farmeo AoE",
        gameplayStyleSingleTargetBoss: "Jefe Objetivo Único",
        gameplayStyleSoloPvp: "PvP Solo",
        loadingData: "Cargando datos...",
        noResults: "Ninguna clase coincide con los filtros.",
        strengths: "Fortalezas",
    }
};
// Synergy data (remains the same)
const synergyData = {
    "Mystic Muse_Titan": {
        de: { title: "Mystic Muse + Titan", description: "Hervorragender magischer Schaden + physische Tankfähigkeit. Starke Balance für viele Inhalte.", strengths: ["Hoher magischer Schaden (MM)", "Starke Tankfähigkeiten und Kontrolle (Titan)", "Gute AoE-Kombination"], synergyLevel: "perfectMatch" },
        en: { title: "Mystic Muse + Titan", description: "Excellent magical damage + physical tanking. Strong balance for many contents.", strengths: ["High magical damage (MM)", "Strong tanking and control (Titan)", "Good AoE combination"], synergyLevel: "perfectMatch" },
        es: { title: "Mystic Muse + Titán", description: "Excelente daño mágico + tanqueo físico. Fuerte equilibrio para muchos contenidos.", strengths: ["Alto daño mágico (MM)", "Fuerte tanqueo y control (Titán)", "Buena combinación AoE"], synergyLevel: "perfectMatch" }
    },
    "Eva's Saint_Phoenix Knight": {
        de: { title: "Eva's Saint + Phoenix Knight", description: "Klassische Kombination für maximale Überlebensfähigkeit und Heilung.", strengths: ["Sehr hohe Gruppen-Überlebensfähigkeit", "Starke Heilung und Buffs (ES)", "Exzellente Verteidigung und Schutz (PK)"], synergyLevel: "perfectMatch" },
        en: { title: "Eva's Saint + Phoenix Knight", description: "Classic combination for maximum survivability and healing.", strengths: ["Very high group survivability", "Strong healing and buffs (ES)", "Excellent defense and protection (PK)"], synergyLevel: "perfectMatch" },
        es: { title: "Eva's Saint + Phoenix Knight", description: "Combinación clásica para máxima supervivencia y curación.", strengths: ["Muy alta supervivencia de grupo", "Fuerte curación y buffs (ES)", "Excelente defensa y protección (PK)"], synergyLevel: "perfectMatch" }
    },
     "Soultaker_Shillien Saint": {
        de: { title: "Soultaker + Shillien Saint", description: "Starker Dunkelmagie-Schaden mit offensiven Heilungs-Synergien.", strengths: ["Hoher magischer Schaden, Debuffs (ST)", "Offensive Buffs, Heilung, Vampiric (SS)", "Gute Selbstheilung durch Kombination"], synergyLevel: "goodSynergy" },
        en: { title: "Soultaker + Shillien Saint", description: "Strong dark magic damage with offensive healing synergies.", strengths: ["High magical damage, debuffs (ST)", "Offensive buffs, healing, vampiric (SS)", "Good self-sustain through combination"], synergyLevel: "goodSynergy" },
        es: { title: "Soultaker + Shillien Saint", description: "Fuerte daño de magia oscura con sinergias de curación ofensiva.", strengths: ["Alto daño mágico, desventajas (ST)", "Buffs ofensivos, curación, vampírico (SS)", "Buen auto-sostenimiento mediante combinación"], synergyLevel: "goodSynergy" }
    }
    // Add more combinations here
};

// Top combos (remains the same)
const topCategoryCombos = {
    de: [
        { categoryTitle: "Beste DD + Tank", class1: "Mystic Muse", class2: "Titan", details: "Hoher magischer Schaden trifft auf robuste Verteidigung und Kontrolle." },
        { categoryTitle: "Beste Tank + Heiler", class1: "Phoenix Knight", class2: "Eva's Saint", details: "Maximale Überlebensfähigkeit für die Gruppe durch Schutz und Heilung." },
        { categoryTitle: "Beste DD + Heiler", class1: "Soultaker", class2: "Shillien Saint", details: "Starker Schaden mit unterstützender Heilung und offensiven Buffs." },
        { categoryTitle: "Beste Support-Kombination", class1: "Hierophant", class2: "Eva's Saint", details: "Umfassende Gruppenbuffs und starke Heilung für jede Situation." }
    ],
    en: [
        { categoryTitle: "Best DD + Tank", class1: "Mystic Muse", class2: "Titan", details: "High magical damage meets robust defense and control." },
        { categoryTitle: "Best Tank + Healer", class1: "Phoenix Knight", class2: "Eva's Saint", details: "Maximum group survivability through protection and healing." },
        { categoryTitle: "Best DD + Healer", class1: "Soultaker", class2: "Shillien Saint", details: "Strong damage with supportive healing and offensive buffs." },
        { categoryTitle: "Best Support Combination", class1: "Hierophant", class2: "Eva's Saint", details: "Comprehensive group buffs and strong healing for any situation." }
    ],
    es: [
        { categoryTitle: "Mejor DD + Tanque", class1: "Mystic Muse", class2: "Titán", details: "Alto daño mágico se encuentra con defensa robusta y control." },
        { categoryTitle: "Mejor Tanque + Sanador", class1: "Phoenix Knight", class2: "Eva's Saint", details: "Máxima supervivencia de grupo mediante protección y curación." },
        { categoryTitle: "Mejor DD + Sanador", class1: "Soultaker", class2: "Shillien Saint", details: "Fuerte daño con curación de apoyo y buffs ofensivos." },
        { categoryTitle: "Mejor Combinación de Soporte", class1: "Hierophant", class2: "Eva's Saint", details: "Buffs de grupo completos y fuerte curación para cualquier situación." }
    ]
};


// --- State Variables ---
let currentLanguage = 'de';
let currentSortBy = 'overall';
let sortAscending = false;
let currentDamageFocusFilter = 'all';
let currentGameplayStyleFilter = 'all';
let isDataLoaded = false; // Flag to track if data loading is complete

// --- DOM Elements (cached) ---
let mainTitleEl, categoryLabelEl, sortLabelEl, sortOrderBtnEl, sortOrderBtnTextEl, sortArrowIconEl, showLabelEl, damageFocusLabelEl, gameplayStyleLabelEl;
let categoryFilterEl, damageFocusFilterEl, gameplayStyleFilterEl, sortBySelectEl, showTopSelectEl;
let languageBtnEls;
let tableBodyEl, tableHeaderNameEl, tableHeaderCategoryEl, tableHeaderDpsEl, tableHeaderSurvivalEl, tableHeaderUtilityEl, tableHeaderMobilityEl, tableHeaderEaseEl, tableHeaderPveEl, tableHeaderPvpEl, tableHeaderOverallEl;
let comboTitleEl, category1LabelEl, category2LabelEl, findComboBtnTextEl, category1SelectEl, category2SelectEl, class1SelectEl, class2SelectEl, findComboBtnEl;
let compatibilityInfoContainerEl, compatibilityTitleDisplayEl, compatibilityMessageDisplayEl, alternativeSuggestionsEl, comboResultsDisplayEl;
let topCategoryRecommendationsTitleEl, topCategoryRecommendationsContentEl;
let generalNotesTitleEl, dualClassSystemTitleEl, dualClassDescriptionTextEl, restrictionGroupsListEl, specificRestrictionNoteEl;
let tankChangesTitleEl, tankChangesTextEl, healerChangesTitleEl, healerChangesTextEl, archerChangesTitleEl, archerChangesTextEl;
let classDetailModalEl, modalCloseButtonEl, modalClassNameEl, modalClassCategoryEl, modalClassRatingsEl, modalSkillChangesListEl, modalNoSkillDataPEl, modalRatingsTitleEl, modalSkillChangesTitleEl;


// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed");
    cacheDOMElements();
    showLoadingIndicator(true); // Show loading indicator

    try {
        // 1. Load Combined Class Data
        await loadCombinedClassData(); // Use the new loading function
        console.log(`Combined class data loaded. classData length: ${classData.length}, detailedSkillChanges keys: ${Object.keys(detailedSkillChanges).length}`);

        // 2. Calculate Ratings (only after data is loaded)
        if (classData.length > 0) {
            calculateDerivedRatings();
            console.log("Derived ratings calculated.");
        } else {
            console.warn("Skipping rating calculation because classData is empty after loading.");
        }

        isDataLoaded = true; // Set flag

        // 3. Populate UI
        populateFilterDropdowns();
        initializeEventListeners();
        setLanguage(currentLanguage); // This will trigger initial render
        updateClassSelects();
        updateCompatibilityInfo();

    } catch (error) {
        console.error("Error during initialization:", error);
        isDataLoaded = false;
        // Display a user-friendly error message on the page
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `<p class="text-red-500 text-center font-bold">Fehler beim Laden der Daten. Bitte prüfen Sie die Konsole und stellen Sie sicher, dass der lokale Server läuft und die JSON-Datei verfügbar ist.</p>`;
        }
    } finally {
        showLoadingIndicator(false); // Hide loading indicator
    }
});


function showLoadingIndicator(show) {
    let indicator = document.getElementById('loading-indicator');
    if (show) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'loading-indicator';
            indicator.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-[1000]';
            indicator.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-xl text-center">
                    <svg class="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-lg font-semibold text-dark">Lade Daten...</p>
                </div>`;
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'flex';
    } else {
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
}


function cacheDOMElements() {
    // Main page elements
    mainTitleEl = document.getElementById('main-title');
    categoryLabelEl = document.getElementById('category-label');
    sortLabelEl = document.getElementById('sort-label');
    sortOrderBtnEl = document.getElementById('sort-order-btn');
    sortOrderBtnTextEl = document.getElementById('sort-order-btn-text');
    sortArrowIconEl = document.getElementById('sort-arrow-icon');
    showLabelEl = document.getElementById('show-label');
    damageFocusLabelEl = document.getElementById('damage-focus-label');
    gameplayStyleLabelEl = document.getElementById('gameplay-style-label');

    // Filters
    categoryFilterEl = document.getElementById('category-filter');
    damageFocusFilterEl = document.getElementById('damage-focus-filter');
    gameplayStyleFilterEl = document.getElementById('gameplay-style-filter');
    sortBySelectEl = document.getElementById('sort-by');
    showTopSelectEl = document.getElementById('show-top');

    // Language buttons
    languageBtnEls = document.querySelectorAll('.language-btn');

    // Table
    tableBodyEl = document.getElementById('class-table')?.querySelector('tbody');
    tableHeaderNameEl = document.getElementById('col-header-name');
    tableHeaderCategoryEl = document.getElementById('col-header-category');
    tableHeaderDpsEl = document.getElementById('col-header-dps');
    tableHeaderSurvivalEl = document.getElementById('col-header-survival');
    tableHeaderUtilityEl = document.getElementById('col-header-utility');
    tableHeaderMobilityEl = document.getElementById('col-header-mobility');
    tableHeaderEaseEl = document.getElementById('col-header-ease');
    tableHeaderPveEl = document.getElementById('col-header-pve');
    tableHeaderPvpEl = document.getElementById('col-header-pvp');
    tableHeaderOverallEl = document.getElementById('col-header-overall');

    // Combo selector
    comboTitleEl = document.getElementById('combo-title');
    category1LabelEl = document.getElementById('category1-label');
    category2LabelEl = document.getElementById('category2-label');
    findComboBtnTextEl = document.getElementById('find-combo-btn-text');
    category1SelectEl = document.getElementById('category1');
    category2SelectEl = document.getElementById('category2');
    class1SelectEl = document.getElementById('class1');
    class2SelectEl = document.getElementById('class2');
    findComboBtnEl = document.getElementById('find-combo-btn');
    compatibilityInfoContainerEl = document.getElementById('compatibility-info-container');
    compatibilityTitleDisplayEl = document.getElementById('compatibility-title-display');
    compatibilityMessageDisplayEl = document.getElementById('compatibility-message-display');
    alternativeSuggestionsEl = document.getElementById('alternative-suggestions');
    comboResultsDisplayEl = document.getElementById('combo-results-display');

    // Recommendations and Notes
    topCategoryRecommendationsTitleEl = document.getElementById('top-category-recommendations-title');
    topCategoryRecommendationsContentEl = document.getElementById('top-category-recommendations-content');
    generalNotesTitleEl = document.getElementById('general-notes-title');
    dualClassSystemTitleEl = document.getElementById('dual-class-system-title');
    dualClassDescriptionTextEl = document.getElementById('dual-class-description-text');
    restrictionGroupsListEl = document.getElementById('restriction-groups-list');
    specificRestrictionNoteEl = document.getElementById('specific-restriction-note');
    tankChangesTitleEl = document.getElementById('tank-changes-title');
    tankChangesTextEl = document.getElementById('tank-changes-text');
    healerChangesTitleEl = document.getElementById('healer-changes-title');
    healerChangesTextEl = document.getElementById('healer-changes-text');
    archerChangesTitleEl = document.getElementById('archer-changes-title');
    archerChangesTextEl = document.getElementById('archer-changes-text');

    // Modal
    classDetailModalEl = document.getElementById('class-detail-modal');
    modalCloseButtonEl = document.getElementById('modal-close-button');
    modalClassNameEl = document.getElementById('modal-class-name');
    modalClassCategoryEl = document.getElementById('modal-class-category');
    modalClassRatingsEl = document.getElementById('modal-class-ratings');
    modalSkillChangesListEl = document.getElementById('modal-skill-changes-list');
    modalNoSkillDataPEl = document.getElementById('modal-no-skill-data');
    modalRatingsTitleEl = document.getElementById('modal-ratings-title');
    modalSkillChangesTitleEl = document.getElementById('modal-skill-changes-title');
    console.log("DOM elements cached.");
}

function initializeEventListeners() {
    languageBtnEls.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!isDataLoaded) return; // Prevent actions if data isn't loaded
            const lang = this.getAttribute('data-lang');
            languageBtnEls.forEach(b => b.classList.remove('active', 'bg-primary', 'text-white'));
            languageBtnEls.forEach(b => b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300'));
            this.classList.add('active', 'bg-primary', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            setLanguage(lang);
        });
    });

    categoryFilterEl.addEventListener('change', renderTable);
    damageFocusFilterEl.addEventListener('change', function() {
        currentDamageFocusFilter = this.value;
        renderTable();
    });
    gameplayStyleFilterEl.addEventListener('change', function() {
        currentGameplayStyleFilter = this.value;
        renderTable();
    });
    sortBySelectEl.addEventListener('change', function() {
        currentSortBy = this.value;
        renderTable();
    });
    sortOrderBtnEl.addEventListener('click', function() {
        if (!isDataLoaded) return;
        sortAscending = !sortAscending;
        updateSortArrowIcon();
        setLanguage(currentLanguage); // Re-translate button text
        renderTable();
    });
    showTopSelectEl.addEventListener('change', renderTable);

    document.querySelectorAll('#class-table thead th').forEach(header => {
        header.addEventListener('click', function() {
            if (!isDataLoaded) return;
            const sortBy = this.getAttribute('data-sort');
            if (!sortBy) return;
            if (currentSortBy === sortBy) {
                sortAscending = !sortAscending;
            } else {
                currentSortBy = sortBy;
                sortAscending = false;
            }
            sortBySelectEl.value = currentSortBy;
            updateSortArrowIcon();
            setLanguage(currentLanguage); // Re-translate button text
            renderTable();
        });
    });

    category1SelectEl.addEventListener('change', updateClassSelects);
    category2SelectEl.addEventListener('change', updateClassSelects);
    class1SelectEl.addEventListener('change', updateCompatibilityInfo);
    class2SelectEl.addEventListener('change', updateCompatibilityInfo);
    findComboBtnEl.addEventListener('click', displayCombinationSynergy);

    modalCloseButtonEl.addEventListener('click', closeClassDetailModal);
    window.addEventListener('click', function(event) {
        if (event.target === classDetailModalEl) {
            closeClassDetailModal();
        }
    });
    console.log("Event listeners initialized.");
}


// --- Data Loading and Processing ---
async function loadJsonData(filePath) {
    try {
        // Prepend 'data/' to the path assuming JSON files are in a 'data' subdirectory
        const adjustedFilePath = `data/${filePath}`;
        // console.log(`Attempting to fetch: ${adjustedFilePath}`); // Log the path being fetched
        const response = await fetch(adjustedFilePath);
        if (!response.ok) {
            // Log specific error for debugging
            console.error(`Failed to fetch ${adjustedFilePath}: ${response.status} ${response.statusText}`);
            // Try to get more details if it's a CORS issue (though this shouldn't happen with a local server)
            if (response.status === 0) {
                 console.error(`Network error or CORS issue likely for ${adjustedFilePath}. Ensure the server is running and accessible.`);
            }
            throw new Error(`HTTP error! status: ${response.status} for ${adjustedFilePath}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading or parsing JSON from ${filePath}:`, error);
        return null; // Return null to indicate failure
    }
}

// Function to map L2 attribute names to numerical values
function mapAttributeToValue(attributeValue) {
    const mapping = {
        "very low": 2,
        "low": 4,
        "medium": 6,
        "high": 8,
        "very high": 10
    };
    // Return the mapped value or a default (e.g., 5) if the value is not recognized
    return mapping[attributeValue?.toLowerCase()] || 5;
}

// Helper function to map JSON category keys to display names
function getCategoryDisplayName(key) {
    const mapping = {
        "damage_dealers": "Damage Dealers",
        "tanks": "Tanks",
        "healers": "Healers",
        "enchanters": "Enchanters"
        // Add more if needed
    };
    // Normalize key before mapping
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '');
    return mapping[normalizedKey] || key; // Return mapped name or the key itself
}


// Loads and processes the combined classdata.json
async function loadCombinedClassData() {
    const jsonData = await loadJsonData('classdata.json');
    if (!jsonData || !jsonData.classes) {
        console.error("Failed to load or parse classdata.json, or 'classes' property missing.");
        isDataLoaded = false;
        return;
    }

    classData = [];
    detailedSkillChanges = {};
    for (const cat in classesByCategory) { classesByCategory[cat] = []; }

    // Iterate through main categories
    for (const categoryKey in jsonData.classes) {
        const categoryData = jsonData.classes[categoryKey];
        const categoryName = getCategoryDisplayName(categoryKey);

        if (!classesByCategory[categoryName]) {
            classesByCategory[categoryName] = [];
            console.warn(`Created new category in classesByCategory: ${categoryName}`);
        }

        // Prüfen ob Unterkategorien existieren
        let hasSubcategories = false;
        for (const key in categoryData) {
            if (categoryData[key] && typeof categoryData[key] === 'object' && 
                !categoryData[key].general_info && !categoryData[key].skill_changes) {
                hasSubcategories = true;
                break;
            }
        }

        if (hasSubcategories) {
            // Verarbeitung mit Unterkategorien (3-stufig für Damage Dealers)
            for (const subCategoryKey in categoryData) {
                const subCategoryData = categoryData[subCategoryKey];
                for (const classKey in subCategoryData) {
                    processClassEntry(subCategoryData[classKey], categoryName, classKey);
                }
            }
        } else {
            // Verarbeitung ohne Unterkategorien (2-stufig für Tanks, Healers, Enchanters)
            for (const classKey in categoryData) {
                processClassEntry(categoryData[classKey], categoryName, classKey);
            }
        }
    }
    
    console.log("Finished processing combined class data.");
    
    // Hilfsfunktion zur Verarbeitung einer Klasse
    function processClassEntry(classEntry, categoryName, classKey) {
        if (classEntry.general_info && classEntry.general_info.name) {
            const className = classEntry.general_info.name;
            
            // Prüfen auf Duplikate
            if (classData.some(cd => cd.name === className)) {
                return;
            }
            
            // Basiswerte berechnen
            let baseDps = 5, baseSurvival = 5, baseUtility = 5, baseMobility = 5, baseEase = 7;
            if (classEntry.general_info.attributes) {
                const str = mapAttributeToValue(classEntry.general_info.attributes.STR);
                const int_ = mapAttributeToValue(classEntry.general_info.attributes.INT);
                const con = mapAttributeToValue(classEntry.general_info.attributes.CON);
                const men = mapAttributeToValue(classEntry.general_info.attributes.MEN);
                const dex = mapAttributeToValue(classEntry.general_info.attributes.DEX);
                const wit = mapAttributeToValue(classEntry.general_info.attributes.WIT);
                
                // Kategoriebasierte Berechnung
                if (categoryName === "Damage Dealers") {
                    baseDps = (str + int_) / 1.8;
                    baseSurvival = con * 0.8;
                    baseMobility = dex;
                    baseUtility = (men + wit) / 2.5;
                    baseEase = 7.0;
                } else if (categoryName === "Tanks") {
                    baseDps = str / 2.5;
                    baseSurvival = con * 1.2;
                    baseMobility = dex * 0.7;
                    baseUtility = men;
                    baseEase = 7.5;
                } else if (categoryName === "Healers") {
                    baseDps = int_ / 3;
                    baseSurvival = con * 0.9;
                    baseMobility = dex * 0.8;
                    baseUtility = (men + wit) / 1.8;
                    baseEase = 6.5;
                } else if (categoryName === "Enchanters") {
                    baseDps = (str + int_) / 2.8;
                    baseSurvival = con * 0.8;
                    baseMobility = dex * 0.9;
                    baseUtility = (men + wit) / 1.5;
                    baseEase = 6.5;
                }
            }
            
            // Werte auf den Bereich 1-10 begrenzen
            baseDps = Math.min(10, Math.max(1, baseDps));
            baseSurvival = Math.min(10, Math.max(1, baseSurvival));
            baseUtility = Math.min(10, Math.max(1, baseUtility));
            baseMobility = Math.min(10, Math.max(1, baseMobility));
            baseEase = Math.min(10, Math.max(1, baseEase));
            
            // Zu classData hinzufügen
            classData.push({
                name: className,
                category: categoryName,
                dps: baseDps,
                survival: baseSurvival,
                utility: baseUtility,
                mobility: baseMobility,
                ease: baseEase,
                isTop: false
            });
            
            // Zu classesByCategory hinzufügen
            if (!classesByCategory[categoryName].includes(className)) {
                classesByCategory[categoryName].push(className);
            }
            
            // Skill-Änderungen verarbeiten
            if (classEntry.skill_changes && Array.isArray(classEntry.skill_changes)) {
                detailedSkillChanges[className] = { skillChanges: classEntry.skill_changes };
            }
        } else {
            console.warn(`Skipping entry under ${categoryName} -> ${classKey} due to missing general_info or name.`);
        }
    }
}

function calculateDerivedRatings() {
    if (!classData || classData.length === 0) {
        console.warn("calculateDerivedRatings called with no classData.");
        return;
    }
     console.log("Starting calculateDerivedRatings for", classData.length, "classes.");

    classData.forEach(cls => {
        // Use the base values loaded from JSONs or the defaults set during loading
        const baseDps = cls.dps || 5;
        const baseSurvival = cls.survival || 5;
        const baseUtility = cls.utility || 5;
        const baseMobility = cls.mobility || 5;
        const baseEase = cls.ease || 7;

        // Log the base values being used for calculation
        // console.log(`[Base Stat Debug] ${cls.name} - Base(D/S/U/M/E): ${baseDps.toFixed(1)}/${baseSurvival.toFixed(1)}/${baseUtility.toFixed(1)}/${baseMobility.toFixed(1)}/${baseEase.toFixed(1)}`);


        const skills = detailedSkillChanges[cls.name] ? detailedSkillChanges[cls.name].skillChanges : [];
        // Add log to see if skills are being found for specific classes
        if (skills.length > 0) {
             // console.log(`[Rating Calc Debug] Calculating ratings for ${cls.name} with ${skills.length} skill changes.`);
        }


        // Initialize scores with base values * initial weights
        let pveScore = baseDps * 0.35 + baseSurvival * 0.15 + baseUtility * 0.20 + baseMobility * 0.05 + baseEase * 0.10;
        let pvpScore = baseDps * 0.25 + baseSurvival * 0.25 + baseUtility * 0.15 + baseMobility * 0.20 + baseEase * 0.15;

        let aoeSkillFactor = 0;
        let singleTargetSkillFactor = 0;
        let controlSkillFactor = 0;
        let buffDebuffFactor = 0;
        let survivalSkillFactor = 0;
        let mobilitySkillFactor = 0;
        let dpsSkillFactor = 0;

        skills.forEach(skill => {
            const changesText = skill.changes.join(' ').toLowerCase();
            const skillNameLower = skill.name.toLowerCase();
            const skillTypeLower = skill.type.toLowerCase();
            let isNew = skillTypeLower.includes('new');
            let isBuff = changesText.includes('→ +') || changesText.includes('increased') || skillTypeLower.includes('buff');
            let isNerf = changesText.includes('→ -') || changesText.includes('decreased') || skillTypeLower.includes('debuff') || skillTypeLower.includes('removed'); // Consider 'removed' a nerf in context

            // --- Refined Factor Calculation ---

            // DPS Factor
            if (changesText.includes('p.atk') || changesText.includes('m.atk') || changesText.includes('skill power') || changesText.includes('critical damage') || changesText.includes('power') || changesText.includes('attack speed') || changesText.includes('casting speed')) {
                dpsSkillFactor += isNew ? 0.3 : (isBuff ? 0.2 : (isNerf ? -0.15 : 0));
            }
             if (changesText.includes('attacks twice') || changesText.includes('additional hit')) {
                 dpsSkillFactor += 0.25;
             }


            // Damage Focus (AoE/Single)
            const isAoE = changesText.includes('aoe') || changesText.includes('targets') || changesText.includes('nearby enemies') || skillNameLower.includes('explosion') || skillNameLower.includes('vortex') || skillNameLower.includes('rain') || skillNameLower.includes('sweep') || skillNameLower.includes('storm') || skillNameLower.includes('field');
            const isSingle = skillNameLower.includes('strike') || skillNameLower.includes('shot') || skillNameLower.includes('blow') || skillNameLower.includes('spike') || skillNameLower.includes('beam') || (changesText.includes('attacks twice') && !isAoE);
            if (isAoE) aoeSkillFactor += isNew ? 0.3 : 0.2;
            if (isSingle) singleTargetSkillFactor += isNew ? 0.3 : 0.2;


            // Control Factor
            if (changesText.includes('stun') || changesText.includes('sleep') || changesText.includes('paralysis') || changesText.includes('fear') || changesText.includes('hold') || changesText.includes('silence') || changesText.includes('knockback') || changesText.includes('pull') || changesText.includes('root') || changesText.includes('disarm')) {
                controlSkillFactor += isNew ? 0.25 : (isNerf ? -0.1 : 0.15); // Nerfed control is bad
            }

            // Buff/Debuff Factor (Utility) - Focus on party buffs or significant enemy debuffs
             if (skillTypeLower.includes('buff') || skillTypeLower.includes('debuff') || changesText.includes('resistance') || changesText.includes('vulnerability') || skillNameLower.includes('aura') || skillNameLower.includes('chant') || skillNameLower.includes('song') || skillNameLower.includes('dance')) {
                 // Stronger impact for party-wide effects or significant debuffs
                 let impact = (changesText.includes('party') || changesText.includes('clan') || changesText.includes('alliance') || changesText.includes('resistance -') || changesText.includes('vulnerability +')) ? 0.25 : 0.15;
                 buffDebuffFactor += isNew ? impact * 1.2 : (isNerf ? -impact * 0.8 : impact);
             }
             if (skillNameLower.includes('cleanse') || skillNameLower.includes('purify')) buffDebuffFactor += 0.25; // High value


            // Survival Factor
            if (changesText.includes('hp') || changesText.includes('p.def') || changesText.includes('m.def') || changesText.includes('received damage') || changesText.includes('shield') || changesText.includes('heal') || changesText.includes('evasion') || changesText.includes('block') || skillNameLower.includes('barrier')) {
                 survivalSkillFactor += isNew ? 0.3 : (isBuff ? 0.2 : (isNerf ? -0.15 : 0));
             }
             if (skillNameLower.includes('resurrection')) survivalSkillFactor += 0.35; // Very high value


            // Mobility Factor
            if (changesText.includes('speed') || changesText.includes('teleport') || skillNameLower.includes('rush') || skillNameLower.includes('dash') || skillNameLower.includes('blink') || skillNameLower.includes('step')) {
                mobilitySkillFactor += isNew ? 0.25 : 0.15;
            }
        });

        // Determine Damage Focus (Assign based on factors)
        if (cls.category === "Healers" || cls.category === "Enchanters") {
            cls.damageFocus = "support";
        } else if (aoeSkillFactor > singleTargetSkillFactor && aoeSkillFactor > 0.2) { // Threshold to be considered AoE focused
            cls.damageFocus = "aoe";
        } else if (singleTargetSkillFactor > aoeSkillFactor && singleTargetSkillFactor > 0.2) { // Threshold for Single Target
            cls.damageFocus = "singleTarget";
        } else if (aoeSkillFactor > 0.1 && singleTargetSkillFactor > 0.1) { // If both have some presence
            cls.damageFocus = "hybrid";
        } else { // Default for DDs if no clear indication from skills
            cls.damageFocus = "hybrid";
        }


        // Apply factors to scores (Adjust weights here)
        pveScore += dpsSkillFactor * 1.8 + aoeSkillFactor * 1.5 + survivalSkillFactor * 0.6 + buffDebuffFactor * 0.4; // PvE: DPS and AoE are key
        pvpScore += dpsSkillFactor * 1.2 + singleTargetSkillFactor * 1.0 + controlSkillFactor * 1.8 + survivalSkillFactor * 1.5 + mobilitySkillFactor * 1.2 + buffDebuffFactor * 1.0; // PvP: Control, Survival, Mobility more important

        // Category specific adjustments
        if (cls.category === "Tanks") {
            pvpScore += survivalSkillFactor * 0.6 + controlSkillFactor * 0.4;
            pveScore += survivalSkillFactor * 0.4;
        } else if (cls.category === "Healers") {
            pvpScore += survivalSkillFactor * 0.5 + buffDebuffFactor * 0.8; // Utility/Survival crucial
            pveScore += survivalSkillFactor * 0.7 + buffDebuffFactor * 0.5;
        } else if (cls.category === "Enchanters") {
            pvpScore += buffDebuffFactor * 1.0 + controlSkillFactor * 0.4; // Buffs/Debuffs are prime role
            pveScore += buffDebuffFactor * 1.0;
        }


        // Normalize scores: Adjust divisor based on expected max raw score range
        // This requires tuning. Let's try slightly higher divisors.
        const pveDivisor = 2.8;
        const pvpDivisor = 3.0;
        cls.pveRating = Math.min(10, Math.max(1, pveScore / pveDivisor)).toFixed(1);
        cls.pvpRating = Math.min(10, Math.max(1, pvpScore / pvpDivisor)).toFixed(1);


        // Recalculate overall rating
        // Give slightly more weight to the calculated PvE/PvP scores
        cls.overall = parseFloat(
            (baseDps * 0.8) +
            (baseSurvival * 0.9) +
            (baseUtility * 0.9) +
            (baseMobility * 0.7) +
            (baseEase * 0.6) +
            (parseFloat(cls.pveRating) * 1.4) +
            (parseFloat(cls.pvpRating) * 1.4)
        ) / 6.7; // Adjusted divisor (sum of weights: 0.8+0.9+0.9+0.7+0.6+1.4+1.4 = 6.7)
        cls.overall = Math.min(10, Math.max(1, cls.overall)).toFixed(1);

        // Final Log for this class after calculation
        // console.log(`[Rating Calc Debug - Final] ${cls.name} - Scores(PvE/PvP/Overall): ${cls.pveRating}/${cls.pvpRating}/${cls.overall} | Focus: ${cls.damageFocus}`);


    });
     console.log("Finished calculateDerivedRatings.");
}


// --- UI Rendering and Updates ---
function populateFilterDropdowns() {
    if (!isDataLoaded && classData.length === 0) {
        console.warn("Attempted to populate dropdowns before data was loaded.");
        // Maybe disable dropdowns or show a message
        return;
    }
    const trans = translations[currentLanguage];

    // Category Filter
    // Use the dynamically populated classesByCategory keys
    const categories = ["all", ...Object.keys(classesByCategory).filter(cat => classesByCategory[cat] && classesByCategory[cat].length > 0)]; // Filter out empty categories
    populateDropdown(categoryFilterEl, categories, (val) => val === "all" ? trans.allCategories : (trans[val.toLowerCase().replace(/\s+/g, '')] || val), "category-filter");

    // Damage Focus Filter
    const damageFocusOptions = ["all", "singleTarget", "aoe", "hybrid", "support"];
    populateDropdown(damageFocusFilterEl, damageFocusOptions, (val) => trans["damageFocus" + val.charAt(0).toUpperCase() + val.slice(1)] || trans.damageFocusAll, "damage-focus-filter");
    damageFocusFilterEl.value = currentDamageFocusFilter;


    // Gameplay Style Filter
    const gameplayStyleOptions = ["all", "pvpCombo", "pveCombo", "aoeFarm", "singleTargetBoss", "soloPvp"];
    populateDropdown(gameplayStyleFilterEl, gameplayStyleOptions, (val) => trans["gameplayStyle" + val.charAt(0).toUpperCase() + val.slice(1)] || trans.gameplayStyleAll, "gameplay-style-filter");
    gameplayStyleFilterEl.value = currentGameplayStyleFilter;


    // Sort By Filter
    const sortOptions = ["overall", "dps", "survival", "utility", "mobility", "ease", "pveRating", "pvpRating", "name", "category"];
    populateDropdown(sortBySelectEl, sortOptions, (val) => trans[val] || val.charAt(0).toUpperCase() + val.slice(1), "sort-by");
    sortBySelectEl.value = currentSortBy;

    // Show Top Filter
    const showOptions = ["all", "top"];
    populateDropdown(showTopSelectEl, showOptions, (val) => val === "all" ? trans.allClasses : trans.topClasses, "show-top");

    // Combo Box Categories
    populateDropdown(category1SelectEl, Object.keys(classesByCategory).filter(cat => classesByCategory[cat] && classesByCategory[cat].length > 0), (val) => trans[val.toLowerCase().replace(/\s+/g, '')] || val, "category1");
    populateDropdown(category2SelectEl, Object.keys(classesByCategory).filter(cat => classesByCategory[cat] && classesByCategory[cat].length > 0), (val) => trans[val.toLowerCase().replace(/\s+/g, '')] || val, "category2");

    // Set default for combo boxes if not already set by user
    const validCategories = Object.keys(classesByCategory).filter(cat => classesByCategory[cat] && classesByCategory[cat].length > 0);
    if (validCategories.length > 0) {
        if (!category1SelectEl.value) category1SelectEl.value = validCategories[0];
        if (!category2SelectEl.value) category2SelectEl.value = validCategories[1] || validCategories[0];
    }


    console.log("Filter dropdowns populated.");
}

function populateDropdown(selectElement, optionsArray, translationFn, baseId) {
    if (!selectElement) {
        console.warn(`Select element with baseId "${baseId}" not found for populating dropdown.`);
        return;
    }
    const currentValue = selectElement.value; // Preserve current selection if possible
    selectElement.innerHTML = '';
    optionsArray.forEach(optValue => {
        const option = document.createElement('option');
        option.value = optValue;
        option.textContent = translationFn(optValue);
        option.id = `${baseId}-${optValue.toLowerCase().replace(/\s+/g, '').replace(/[^\w-]/g, '')}-option`; // Sanitize ID
        selectElement.appendChild(option);
    });
    if (optionsArray.includes(currentValue)) { // Restore selection
        selectElement.value = currentValue;
    } else if (optionsArray.length > 0) {
        // If previous value isn't valid, select the first option (usually 'all')
        selectElement.selectedIndex = 0;
    }
}


function updateClassSelects() {
    if (!isDataLoaded) return;
    const trans = translations[currentLanguage];
    populateClassDropdown(category1SelectEl.value, class1SelectEl, trans.noClassSelected);
    populateClassDropdown(category2SelectEl.value, class2SelectEl, trans.noClassSelected);
    updateCompatibilityInfo();
}

function populateClassDropdown(categoryName, classDropdown, defaultText) {
    if (!classDropdown) return;
    const currentSelection = classDropdown.value;
    classDropdown.innerHTML = '';

    let firstOption = document.createElement('option');
    firstOption.value = '';
    firstOption.textContent = defaultText;
    firstOption.disabled = true;
    classDropdown.appendChild(firstOption);

    const classList = classesByCategory[categoryName] || [];
    classList.sort().forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classDropdown.appendChild(option);
    });

    if (classList.includes(currentSelection)) {
        classDropdown.value = currentSelection;
    } else {
         classDropdown.selectedIndex = 0; // Fallback to "Please select"
    }
}


function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    const trans = translations[lang];
    if (!trans) {
        console.error("Translations not found for language:", lang);
        return;
    }
    trans.languageCodeForSynergy = lang;

    // Update UI text only if elements exist
    if (mainTitleEl) mainTitleEl.textContent = trans.mainTitle;
    if (categoryLabelEl) categoryLabelEl.textContent = trans.categoryLabel;
    if (sortLabelEl) sortLabelEl.textContent = trans.sortLabel;
    if (sortOrderBtnTextEl) sortOrderBtnTextEl.textContent = trans[sortAscending ? 'sortAscending' : 'sortDescending'];
    if (showLabelEl) showLabelEl.textContent = trans.showLabel;
    if (damageFocusLabelEl) damageFocusLabelEl.textContent = trans.damageFocusLabel;
    if (gameplayStyleLabelEl) gameplayStyleLabelEl.textContent = trans.gameplayStyleLabel;

    if (comboTitleEl) comboTitleEl.textContent = trans.comboTitle;
    if (category1LabelEl) category1LabelEl.textContent = trans.category1Label;
    if (category2LabelEl) category2LabelEl.textContent = trans.category2Label;
    if (findComboBtnTextEl) findComboBtnTextEl.textContent = trans.findComboBtnText;

    if (tableHeaderNameEl) tableHeaderNameEl.textContent = trans.colHeaderName;
    if (tableHeaderCategoryEl) tableHeaderCategoryEl.textContent = trans.colHeaderCategory;
    if (tableHeaderDpsEl) tableHeaderDpsEl.textContent = trans.colHeaderDps;
    if (tableHeaderSurvivalEl) tableHeaderSurvivalEl.textContent = trans.colHeaderSurvival;
    if (tableHeaderUtilityEl) tableHeaderUtilityEl.textContent = trans.colHeaderUtility;
    if (tableHeaderMobilityEl) tableHeaderMobilityEl.textContent = trans.colHeaderMobility;
    if (tableHeaderEaseEl) tableHeaderEaseEl.textContent = trans.colHeaderEase;
    if (tableHeaderPveEl) tableHeaderPveEl.textContent = trans.pveRating;
    if (tableHeaderPvpEl) tableHeaderPvpEl.textContent = trans.pvpRating;
    if (tableHeaderOverallEl) tableHeaderOverallEl.textContent = trans.colHeaderOverall;

    if (topCategoryRecommendationsTitleEl) topCategoryRecommendationsTitleEl.textContent = trans.topCategoryRecommendationsTitle;
    if (generalNotesTitleEl) generalNotesTitleEl.textContent = trans.generalNotesTitle;
    if (dualClassSystemTitleEl) dualClassSystemTitleEl.textContent = trans.dualClassSystemTitle;
    if (dualClassDescriptionTextEl) dualClassDescriptionTextEl.textContent = trans.dualClassDescriptionText;
    if (specificRestrictionNoteEl) specificRestrictionNoteEl.textContent = trans.specificRestrictionNote;
    if (tankChangesTitleEl) tankChangesTitleEl.textContent = trans.tankChangesTitle;
    if (tankChangesTextEl) tankChangesTextEl.textContent = trans.tankChangesText;
    if (healerChangesTitleEl) healerChangesTitleEl.textContent = trans.healerChangesTitle;
    if (healerChangesTextEl) healerChangesTextEl.textContent = trans.healerChangesText;
    if (archerChangesTitleEl) archerChangesTitleEl.textContent = trans.archerChangesTitle;
    if (archerChangesTextEl) archerChangesTextEl.textContent = trans.archerChangesText;

    if (modalRatingsTitleEl) modalRatingsTitleEl.textContent = trans.modalRatingsTitle;
    if (modalSkillChangesTitleEl) modalSkillChangesTitleEl.textContent = trans.modalSkillChangesTitle;

    // Repopulate dropdowns with new translations if data is loaded
    if (isDataLoaded) {
        populateFilterDropdowns();
        renderTopCategoryRecommendations();
        renderRestrictionGroupsList();
        renderTable();
        updateClassSelects(); // This will repopulate class dropdowns with translated "Please select"
        updateCompatibilityInfo();
        if (comboResultsDisplayEl && comboResultsDisplayEl.style.display === 'block') {
            displayCombinationSynergy(); // Re-render combo results with new language
        }
    }
    console.log(`Language set to ${lang}.`);
}

function renderTable() {
    if (!tableBodyEl || !isDataLoaded) {
        console.warn("Table body not available or data not loaded for rendering.");
        if (tableBodyEl) tableBodyEl.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-gray-500">${translations[currentLanguage].loadingData || 'Lade Daten...'}</td></tr>`;
        return;
    }
    const trans = translations[currentLanguage];
    tableBodyEl.innerHTML = '';
    let displayData = [...classData];

    // Apply Category Filter
    if (categoryFilterEl.value !== 'all') {
        displayData = displayData.filter(cls => cls.category === categoryFilterEl.value);
    }

    // Apply Damage Focus Filter
    if (currentDamageFocusFilter !== 'all') {
        displayData = displayData.filter(cls => cls.damageFocus === currentDamageFocusFilter);
    }

    // Apply Gameplay Style Filter
    if (currentGameplayStyleFilter !== 'all') {
        displayData = displayData.filter(cls => {
            // Ensure ratings are numbers for comparison
            const pvpRating = parseFloat(cls.pvpRating);
            const pveRating = parseFloat(cls.pveRating);
            const utility = parseFloat(cls.utility);
            const mobility = parseFloat(cls.mobility);
            const survival = parseFloat(cls.survival);
            const dps = parseFloat(cls.dps);

            switch (currentGameplayStyleFilter) {
                case 'pvpCombo': return pvpRating >= 7.5 && (utility >= 7 || mobility >= 7 || survival >= 7.5);
                case 'pveCombo': return pveRating >= 7.5 && (dps >= 7.5 || cls.damageFocus === 'aoe' || cls.damageFocus === 'hybrid');
                case 'aoeFarm': return cls.damageFocus === 'aoe' && pveRating >= 7 && dps >= 7;
                case 'singleTargetBoss': return cls.damageFocus === 'singleTarget' && pveRating >= 7 && dps >= 7.5;
                case 'soloPvp': return pvpRating >= 7.0 && survival >= 6.5 && mobility >= 6.5;
                default: return true;
            }
        });
    }


    // Apply Show Top Filter
    if (showTopSelectEl.value === 'top') {
        // Define "top" dynamically, e.g., overall rating >= 8.0 or based on a flag
        displayData = displayData.filter(cls => cls.isTop || parseFloat(cls.overall) >= 8.0);
    }

    // Sort Data
    displayData.sort((a, b) => {
        let valA = a[currentSortBy];
        let valB = b[currentSortBy];

        // Handle potential undefined or null values before comparison
        if (valA == null && valB == null) return 0;
        if (valA == null) return sortAscending ? -1 : 1; // Treat null as smaller or larger depending on sort order
        if (valB == null) return sortAscending ? 1 : -1;


        if (['name', 'category'].includes(currentSortBy)) {
            // Translate category for sorting if applicable
            let displayA = (currentSortBy === 'category') ? (trans[valA.toLowerCase().replace(/\s+/g, '')] || valA) : valA;
            let displayB = (currentSortBy === 'category') ? (trans[valB.toLowerCase().replace(/\s+/g, '')] || valB) : valB;
            return sortAscending ? displayA.localeCompare(displayB, currentLanguage) : displayB.localeCompare(displayA, currentLanguage);
        } else {
            // Ensure values are numbers for numeric sort
            valA = parseFloat(valA);
            valB = parseFloat(valB);
            // Handle NaN cases that might result from parseFloat
            if (isNaN(valA) && isNaN(valB)) return 0;
            if (isNaN(valA)) return sortAscending ? -1 : 1;
            if (isNaN(valB)) return sortAscending ? 1 : -1;

            return sortAscending ? valA - valB : valB - valA;
        }
    });

    // Render rows
    if (displayData.length === 0) {
         tableBodyEl.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-gray-500">${translations[currentLanguage].noResults || 'Keine Klassen entsprechen den Filtern.'}</td></tr>`;
    } else {
        displayData.forEach(cls => {
            const row = tableBodyEl.insertRow();
            if (cls.isTop && showTopSelectEl.value === 'all') row.classList.add('top-class-row');

            const nameCell = row.insertCell();
            nameCell.textContent = cls.name;
            nameCell.classList.add('class-name-clickable', 'px-6', 'py-4', 'whitespace-nowrap', 'text-sm');
            nameCell.addEventListener('click', () => openClassDetailModal(cls.name));

            row.insertCell().outerHTML = `<td class="category-text px-6 py-4 whitespace-nowrap text-sm text-gray-500">${trans[cls.category.toLowerCase().replace(/\s+/g, '')] || cls.category}</td>`;
            row.insertCell().innerHTML = renderRatingBar(cls.dps, trans.dps);
            row.insertCell().innerHTML = renderRatingBar(cls.survival, trans.survival);
            row.insertCell().innerHTML = renderRatingBar(cls.utility, trans.utility);
            row.insertCell().innerHTML = renderRatingBar(cls.mobility, trans.mobility);
            row.insertCell().innerHTML = renderRatingBar(cls.ease, trans.ease);
            row.insertCell().innerHTML = renderRatingBar(cls.pveRating, trans.pveRating);
            row.insertCell().innerHTML = renderRatingBar(cls.pvpRating, trans.pvpRating);
            row.insertCell().innerHTML = renderRatingBar(cls.overall, trans.overallRating);

            // Add Tailwind classes to all td elements for consistency
            Array.from(row.cells).forEach(cell => {
                if (!cell.classList.contains('class-name-clickable') && !cell.classList.contains('category-text')) {
                     cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');
                }
            });
        });
    }
     updateSortArrowIcon(); // Ensure sort arrow is updated after rendering
    // console.log("Table rendered.");
}


function renderRatingBar(rating, label) {
    const numericRating = parseFloat(rating);
    if (isNaN(numericRating)) return `<div class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</div>`;

    let widthPercentage = numericRating * 10; // Max 100% for rating 10
    if (widthPercentage > 100) widthPercentage = 100;
    if (widthPercentage < 5 && numericRating > 0) widthPercentage = 5; // Min visible width

    let ratingColorClass = 'bg-danger'; // Default to weak
    if (numericRating >= 8.5) ratingColorClass = 'bg-info'; // Very Strong
    else if (numericRating >= 7.0) ratingColorClass = 'bg-secondary'; // Strong
    else if (numericRating >= 5.0) ratingColorClass = 'bg-warning'; // Medium

    // Ensure the container cell has appropriate padding if called directly
    // However, it's better to apply padding to the <td> in renderTable
    return `
        <div class="rating flex items-center w-24" aria-label="${label}: ${numericRating.toFixed(1)}">
            <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                <div class="${ratingColorClass} h-2.5 rounded-full" style="width: ${widthPercentage}%"></div>
            </div>
            <span class="text-xs font-medium text-gray-700">${numericRating.toFixed(1)}</span>
        </div>
    `;
}


function updateSortArrowIcon() {
    // Clear existing arrows from all headers
    document.querySelectorAll('#class-table thead th .sort-arrow').forEach(arrow => arrow.remove());

    // Add arrow to the current sort column header
    const currentHeader = document.querySelector(`#class-table thead th[data-sort="${currentSortBy}"]`);
    if (currentHeader) {
        const arrowSpan = document.createElement('span');
        arrowSpan.classList.add('sort-arrow', 'ml-1', 'inline-block'); // Use inline-block
        arrowSpan.innerHTML = sortAscending ? '&#9650;' : '&#9660;'; // Up or Down arrow
        currentHeader.appendChild(arrowSpan);
    }
     // Update the sort button icon
     if (sortArrowIconEl) {
        sortArrowIconEl.innerHTML = sortAscending ?
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>' : // Up arrow
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7 7"></path>'; // Down arrow
    }
}


// --- Dual Class Combination Logic ---
function checkCompatibility(class1Name, class2Name) {
    if (!class1Name || !class2Name) return { compatible: true }; // Not enough info yet
    if (class1Name === class2Name) return { compatible: false, reasonKey: "errorSameClassSelected" };

    for (const combo of specificInvalidCombinations) {
        if ((combo[0] === class1Name && combo[1] === class2Name) || (combo[0] === class2Name && combo[1] === class1Name)) {
            return { compatible: false, reasonKey: "errorSpecificComboNotAllowed" };
        }
    }
    for (const groupKey in restrictionGroups) {
        const group = restrictionGroups[groupKey];
        if (group.includes(class1Name) && group.includes(class2Name)) {
            return { compatible: false, reasonKey: "errorSameGroup", groupName: groupKey };
        }
    }
    return { compatible: true };
}

function updateCompatibilityInfo() {
    if (!isDataLoaded) return; // Don't run if data isn't ready
    const class1 = class1SelectEl.value;
    const class2 = class2SelectEl.value;
    const trans = translations[currentLanguage];

    if (!class1 || !class2) {
        compatibilityInfoContainerEl.style.display = 'none';
        alternativeSuggestionsEl.innerHTML = '';
        return;
    }

    const compResult = checkCompatibility(class1, class2);
    compatibilityTitleDisplayEl.textContent = trans.compatibilityTitle;

    if (compResult.compatible) {
        compatibilityMessageDisplayEl.textContent = trans.compatible;
        compatibilityInfoContainerEl.classList.remove('warning', 'bg-red-50', 'border-danger', 'text-red-700');
        compatibilityInfoContainerEl.classList.add('info', 'bg-blue-50', 'border-primary', 'text-blue-700');
        alternativeSuggestionsEl.innerHTML = '';
    } else {
        let reasonText = trans[compResult.reasonKey] || "Unknown restriction.";
        if (compResult.groupName) {
            reasonText += ` ${compResult.groupName}`;
        }
        compatibilityMessageDisplayEl.textContent = reasonText;
        compatibilityInfoContainerEl.classList.remove('info', 'bg-blue-50', 'border-primary', 'text-blue-700');
        compatibilityInfoContainerEl.classList.add('warning', 'bg-red-50', 'border-danger', 'text-red-700');

        const alternatives = getAlternativeSuggestions(class1, category2SelectEl.value, class2);
        if (alternatives.length > 0) {
            alternativeSuggestionsEl.innerHTML = `<strong class="block mt-1">${trans.alternativeSuggestion}</strong><ul class="list-disc list-inside pl-1">${alternatives.map(alt => `<li>${alt}</li>`).join('')}</ul>`;
        } else {
            alternativeSuggestionsEl.innerHTML = '';
        }
    }
    compatibilityInfoContainerEl.style.display = 'block';
}

function getAlternativeSuggestions(baseClass, targetCategoryName, excludedClass) {
    const targetCategoryClasses = classesByCategory[targetCategoryName];
    if (!targetCategoryClasses) return [];

    let suggestions = [];
    for (const potentialAlt of targetCategoryClasses) {
        if (potentialAlt === baseClass || potentialAlt === excludedClass) continue;
        if (checkCompatibility(baseClass, potentialAlt).compatible) {
            suggestions.push(potentialAlt);
            if (suggestions.length >= 3) break;
        }
    }
    return suggestions;
}

function displayCombinationSynergy() {
     if (!isDataLoaded) return; // Don't run if data isn't ready
    const class1 = class1SelectEl.value;
    const class2 = class2SelectEl.value;
    const trans = translations[currentLanguage];

    if (!class1 || !class2) {
        comboResultsDisplayEl.innerHTML = `<p class="compatibility-message-container warning p-3 rounded-md">${trans.errorSelectBothClasses}</p>`;
        comboResultsDisplayEl.style.display = 'block';
        return;
    }

    const compResult = checkCompatibility(class1, class2);
    if (!compResult.compatible) {
        let reasonText = trans[compResult.reasonKey] || "Unknown restriction.";
        if (compResult.groupName) {
            reasonText += ` ${compResult.groupName}`;
        }
        comboResultsDisplayEl.innerHTML = `<p class="compatibility-message-container warning p-3 rounded-md">${trans.incompatible} ${reasonText}</p>`;
        comboResultsDisplayEl.style.display = 'block';
        updateCompatibilityInfo();
        return;
    }

    const key1 = `${class1}_${class2}`;
    const key2 = `${class2}_${class1}`;
    const currentSynergyData = synergyData[key1] || synergyData[key2];

    if (currentSynergyData && currentSynergyData[trans.languageCodeForSynergy || currentLanguage]) {
        const langSynergy = currentSynergyData[trans.languageCodeForSynergy || currentLanguage];
        let synergyLevelText = trans[langSynergy.synergyLevel] || trans.neutralSynergy;
        let synergyColorClass = "bg-blue-100 text-blue-700"; // Neutral
        if (langSynergy.synergyLevel === "perfectMatch") {
            synergyColorClass = "bg-green-100 text-green-700";
        } else if (langSynergy.synergyLevel === "goodSynergy") {
            synergyColorClass = "bg-yellow-100 text-yellow-700";
        }

        let html = `<div class="combo-recommendation-display">
                        <h4>${langSynergy.title} <span class="text-xs font-bold px-2 py-0.5 rounded-full ${synergyColorClass}">${synergyLevelText}</span></h4>
                        <p>${langSynergy.description}</p>`;
        if (langSynergy.strengths && langSynergy.strengths.length > 0) {
            html += `<p class="font-medium mt-2">${trans.strengths || 'Strengths'}:</p><ul>`;
            langSynergy.strengths.forEach(strength => {
                html += `<li>${strength}</li>`;
            });
            html += `</ul>`;
        }
        html += `</div>`;
        comboResultsDisplayEl.innerHTML = html;
    } else {
        comboResultsDisplayEl.innerHTML = `<p class="compatibility-message-container info p-3 rounded-md">${trans.noComboFound}</p>`;
    }
    comboResultsDisplayEl.style.display = 'block';
    updateCompatibilityInfo();
}

// --- Recommendations and Notes Rendering ---
function renderTopCategoryRecommendations() {
    if (!topCategoryRecommendationsContentEl || !isDataLoaded) return;
    topCategoryRecommendationsContentEl.innerHTML = '';
    const recommendations = topCategoryCombos[currentLanguage];
    if (!recommendations) return;

    recommendations.forEach(rec => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('recommended-class-item'); // Tailwind classes applied in CSS
        itemDiv.innerHTML = `
            <h3>${rec.categoryTitle}</h3>
            <p><strong>${rec.class1} + ${rec.class2}</strong></p>
            <p>${rec.details}</p>
        `;
        topCategoryRecommendationsContentEl.appendChild(itemDiv);
    });
}

function renderRestrictionGroupsList() {
    if (!restrictionGroupsListEl || !isDataLoaded) return;
    restrictionGroupsListEl.innerHTML = '';
    for (const groupName in restrictionGroups) {
        const li = document.createElement('li');
        li.textContent = `${groupName}: ${restrictionGroups[groupName].join(', ')}`;
        restrictionGroupsListEl.appendChild(li);
    }
}

// --- Modal Logic ---
function openClassDetailModal(className) {
     if (!isDataLoaded) return; // Don't open if data isn't ready
    const classInfo = classData.find(cls => cls.name === className);
    const skillsData = detailedSkillChanges[className];
    const trans = translations[currentLanguage];

    if (!classInfo) {
        console.error(`Class info not found for ${className}`);
        return;
    }


    modalClassNameEl.textContent = `${classInfo.name}`;
    modalClassCategoryEl.textContent = trans[classInfo.category.toLowerCase().replace(/\s+/g, '')] || classInfo.category;

    modalClassRatingsEl.innerHTML = `
        <div class="rating-item"><strong>${trans.dps}:</strong> ${renderRatingBar(classInfo.dps, trans.dps)}</div>
        <div class="rating-item"><strong>${trans.survival}:</strong> ${renderRatingBar(classInfo.survival, trans.survival)}</div>
        <div class="rating-item"><strong>${trans.utility}:</strong> ${renderRatingBar(classInfo.utility, trans.utility)}</div>
        <div class="rating-item"><strong>${trans.mobility}:</strong> ${renderRatingBar(classInfo.mobility, trans.mobility)}</div>
        <div class="rating-item"><strong>${trans.ease}:</strong> ${renderRatingBar(classInfo.ease, trans.ease)}</div>
        <div class="rating-item"><strong>${trans.pveRating}:</strong> ${renderRatingBar(classInfo.pveRating, trans.pveRating)}</div>
        <div class="rating-item"><strong>${trans.pvpRating}:</strong> ${renderRatingBar(classInfo.pvpRating, trans.pvpRating)}</div>
        <div class="rating-item"><strong>${trans.damageFocusLabel}</strong> ${trans["damageFocus" + (classInfo.damageFocus ? classInfo.damageFocus.charAt(0).toUpperCase() + classInfo.damageFocus.slice(1) : 'All')] || classInfo.damageFocus || '-'}</div>
    `;

    if (skillsData && skillsData.skillChanges && skillsData.skillChanges.length > 0) {
        modalSkillChangesListEl.innerHTML = '';
        modalNoSkillDataPEl.style.display = 'none';

        skillsData.skillChanges.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.classList.add('skill-item'); // Tailwind classes applied in CSS
            let skillHtml = `<strong>${skill.name}</strong>`;

            let typeText = skill.type || ""; // Ensure typeText is a string
            let highlightClass = "";
            let highlightText = "";

            if (typeText.toLowerCase().includes("new")) {
                highlightClass = "new-skill-highlight"; // Defined in CSS
                highlightText = trans.newSkillHighlightText;
                typeText = typeText.replace(/new/i, '').trim(); // Remove "new" to avoid double display
            } else if (typeText.toLowerCase().includes("change") || typeText.toLowerCase().includes("reworked") || typeText.toLowerCase().includes("buff") || typeText.toLowerCase().includes("debuff") || typeText.toLowerCase().includes("removed")) {
                 highlightClass = "changed-skill-highlight"; // You'll need to define this class in CSS
                 highlightText = trans.changedSkillHighlightText;
            }


            if (typeText) {
                 skillHtml += `<span class="skill-type">(${typeText})</span>`;
            }
            if (highlightClass) {
                 skillHtml += `<span class="${highlightClass} ml-2">${highlightText}</span>`;
            }


            if (skill.changes && skill.changes.length > 0) {
                skillHtml += `<ul class="skill-changes-list">`; // Tailwind classes applied in CSS
                skill.changes.forEach(change => {
                    // Basic HTML escaping for safety, replace arrows
                    const safeChange = change.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/→/g, '&rarr;').replace(/<-/g, '&larr;');
                    skillHtml += `<li>${safeChange}</li>`;
                });
                skillHtml += `</ul>`;
            }
            skillDiv.innerHTML = skillHtml;
            modalSkillChangesListEl.appendChild(skillDiv);
        });
    } else {
        modalSkillChangesListEl.innerHTML = '';
        modalNoSkillDataPEl.style.display = 'block';
        modalNoSkillDataPEl.textContent = trans.modalNoSkillData;
    }

    classDetailModalEl.style.display = "flex"; // Use flex for centering
}

function closeClassDetailModal() {
    classDetailModalEl.style.display = "none";
}
