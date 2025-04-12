const totalDays = 160;
const tasks = ['Article', 'Video', 'Problem'];
const boxes = ['bo1', 'bo2'];

// Start dates for each box
const startDates = {
  bo1: new Date('2025-04-06'), // Box 1 starts 6th April 2025
  bo2: new Date('2025-04-10')  // Box 2 starts 10th April 2025
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

    tasks.forEach(task => {
      const label = document.createElement('label');
      label.className = 'task';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!savedData?.[boxId]?.[dayKey]?.[task];

      checkbox.addEventListener('change', () => {
        if (!savedData[boxId]) savedData[boxId] = {};
        if (!savedData[boxId][dayKey]) savedData[boxId][dayKey] = {};
        savedData[boxId][dayKey][task] = checkbox.checked;
        localStorage.setItem('progress', JSON.stringify(savedData));
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(task));
      dayDiv.appendChild(label);
    });

    box.appendChild(dayDiv);
  }
}

function renderAll() {
  boxes.forEach(renderBox);
}

renderAll();
