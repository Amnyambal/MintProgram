// Инициализация AOS анимаций
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false
});

// Тема
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeText = themeToggle.querySelector('.theme-text');

const themes = [
  { name: 'Тёмная', value: null, icon: '🌙' },
  { name: 'Светлая', value: 'light', icon: '☀️' },
  { name: 'Кибер', value: 'cyber', icon: '🦾' }
];

let currentThemeIndex = 0;

function applyTheme(index) {
  const theme = themes[index];
  
  if (theme.value) {
    document.documentElement.setAttribute('data-theme', theme.value);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  themeIcon.textContent = theme.icon;
  themeText.textContent = theme.name;
  localStorage.setItem('theme', JSON.stringify(theme));
}

function cycleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme(currentThemeIndex);
  
  themeToggle.classList.add('animate__animated', 'animate__rubberBand');
  setTimeout(() => {
    themeToggle.classList.remove('animate__animated', 'animate__rubberBand');
  }, 1000);
}

// Восстановление темы из localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  const theme = JSON.parse(savedTheme);
  const index = themes.findIndex(t => t.value === theme.value);
  if (index !== -1) {
    currentThemeIndex = index;
    applyTheme(currentThemeIndex);
  }
}

themeToggle.addEventListener('click', cycleTheme);

// Улучшенный терминал
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");
const terminalHistory = [];
let historyIndex = -1;

// Приветственное сообщение
terminalOutput.innerHTML = `> Добро пожаловать в MINT Terminal v2.0
Введите "помощь" для списка команд
`;

// Команды терминала
const commands = {
  'минт': {
    description: 'Информация о проекте',
    execute: () => "MINT — инновационные курсы программирования\nВерсия: 2.0\nСтудентов: 10,000+"
  },
  'время': {
    description: 'Текущее время',
    execute: () => new Date().toLocaleTimeString()
  },
  'дата': {
    description: 'Текущая дата',
    execute: () => new Date().toLocaleDateString()
  },
  'играть': {
    description: 'Запустить игру',
    execute: () => {
      setTimeout(() => window.location.href = 'игра.html', 1000);
      return "Запускаем игру...";
    }
  },
  'курсы': {
    description: 'Список доступных курсов',
    execute: () => "Доступные курсы:\n1. Python\n2. JavaScript\n3. C++\n4. Web-разработка\nВведите 'курс [название]' для подробностей"
  },
  'курс': {
    description: 'Информация о курсе',
    execute: (args) => {
      const course = args[0]?.toLowerCase();
      const courses = {
        'python': "Курс Python:\nДлительность: 3 месяца\nСтоимость: 15,000₽\nНавыки: основы, ООП, Django",
        'javascript': "Курс JavaScript:\nДлительность: 4 месяца\nСтоимость: 18,000₽\nНавыки: ES6+, React, Node.js",
        'c++': "Курс C++:\nДлительность: 5 месяцев\nСтоимость: 20,000₽\nНавыки: STL, многопоточность",
        'web': "Курс Web-разработки:\nДлительность: 6 месяцев\nСтоимость: 25,000₽\nНавыки: HTML/CSS, JS, React, Backend"
      };
      return courses[course] || "Курс не найден. Введите 'курсы' для списка";
    }
  },
  'очистить': {
    description: 'Очистить терминал',
    execute: () => { terminalOutput.innerHTML = ''; return null; }
  },
  'помощь': {
    description: 'Список команд',
    execute: () => {
      let helpText = "Доступные команды:\n";
      for (const [cmd, info] of Object.entries(commands)) {
        helpText += `${cmd} - ${info.description}\n`;
      }
      return helpText + "\nТакже попробуйте:\n- сайт\n- контакты\n- настройки";
    }
  },
  'сайт': {
    description: 'Открыть сайт',
    execute: () => {
      setTimeout(() => window.open('https://mint-school.ru', '_blank'), 500);
      return "Открываю сайт в новой вкладке...";
    }
  },
  'тема': {
    description: 'Сменить тему интерфейса',
    execute: () => { cycleTheme(); return "Тема изменена!"; }
  },
  'погода': {
    description: 'Текущая погода',
    execute: () => {
      const temps = ["☀️ +25°C", "⛅ +18°C", "🌧 +15°C", "❄️ -3°C"];
      return "Погода в Москве: " + temps[Math.floor(Math.random() * temps.length)];
    }
  },
  'рандом': {
    description: 'Случайное число',
    execute: (args) => {
      const min = parseInt(args[0]) || 1;
      const max = parseInt(args[1]) || 100;
      return `Случайное число: ${Math.floor(Math.random() * (max - min + 1)) + min}`;
    }
  }
};

// Обработчик ввода
terminalInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const input = terminalInput.value.trim();
    if (!input) return;
    
    terminalInput.value = "";
    addToHistory(input);
    processCommand(input);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (terminalHistory.length > 0) {
      historyIndex = Math.min(historyIndex + 1, terminalHistory.length - 1);
      terminalInput.value = terminalHistory[terminalHistory.length - 1 - historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = terminalHistory[terminalHistory.length - 1 - historyIndex];
    } else {
      historyIndex = -1;
      terminalInput.value = "";
    }
  }
});

function addToHistory(command) {
  terminalHistory.push(command);
  historyIndex = -1;
}

function processCommand(input) {
  const parts = input.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  let response;
  
  if (commands[cmd]) {
    response = commands[cmd].execute(args);
  } else if (cmd === 'привет' || cmd === 'hi' || cmd === 'hello') {
    response = "Привет! Чем могу помочь? Введи 'помощь' для списка команд.";
  } else {
    response = `Ошибка: команда "${cmd}" не найдена\nВведите "помощь" для списка доступных команд`;
  }
  
  if (response !== null) {
    terminalOutput.innerHTML += `\n> ${input}\n${response}\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
}

// Лого анимация
const logo = document.getElementById('logo');
const logoOverlay = document.getElementById('logoOverlay');

logo.addEventListener('click', function() {
  logoOverlay.classList.add('active');
  setTimeout(() => {
    logoOverlay.classList.remove('active');
  }, 2000);
});

// Партиклы
const particlesContainer = document.getElementById('particles');
const particleCount = 30;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
    
  const size = Math.random() * 10 + 5;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 10;
    
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;
    
  particlesContainer.appendChild(particle);
}

// Кнопка "Наверх"
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function() {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add('active');
  } else {
    scrollTopBtn.classList.remove('active');
  }
});

scrollTopBtn.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Анимации карточек
const cards = document.querySelectorAll('.card');
  
const animateCards = () => {
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate__animated', 'animate__pulse');
      setTimeout(() => {
        card.classList.remove('animate__animated', 'animate__pulse');
      }, 1000);
    }, index * 200);
  });
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCards();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Автодополнение команд
terminalInput.addEventListener('input', function() {
  const input = this.value.trim().toLowerCase();
  if (!input) return;
  
  const matchingCommands = Object.keys(commands).filter(cmd => 
    cmd.startsWith(input)
  );
  
  if (matchingCommands.length === 1) {
    this.value = matchingCommands[0];
    this.setSelectionRange(input.length, matchingCommands[0].length);
  }
});