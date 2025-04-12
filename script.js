const totalDays = 160;
const tasks = ['Article', 'Video', 'Problem'];
const boxes = ['bo1', 'bo2'];

const startDates = {
  bo1: new Date('2025-04-06'),
  bo2: new Date('2025-04-10')
};

let savedData = JSON.parse(localStorage.getItem('progress')) || {};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function renderBox(boxId) {
  const box = document.getElementById(boxId);
  box.innerHTML = "";

  const startDate = startDates[boxId];

  let fullComplete = 0;
  let partialComplete = 0;
  let notStarted = 0;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayNumber = i + 1;
    const dayKey = `Day ${dayNumber}`;
    const formattedDate = formatDate(currentDate);

    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-card';

    const dayTitle = document.createElement('div');
    dayTitle.className = 'day-title';
    dayTitle.textContent = `${dayKey} (${formattedDate})`;
    dayDiv.appendChild(dayTitle);

    let completed = 0;

    tasks.forEach(task => {
      const label = document.createElement('label');
      label.className = 'task';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!savedData?.[boxId]?.[dayKey]?.[task];

      if (checkbox.checked) completed++;

      checkbox.addEventListener('change', () => {
        if (!savedData[boxId]) savedData[boxId] = {};
        if (!savedData[boxId][dayKey]) savedData[boxId][dayKey] = {};
        savedData[boxId][dayKey][task] = checkbox.checked;
        localStorage.setItem('progress', JSON.stringify(savedData));
        renderBox(boxId); // re-render to update color and summary
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(task));
      dayDiv.appendChild(label);
    });

    // Color based on completion status
    if (completed === tasks.length) {
      dayDiv.style.backgroundColor = '#a0e59c'; // green
      fullComplete++;
    } else if (completed > 0) {
      dayDiv.style.backgroundColor = '#ffe18f'; // yellow
      partialComplete++;
    } else {
      dayDiv.style.backgroundColor = '#e0e0e0'; // gray
      notStarted++;
    }

    // Question Input
    const questionKey = `question_${boxId}_${dayKey}`;
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = 'Enter question...';
    questionInput.className = 'question-input';
    questionInput.value = localStorage.getItem(questionKey) || "";

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'save-question-btn';

    const savedMsg = document.createElement('span');
    savedMsg.textContent = 'Saved!';
    savedMsg.style.display = 'none';
    savedMsg.style.color = 'green';
    savedMsg.style.marginLeft = '8px';

    saveBtn.onclick = () => {
      localStorage.setItem(questionKey, questionInput.value);
      savedMsg.style.display = 'inline';
      setTimeout(() => {
        savedMsg.style.display = 'none';
      }, 1500);
    };

    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'question-wrapper';
    questionWrapper.appendChild(questionInput);
    questionWrapper.appendChild(saveBtn);
    questionWrapper.appendChild(savedMsg);

    dayDiv.appendChild(questionWrapper);
    box.appendChild(dayDiv);
  }

  // Show summary at the top
  const summaryEl = document.getElementById(`summary-${boxId}`);
  summaryEl.innerHTML = `
    <div class="summary-box">
      <strong>Summary for ${boxId.toUpperCase()}:</strong><br>
      ✅ Completed: ${fullComplete}<br>
      ⏳ Partial: ${partialComplete}<br>
      ❌ Not started: ${notStarted}
    </div>
  `;
}

function renderAll() {
  boxes.forEach(renderBox);
}

renderAll();
