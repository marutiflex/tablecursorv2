let isEditMode = false;
MFTablesCursor.forEach(tableId => {
    const table = document.getElementById(tableId);
    if (!table) return;

    table.addEventListener('keydown', function (e) {
        const el = e.target;
        if (!['INPUT', 'SELECT'].includes(el.tagName)) return;

        const key = e.key;

        /* =====================
           F2 → Toggle edit mode
        ====================== */
        if (key === 'F2') {
            e.preventDefault();
            isEditMode = !isEditMode;

            if (isEditMode && el.tagName === 'INPUT') {
                const len = el.value.length;
                el.setSelectionRange(len, len);
            }
            return;
        }

        /* =====================
           Edit mode → native behavior
        ====================== */
        if (isEditMode) return;

        /* =====================
           Arrow navigation
        ====================== */
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;

        // Prevent number increment/decrement
        if (el.tagName === 'INPUT' && el.type === 'number') {
            e.preventDefault();
        }

        const cell = el.closest('td');
        const row = cell.closest('tr');
        const rowIndex = row.rowIndex;
        const colIndex = cell.cellIndex;

        let targetCell = null;

        switch (key) {
            case 'ArrowRight':
                targetCell = row.cells[colIndex + 1];
                break;
            case 'ArrowLeft':
                targetCell = row.cells[colIndex - 1];
                break;
            case 'ArrowDown':
                if (table.rows[rowIndex + 1])
                    targetCell = table.rows[rowIndex + 1].cells[colIndex];
                break;
            case 'ArrowUp':
                if (table.rows[rowIndex - 1])
                    targetCell = table.rows[rowIndex - 1].cells[colIndex];
                break;
        }

        if (targetCell) {
            const nextControl = targetCell.querySelector('input, select');
            if (nextControl) {
                nextControl.focus();

                if (nextControl.tagName === 'INPUT') {
                    nextControl.select();
                }
            }
        }
    });
});

/* Exit edit mode on click outside */
document.addEventListener('click', () => {
    isEditMode = false;
});