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
      <strong>Summary for ${boxId.toUpperCase().replace('BO', 'BOX ')}:</strong><br>
      ✅ Completed: ${fullComplete}<br>
      ⏳ Partial: ${partialComplete}<br>
      ❌ Question-left: ${notStarted}
    </div>
  `;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.day-card').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  observer.observe(el);
});

function renderAll() {
  boxes.forEach(renderBox);
}

renderAll();
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

