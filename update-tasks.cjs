// update-tasks.cjs
const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const TASK_FILE = 'README-TASK.md';
const HISTORY_FILE = 'README-HISTORYTASK.md';

if (!fs.existsSync(TASK_FILE)) process.exit(0);

const content = fs.readFileSync(TASK_FILE, 'utf-8');
let lines = content.split('\n');

// Extraer tareas pendientes (soporta con espacio o sin espacio)
const pendingTasks = [];
lines.forEach((line, index) => {
    if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- []')) {
        pendingTasks.push({ index, text: line.trim() });
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función que limpia las tareas completadas y las mueve al historial
const processCleanup = () => {
    const keepLines = [];
    const completedLines = [];

    lines.forEach(line => {
        // Si la línea es una tarea completada
        if (line.trim().startsWith('- [x]') || line.trim().startsWith('- [X]')) {
            // Le agregamos la fecha actual para mejor tracking
            const date = new Date().toISOString().split('T')[0];
            completedLines.push(`${line} (Fecha: ${date})`);
        } else {
            keepLines.push(line);
        }
    });

    if (completedLines.length > 0) {
        // Guardar README-TASK sin las tareas completadas
        fs.writeFileSync(TASK_FILE, keepLines.join('\n'));
        
        // Añadir al historial
        let historyContent = '';
        if (fs.existsSync(HISTORY_FILE)) {
            historyContent = fs.readFileSync(HISTORY_FILE, 'utf-8') + '\n';
        } else {
            historyContent = '# 🗄️ Historial de Tareas Completadas\n\n';
        }
        
        historyContent += completedLines.join('\n');
        fs.writeFileSync(HISTORY_FILE, historyContent);

        console.log(`\n📦 Se movieron ${completedLines.length} tarea(s) completada(s) al archivo ${HISTORY_FILE}.`);

        // Agregar ambos archivos al commit
        try {
            execSync(`git add ${TASK_FILE} ${HISTORY_FILE}`);
        } catch (err) {
            console.error('Error al agregar archivos a Git:', err.message);
        }
    }
    process.exit(0);
};

if (pendingTasks.length === 0) {
    // Si no hay pendientes, igual revisamos por si hay que limpiar tareas marcadas manualmente
    processCleanup();
} else {
    console.log('\n========================================');
    console.log('📋 Tareas Pendientes en README-TASK.md');
    console.log('========================================');
    pendingTasks.forEach((task, i) => {
        // Limpiamos el texto para mostrarlo bonito en consola
        const cleanText = task.text.replace('- [ ]', '').replace('- []', '').trim();
        console.log(`${i + 1}. ${cleanText}`);
    });
    console.log('0. Ninguna / Continuar');

    rl.question('\n¿En qué tarea avanzaste? (Número): ', (answerTask) => {
        const choice = parseInt(answerTask);
        
        if (choice > 0 && choice <= pendingTasks.length) {
            const taskToUpdate = pendingTasks[choice - 1];
            
            rl.question('¿Qué porcentaje de avance TOTAL tiene ahora? (0-100): ', (answerPct) => {
                const pct = parseInt(answerPct);
                let newLine = taskToUpdate.text;

                // Limpiar porcentaje anterior
                newLine = newLine.replace(/\s*\(\d+%\)$/, '');

                if (pct >= 100) {
                    newLine = newLine.replace('- [ ]', '- [x]').replace('- []', '- [x]') + ' (100%)';
                    console.log(`\n✅ Tarea completada al 100%.`);
                } else {
                    newLine = `${newLine} (${pct}%)`;
                    console.log(`\n⏳ Avance registrado al ${pct}%.`);
                }

                lines[taskToUpdate.index] = newLine;
                
                // Si no llegó al 100, solo guardamos el TASK_FILE. Si llegó a 100, processCleanup lo moverá.
                if (pct < 100) {
                    fs.writeFileSync(TASK_FILE, lines.join('\n'));
                    try { execSync(`git add ${TASK_FILE}`); } catch (e) {}
                }
                
                rl.close();
                processCleanup(); // Ejecutamos la limpieza final
            });
        } else {
            console.log('\nContinuando con el commit...');
            rl.close();
            processCleanup(); // Ejecutamos limpieza por si hay tareas marcadas manualmente
        }
    });
}
