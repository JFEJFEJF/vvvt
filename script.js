document.addEventListener('DOMContentLoaded', () => {
    const studentNameInput = document.getElementById('student-name');
    const continueBtn = document.getElementById('continue-btn');
    const motivationalSection = document.getElementById('motivational-section');
    const scheduleSetupSection = document.getElementById('schedule-setup-section');
    const scheduleSection = document.getElementById('schedule-section');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const clockTime = document.getElementById('clock-time');
    const currentDay = document.getElementById('current-day');
    const daysInput = document.getElementById('days-input');
    const hoursInput = document.getElementById('hours-input');
    const createScheduleBtn = document.getElementById('create-schedule-btn');
    const scheduleTable = document.getElementById('schedule-table');
    const addRowBtn = document.getElementById('add-row-btn');
    const addColumnBtn = document.getElementById('add-column-btn');
    const saveBtn = document.getElementById('save-btn');
    const textColorOptions = document.getElementById('text-color-options');
    const backgroundColorOptions = document.getElementById('background-color-options');
    const increaseTextSizeBtn = document.getElementById('increase-text-size');
    const decreaseTextSizeBtn = document.getElementById('decrease-text-size');
    const textAlignmentOptions = document.getElementById('text-alignment-options');
    const subjectNameInput = document.getElementById('subject-name');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const notesInput = document.getElementById('notes-input');
    const saveNotesBtn = document.getElementById('save-notes-btn');
    const notesSection = document.getElementById('notes-section');
    let darkMode = false;
    let selectedCell = null;

    // تحديث الساعة والتاريخ
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const day = days[now.getDay()];
        const date = now.toLocaleDateString('ar-EG');
        clockTime.textContent = `${hours}:${minutes}:${seconds}`;
        currentDay.textContent = `${day} ${date}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // حفظ واسترجاع البيانات من localStorage
    function saveData() {
        const studentName = studentNameInput.value.trim();
        const tableData = [];
        for (let i = 0; i < scheduleTable.rows.length; i++) {
            const row = [];
            for (let j = 0; j < scheduleTable.rows[i].cells.length; j++) {
                const input = scheduleTable.rows[i].cells[j].querySelector('input');
                row.push({
                    value: input.value,
                    color: input.style.color,
                    backgroundColor: input.style.backgroundColor,
                    fontSize: input.style.fontSize,
                    textAlign: input.style.textAlign
                });
            }
            tableData.push(row);
        }
        localStorage.setItem('studentName', studentName);
        localStorage.setItem('darkMode', darkMode);
        localStorage.setItem('tableData', JSON.stringify(tableData));
        localStorage.setItem('notes', notesInput.value);
    }

    function loadData() {
        const studentName = localStorage.getItem('studentName');
        const savedDarkMode = localStorage.getItem('darkMode');
        const tableData = JSON.parse(localStorage.getItem('tableData'));
        const savedNotes = localStorage.getItem('notes');

        if (studentName) {
            studentNameInput.value = studentName;
            motivationalSection.innerHTML = `<h1>أهلاً ${studentName}!</h1>
                                             <p>استمر في تحقيق أهدافك! 🌟📚</p>`;
            scheduleSetupSection.classList.remove('hidden');
        }

        if (savedDarkMode === 'true') {
            darkMode = true;
            document.body.classList.add('dark-mode');
        }

        if (tableData) {
            createScheduleTable(tableData[0].length, tableData.length);
            for (let i = 0; i < tableData.length; i++) {
                for (let j = 0; j < tableData[i].length; j++) {
                    const cell = scheduleTable.rows[i].cells[j];
                    const input = cell.querySelector('input');
                    const data = tableData[i][j];
                    input.value = data.value;
                    input.style.color = data.color;
                    input.style.backgroundColor = data.backgroundColor;
                    input.style.fontSize = data.fontSize;
                    input.style.textAlign = data.textAlign;
                }
            }
            scheduleSection.classList.remove('hidden');
        }

        if (savedNotes) {
            notesInput.value = savedNotes;
            notesSection.classList.remove('hidden');
        }
    }

    window.addEventListener('beforeunload', saveData);

    // تبديل المظهر
    toggleThemeBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        saveData();
    });

    // إظهار القسم التحفيزي
    continueBtn.addEventListener('click', () => {
        const studentName = studentNameInput.value.trim();
        if (studentName) {
            motivationalSection.innerHTML = `<h1>أهلاً ${studentName}!</h1>
                                             <p>استمر في تحقيق أهدافك! 🌟📚</p>`;
            scheduleSetupSection.classList.remove('hidden');
            notesSection.classList.remove('hidden');
            saveData();
        }
    });

    // إنشاء الجدول الدراسي بناءً على إدخال المستخدم
    createScheduleBtn.addEventListener('click', () => {
        const numDays = parseInt(daysInput.value);
        const numHours = parseInt(hoursInput.value);
        createScheduleTable(numDays, numHours);
        scheduleSection.classList.remove('hidden');
        saveData();
    });

    // إنشاء الجدول الدراسي
    function createScheduleTable(numDays, numHours) {
        scheduleTable.innerHTML = '';
        const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

        // إنشاء رأس الجدول
        const headerRow = scheduleTable.insertRow();
        headerRow.insertCell().outerHTML = '<th>الساعة\\اليوم</th>';
        for (let i = 0; i < numDays; i++) {
            const th = document.createElement('th');
            th.textContent = daysOfWeek[i];
            headerRow.appendChild(th);
        }

        // إنشاء الصفوف
        for (let i = 0; i < numHours; i++) {
            const row = scheduleTable.insertRow();
            const hourCell = row.insertCell();
            hourCell.textContent = `${i + 1}`;
            for (let j = 0; j < numDays; j++) {
                const cell = row.insertCell();
                cell.innerHTML = '<input type="text">';
                cell.addEventListener('click', () => selectCell(cell));
            }
        }
    }

    // تحديد الخلية
    function selectCell(cell) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        selectedCell.classList.add('selected');
    }

    // تغيير لون النصوص
    textColorOptions.addEventListener('click', (event) => {
        const color = event.target.getAttribute('data-color');
        if (color && selectedCell) {
            selectedCell.querySelector('input').style.color = color;
            saveData();
        }
    });

    // تغيير لون الخلفية
    backgroundColorOptions.addEventListener('click', (event) => {
        const color = event.target.getAttribute('data-color');
        if (color && selectedCell) {
            selectedCell.querySelector('input').style.backgroundColor = color;
            saveData();
        }
    });

    // تكبير النص
    increaseTextSizeBtn.addEventListener('click', () => {
        if (selectedCell) {
            const input = selectedCell.querySelector('input');
            const currentSize = parseFloat(window.getComputedStyle(input).fontSize);
            input.style.fontSize = (currentSize + 2) + 'px';
            saveData();
        }
    });

    // تصغير النص
    decreaseTextSizeBtn.addEventListener('click', () => {
        if (selectedCell) {
            const input = selectedCell.querySelector('input');
            const currentSize = parseFloat(window.getComputedStyle(input).fontSize);
            input.style.fontSize = (currentSize - 2) + 'px';
            saveData();
        }
    });

    // تغيير محاذاة النص
    textAlignmentOptions.addEventListener('click', (event) => {
        const alignment = event.target.getAttribute('data-alignment');
        if (alignment && selectedCell) {
            selectedCell.querySelector('input').style.textAlign = alignment;
            saveData();
        }
    });

    // إضافة صف جديد إلى الجدول
    addRowBtn.addEventListener('click', () => {
        const row = scheduleTable.insertRow();
        for (let i = 0; i < scheduleTable.rows[0].cells.length; i++) {
            const cell = row.insertCell();
            cell.innerHTML = '<input type="text">';
            cell.addEventListener('click', () => selectCell(cell));
        }
        saveData();
    });

    // إضافة عمود جديد إلى الجدول
    addColumnBtn.addEventListener('click', () => {
        for (let i = 0; i < scheduleTable.rows.length; i++) {
            const cell = scheduleTable.rows[i].insertCell();
            cell.innerHTML = '<input type="text">';
            cell.addEventListener('click', () => selectCell(cell));
        }
        saveData();
    });

    // إضافة مادة دراسية إلى الجدول
    addSubjectBtn.addEventListener('click', () => {
        const subjectName = subjectNameInput.value.trim();
        if (subjectName && selectedCell) {
            selectedCell.querySelector('input').value = subjectName;
            subjectNameInput.value = '';
            saveData();
        }
    });

    // حفظ الملاحظات
    saveNotesBtn.addEventListener('click', () => {
        saveData();
        alert('تم حفظ الملاحظات!');
    });

    // حفظ الجدول كصورة
    saveBtn.addEventListener('click', () => {
        html2canvas(scheduleTable).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'جدول دراسي.png';
            link.click();
        });
    });

    // إنشاء الجدول الافتراضي
    function createDefaultTable() {
        createScheduleTable(5, 8);
    }
    createDefaultTable();
    loadData();
});
