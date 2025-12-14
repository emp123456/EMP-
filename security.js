/*
 * VOID LABS DEFENSE PROTOCOL v1.0
 * Security & Anti-Tamper Logic
 */

(function () {
    const DEBUG_MODE = false; // Set to true to disable protection during dev

    if (DEBUG_MODE) return;

    // 1. DISABLE CONTEXT MENU
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Optional: Custom alert or silent fail
        // alert("ACESSO NEGADO: PROTOCOLO DE SEGURANÇA ATIVO.");
    });

    // 2. DISABLE KEY SHORTCUTS (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+S)
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Ctrl + Shift + I/J/C (DevTools)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
            e.preventDefault();
            return false;
        }

        // Ctrl + U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }

        // Ctrl + S (Save)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            alert("VOCÊ NÃO PODE SALVAR O VAZIO.");
            return false;
        }
    });

    // 3. DEBUGGER LOOP (REMOVED FOR USER EXPERIENCE)
    // Aggressive anti-debug removed to prevent site freezing/bugs during normal usage.

    // 4. CONSOLE WARNING
    console.log("%c PARE!", "color: red; font-size: 50px; font-weight: bold;");
    console.log("%c Este é um ambiente controlado. Qualquer tentativa de engenharia reversa será monitorada.", "color: white; font-size: 20px;");

})();
