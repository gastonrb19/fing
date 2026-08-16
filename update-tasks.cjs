// update-tasks.js
const fs = require('fs');
const readline = require('readline');

const TASK_FILE = 'README-TASK.md';

// Si no existe el archivo, continúa el commit normalmente
if (!fs.existsSync(TASK_FILE)) process.exit(0);

const content = fs.readFileSync(TASK_FILE, 'utf-8');
const lines = content.split('\n');

// Extraer tareas pendientes
const pendingTasks = [];
lines.forEach((line, index) => {
    if (line.trim().startsWith('- [ ]')) {
        pendingTasks.push({ index, text: line.trim() });
    }
});

// Si no hay tareas pendientes, continúa el commit
if (pendingTasks.length === 0) process.exit(0);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n========================================');
console.log('📋 Tareas Pendientes en README-TASK.md');
console.log('========================================');
pendingTasks.forEach((task, i) => {
    console.log(`${i + 1}. ${task.text.replace('- [ ]', '').trim()}`);
});
console.log('0. Ninguna / Continuar');

rl.question('\n¿En qué tarea avanzaste? (Número): ', (answerTask) => {
    const choice = parseInt(answerTask);
    
    if (choice > 0 && choice <= pendingTasks.length) {
        const taskToUpdate = pendingTasks[choice - 1];
        
        rl.question('¿Qué porcentaje de avance TOTAL tiene ahora? (0-100): ', (answerPct) => {
            const pct = parseInt(answerPct);
            let newLine = taskToUpdate.text;

            // Limpiar porcentaje anterior si existía (ej: "(30%)")
            newLine = newLine.replace(/\s*\(\d+%\)$/, '');

            if (pct >= 100) {
                // Marcar como completada
                newLine = newLine.replace('- [ ]', '- [x]') + ' (100%)';
                console.log(`\n✅ Tarea completada al 100%.\n`);
            } else {
                // Mantener pendiente y sobrescribir porcentaje
                newLine = `${newLine} (${pct}%)`;
                console.log(`\n⏳ Avance registrado al ${pct}%.\n`);
            }

            lines[taskToUpdate.index] = newLine;
            fs.writeFileSync(TASK_FILE, lines.join('\n'));
            
            // Adjuntar README-TASK.md automáticamente al commit actual
            try {
                require('child_process').execSync(`git add ${TASK_FILE}`);
            } catch (err) {
                console.error('Error al agregar README-TASK.md a Git:', err.message);
            }
            
            rl.close();
        });
    } else {
        console.log('\nContinuando con el commit sin modificar tareas.\n');
        rl.close();
    }
});
