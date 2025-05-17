(function () {
  const questionSetOriginal = [
    { q: "Что изучает теоретическая физика?", options: ["Правописание слов", "Законы природы с помощью математики", "Историю древнего мира", "Строение живых организмов"], answer: 1 },
    { q: "Какой физик известен своим котом, который и жив, и мёртв?", options: ["Ньютон", "Эйнштейн", "Шредингер", "Гейзенберг"], answer: 2 },
    { q: "Что такое 'сингулярность'?", options: ["Обычная точка в пространстве", "Частица со вкусом", "Точка бесконечной плотности", "Тип антенны"], answer: 2 },
    { q: "Что невозможно по специальной теории относительности?", options: ["Разогнаться до скорости света", "Двигаться с постоянной скоростью", "Быть в покое", "Измерить расстояние"], answer: 0 },
    { q: "Что показывает уравнение Эйнштейна E = mc²?", options: ["Сила удара", "Плотность вещества", "Связь массы и энергии", "Скорость света"], answer: 2 },
    { q: "Что такое квант?", options: ["Кусок льда", "Миниатюрный автомобиль", "Минимальная порция физической величины", "Вид молекулы"], answer: 2 },
    { q: "Кто предложил идею мультивселенной?", options: ["Пифагор", "Хокинг", "Хью Эверетт III", "Нильс Бор"], answer: 2 },
    { q: "Как называется частица-переносчик света?", options: ["Электрон", "Нейтрон", "Протон", "Фотон"], answer: 3 },
    { q: "Что означает 'суперпозиция' в квантовой физике?", options: ["Сложный музыкальный аккорд", "Одновременное пребывание в нескольких состояниях", "Замедление времени", "Перемещение в пространстве"], answer: 1 },
    { q: "Какой физик придумал общую теорию относительности?", options: ["Стивен Хокинг", "Альберт Эйнштейн", "Исаак Ньютон", "Макс Планк"], answer: 1 },
    { q: "Где могут существовать червоточины, согласно теории?", options: ["В океане", "В строении атома", "В пространстве-времени", "В облаках"], answer: 2 },
    { q: "Что изучает квантовая механика?", options: ["Большие объекты", "Метеорологию", "Поведение микрочастиц", "Биохимию"], answer: 2 },
    { q: "Как называется гипотетическая частица, переносящая гравитацию?", options: ["Электрон", "Глюон", "Гравитон", "Мюон"], answer: 2 },
    { q: "Что такое бозон Хиггса?", options: ["Вид газа", "Частица, придающая массу другим", "Лунный камень", "Бозон, создающий антивещество"], answer: 1 },
    { q: "Какой из этих принципов связан с невозможностью точно измерить координату и импульс частицы?", options: ["Принцип суперпозиции", "Принцип неопределённости Гейзенберга", "Принцип Архимеда", "Закон Ома"], answer: 1 },
    { q: "Что происходит с временем при приближении к чёрной дыре?", options: ["Оно ускоряется", "Оно замедляется", "Оно исчезает", "Оно становится отрицательным"], answer: 1 },
    { q: "Что такое теория струн?", options: ["Музыкальная теория", "Теория, в которой элементарные частицы — крошечные струны", "Астрономическая карта", "Модель планетной орбиты"], answer: 1 },
    { q: "Что может быть аннигилировано с электроном?", options: ["Протон", "Нейтрон", "Позитрон", "Кварк"], answer: 2 },
    { q: "Какая сила самая слабая, но действует на огромных расстояниях?", options: ["Электромагнитная", "Ядерная сильная", "Слабая", "Гравитационная"], answer: 3 },
    { q: "Как называется состояние, когда вещество охлаждено почти до абсолютного нуля и ведёт себя как одно квантовое целое?", options: ["Газ Ньютона", "Конденсат Бозе — Эйнштейна", "Квантовая пена", "Плазма Хокинга"], answer: 1 }
  ];

  let questionSet = [];
  let score = 0;
  let time = 10;
  let timer;
  let currentQuestion;
  let nickname = "";
  let isAnswerProcessing = false;
  let scoreChecksum = 0;
  const maxLogLines = 10;

  const nicknameInput = document.getElementById("nickname-input");
  const nicknameDisplay = document.getElementById("nickname-display");
  const questionDiv = document.getElementById("question");
  const optionsDiv = document.getElementById("options");
  const scoreSpan = document.getElementById("score-value");
  const timeSpan = document.getElementById("time-left");
  const logList = document.getElementById("log-list");

  // Форматирование даты и времени
  function formatDateTime() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  }

  // Инициализация логов
  function initLogs() {
    const savedLogs = JSON.parse(localStorage.getItem("gameLogs") || "[]");
    logList.innerHTML = "";
    savedLogs
      .filter(log => typeof log === "string" && log.match(/^\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\]\s.+\sзаработал\s\d+\sочков!$/))
      .slice(-maxLogLines)
      .forEach(log => {
        const li = document.createElement("li");
        li.textContent = log;
        logList.appendChild(li);
      });
  }

  // Сохранение логов
  function saveLogs() {
    const logs = Array.from(logList.children).map(li => li.textContent);
    localStorage.setItem("gameLogs", JSON.stringify(logs));
  }

  // Обновление счета с проверкой
  function updateScore(value) {
    if (value < 0 || value !== Math.floor(value) || value !== scoreChecksum + 1) {
      gameOver();
      return;
    }
    score = value;
    scoreChecksum = value;
    scoreSpan.textContent = score;
  }

  // Обнаружение DevTools
  function detectDevTools() {
    let devtoolsOpen = false;
    const threshold = 160; // Порог изменения размера окна

    // Проверка изменения размера окна
    const checkWindowSize = () => {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        devtoolsOpen = true;
        gameOver();
      }
    };

    // Проверка через console
    const consoleCheck = () => {
      let start = performance.now();
      console.profile('test');
      console.profileEnd('test');
      if (performance.now() - start > 100) {
        devtoolsOpen = true;
        gameOver();
      }
    };

    window.addEventListener('resize', checkWindowSize);
    setInterval(consoleCheck, 1000);
  }

  function startGame() {
    nickname = nicknameInput.value.trim();
    if (nickname === "") {
      alert("Введите никнейм");
      return;
    }

    score = 0;
    scoreChecksum = 0;
    time = 10;
    questionSet = [...questionSetOriginal];
    updateScore(0);

    document.getElementById("nickname-container").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("game-over").style.display = "none";
    nicknameDisplay.textContent = `Игрок: ${nickname}`;
    detectDevTools(); // Запускаем обнаружение DevTools
    nextQuestion();
  }

  function nextQuestion() {
    clearInterval(timer);
    isAnswerProcessing = false;
    time = 15; // Устанавливаем время 10 секунд для каждого вопроса

    if (questionSet.length === 0) {
      gameOver();
      return;
    }

    const index = Math.floor(Math.random() * questionSet.length);
    currentQuestion = questionSet[index];
    questionSet.splice(index, 1);

    questionDiv.textContent = currentQuestion.q;
    optionsDiv.innerHTML = "";

    currentQuestion.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(idx, btn);
      optionsDiv.appendChild(btn);
    });

    timeSpan.textContent = time.toFixed(1);
    startTimer();
  }

  function startTimer() {
    let remaining = time;
    timeSpan.textContent = remaining.toFixed(1);

    timer = setInterval(() => {
      remaining -= 0.1;
      timeSpan.textContent = remaining.toFixed(1);

      if (remaining <= 0) {
        clearInterval(timer);
        gameOver();
      }
    }, 100);
  }

  function checkAnswer(selected, btn) {
    if (isAnswerProcessing) return;
    isAnswerProcessing = true;

    clearInterval(timer);

    const allButtons = optionsDiv.querySelectorAll("button");
    allButtons.forEach(b => b.disabled = true);

    if (selected === currentQuestion.answer) {
      updateScore(score + 1);

      setTimeout(() => {
        nextQuestion();
      }, 500);
    } else {
      gameOver();
    }
  }

  function gameOver() {
    clearInterval(timer);
    document.getElementById("game-container").style.display = "none";
    document.getElementById("game-over").style.display = "block";
    document.getElementById("final-score").textContent = `${nickname}, ваш результат: ${score} очков`;
    addLog(`[${formatDateTime()}] ${nickname} заработал ${score} очков!`);
    initLogs();
  }

  function retry() {
    // Сбрасываем игровые переменные
    score = 0;
    scoreChecksum = 0;
    time = 10;
    questionSet = [...questionSetOriginal];
    isAnswerProcessing = false;
    currentQuestion = null;
    clearInterval(timer);

    // Обновляем интерфейс
    updateScore(0);
    nicknameInput.value = "";
    document.getElementById("nickname-container").style.display = "block";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("game-over").style.display = "none";
  }

  function addLog(text) {
    const li = document.createElement("li");
    li.textContent = text;
    logList.appendChild(li);

    while (logList.children.length > maxLogLines) {
      logList.removeChild(logList.firstChild);
    }

    saveLogs();
  }

  window.startGame = startGame;
  window.retry = retry;

  document.addEventListener("DOMContentLoaded", initLogs);
})();
