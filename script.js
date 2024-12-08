// Update modifiers and dependent stats dynamically
const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

// Calculate proficiency bonus based on level
function calculateProficiencyBonus(level) {
    return Math.ceil(level / 4) + 1; // +2 at level 1-4, +3 at 5-8, etc.
}

// Calculate spell slots for a Warlock based on level
function calculateWarlockSpellSlots(level) {
    const slotsByLevel = [1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5];
    const slotLevelByLevel = [1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9];

    return {
        slots: slotsByLevel[level - 1],
        slotLevel: slotLevelByLevel[level - 1],
    };
}

// Update modifiers and dependent stats
function updateModifiers() {
    const level = 4; // Update this value for different character levels
    const proficiencyBonus = calculateProficiencyBonus(level);
    document.getElementById('proficiency-bonus').value = proficiencyBonus;

    // Update Warlock spell slots and slot level
    const { slots, slotLevel } = calculateWarlockSpellSlots(level);
    document.getElementById('spell-slot-count').value = slots;
    document.getElementById('spell-slot-level').value = slotLevel;

    abilityScores.forEach(stat => {
        const score = document.getElementById(stat).value;
        const mod = Math.floor((score - 10) / 2);
        document.getElementById(`${stat}-mod`).textContent = mod >= 0 ? `+${mod}` : mod;

        // Update dependent stats if Charisma changes
        if (stat === 'cha') {
            document.getElementById('spell-save-dc').value = 8 + proficiencyBonus + mod;
        }
    });
}

// Update HP live
const healthSlider = document.getElementById('health');
const tempHpInput = document.getElementById('temp-hp');
const currentHPDisplay = document.getElementById('current-hp-display');
const effectiveHPDisplay = document.getElementById('effective-hp-display');

function updateHP() {
    const currentHP = parseInt(healthSlider.value, 10);
    const tempHP = parseInt(tempHpInput.value, 10);
    currentHPDisplay.textContent = currentHP;
    effectiveHPDisplay.textContent = currentHP + tempHP; // Effective HP includes temporary HP
}

// Dice rolling functionality
document.querySelectorAll('.roll-dice').forEach(button => {
    button.addEventListener('click', () => {
        const dice = parseInt(button.getAttribute('data-dice'), 10);
        const numDice = parseInt(document.getElementById('num-dice').value, 10);
        const resultsList = document.getElementById('dice-results');

        // Clear previous results
        resultsList.innerHTML = '';

        let total = 0;
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * dice) + 1;
            total += roll;

            // Add roll result to list
            const listItem = document.createElement('li');
            listItem.textContent = `Rolled a d${dice}: ${roll}`;
            resultsList.appendChild(listItem);
        }

        // Add total to the list
        const totalItem = document.createElement('li');
        totalItem.textContent = `Total: ${total}`;
        totalItem.style.fontWeight = 'bold';
        resultsList.appendChild(totalItem);
    });
});


healthSlider.addEventListener('input', updateHP);
tempHpInput.addEventListener('input', updateHP);

// Initialize
updateModifiers();
updateHP();
