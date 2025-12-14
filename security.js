
(function () {
    const DEBUG_MODE = false;

    if (DEBUG_MODE) return;

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 123 || e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && (e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && (e.key === 's' || e.keyCode === 83)) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('selectstart', (e) => e.preventDefault());

    setInterval(() => {
        (function () { }.constructor("debugger")());
    }, 50);

    console.log("%c PARE!", "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px black;");
    console.log("%c ACESSO RESTRITO. PROTOCOLO DE CONTRALONAGEM ATIVO.", "color: white; font-size: 16px; background: #000; padding: 10px; border: 1px solid #f00;");

})();

