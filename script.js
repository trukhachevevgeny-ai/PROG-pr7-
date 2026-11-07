/* ============================================================
   1. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (из ПР4)
   ============================================================ */
const themeButton = document.getElementById('themeBtn');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeButton) themeButton.textContent = '☀️ Светлая тема';
}

if (themeButton) {
    themeButton.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeButton.textContent = '☀️ Светлая тема';
            localStorage.setItem('theme', 'dark');
        } else {
            themeButton.textContent = '🌙 Тёмная тема';
            localStorage.setItem('theme', 'light');
        }
    });
}

/* ============================================================
   2. ДИНАМИЧЕСКИЙ РЕНДЕРИНГ И ПОИСК (из ПР5)
   ============================================================ */

// Имитация базы данных статей (адаптировано под темы сайта)
let initialArticles = JSON.parse(localStorage.getItem('myBlogPosts')) || [
    {
        id: 1,
        title: "Виды алгоритмических конструкций",
        date: "15 сентября 2026",
        isoDate: "2026-09-15",
        text: "Линейный - вычислительный процесс, при котором все этапы решения задачи выполняются в естественном порядке. Ветвящийся - выбор направления зависит от данных. Циклический - содержащий циклы. Рекурсивный - обращается сам к себе.",
        tags: "#линейный #ветвление #цикл #рекурсия",
        avatar: "А",
        avatarClass: "avatar-gradient-1",
        link: "vidi.html"
    },
    {
        id: 2,
        title: "Методы разработки алгоритмов",
        date: "10 сентября 2026",
        isoDate: "2026-09-10",
        text: "Метод частных целей - сложная задача сводится к последовательности более простых задач. Метод подъёма - начинается с принятия начального предположения или построения начального решения задачи.",
        tags: "#метод #цели #подъём",
        avatar: "B",
        avatarClass: "avatar-gradient-2",
        link: "metodi.html"
    },
    {
        id: 3,
        title: "Программы и ПО",
        date: "05 сентября 2026",
        isoDate: "2026-09-05",
        text: "Программа - это последовательность команд, которую выполняет компьютер в процессе обработки информации.",
        tags: "#программа #ПО #команды",
        avatar: "C",
        avatarClass: "avatar-gradient-3",
        link: "prog.html"
    }
];

const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');

// Функция рендеринга HTML-карточек
function renderArticles(articlesArray) {
    // Очищаем контейнер перед каждым рендером
    postsContainer.innerHTML = '';

    // Если ничего не найдено
    if (articlesArray.length === 0) {
        postsContainer.innerHTML = '<p class="no-results">Ничего не найдено 😔</p>';
        return;
    }

    // Проходим циклом по массиву и генерируем HTML
    articlesArray.forEach(article => {
        const articleHtml = `
            <article class="discussion-item">
                <div class="avatar ${article.avatarClass}">${article.avatar}</div>
                <div class="discussion-content">
                    <div class="discussion-top">
                        <h3><a href="${article.link}">${article.title}</a></h3>
                    </div>
                    <div class="article-text short">
                        <p>${article.text}</p>
                    </div>
                    <footer>
                        <p style="font-size: 0.9rem; color: #1abc9c; margin-bottom: 10px;">Теги: ${article.tags}</p>
                        <button class="read-more-btn">Читать далее</button>
                        <button class="like-btn">❤️ Лайк (<span class="like-count">0</span>)</button>
                    </footer>
                </div>
            </article>
        `;
        postsContainer.insertAdjacentHTML('beforeend', articleHtml);
    });
}

// Запускаем первичный рендер при загрузке
if (postsContainer) {
    renderArticles(initialArticles);
}

// Живой поиск (по заголовку, тексту и тегам)
if (searchInput) {
    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.toLowerCase().trim();

        const filteredArticles = initialArticles.filter(article => {
            const inTitle = article.title.toLowerCase().includes(searchText);
            const inText = article.text.toLowerCase().includes(searchText);
            const inTags = article.tags.toLowerCase().includes(searchText);
            
            // Если найдено хотя бы в одном месте — пропускаем
            return inTitle || inText || inTags;
        });

        renderArticles(filteredArticles);
    });
}

/* ============================================================
   3. ОБРАБОТЧИКИ КЛИКОВ (Лайки и Читать далее) — Делегирование
   ============================================================ */
// Так как статьи создаются динамически, мы вешаем событие на контейнер
if (postsContainer) {
    postsContainer.addEventListener('click', function(e) {
        // Обработка кнопки ЛАЙК
        if (e.target.classList.contains('like-btn') || e.target.closest('.like-btn')) {
            const btn = e.target.closest('.like-btn');
            const countSpan = btn.querySelector('.like-count');
            let currentLikes = parseInt(countSpan.textContent);
            countSpan.textContent = currentLikes + 1;
            btn.style.backgroundColor = '#e74c3c';
            btn.style.color = 'white';
        }

        // Обработка кнопки ЧИТАТЬ ДАЛЕЕ
        if (e.target.classList.contains('read-more-btn') || e.target.closest('.read-more-btn')) {
            const btn = e.target.closest('.read-more-btn');
            // Находим текст статьи (он лежит в блоке .article-text внутри этой же карточки)
            const textBlock = btn.closest('.discussion-content').querySelector('.article-text');
            
            textBlock.classList.toggle('short');
            if (textBlock.classList.contains('short')) {
                btn.textContent = 'Читать далее';
            } else {
                btn.textContent = 'Свернуть';
            }
        }
    });
}
/* ============================================================
   4. ФОРМА ДОБАВЛЕНИЯ СТАТЕЙ (ПР7)
   ============================================================ */
const addForm = document.getElementById('addArticleForm');
const postTitleInput = document.getElementById('postTitle');
const postTextInput = document.getElementById('postText');
const postTagsInput = document.getElementById('postTags');

if (addForm) {
    addForm.addEventListener('submit', function (event) {
        // Отменяем перезагрузку страницы
        event.preventDefault();

        // Собираем данные
        const titleValue = postTitleInput.value.trim();
        const textValue = postTextInput.value.trim();
        const tagsValue = postTagsInput.value.trim() || "#алгоритмы";

        // Валидация
        if (titleValue.length < 5) {
            alert('Ошибка: Заголовок статьи должен быть не короче 5 символов!');
            return;
        }
        if (textValue.length < 20) {
            alert('Ошибка: Описание слишком короткое. Расскажите подробнее (минимум 20 символов)!');
            return;
        }

        // Дата
        const today = new Date();
        const formattedDate = today.toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        const isoDate = today.toISOString().split('T')[0];

        // Новая статья
        const newArticle = {
            id: initialArticles.length + 1,
            title: titleValue,
            date: formattedDate,
            isoDate: isoDate,
            text: textValue,
            tags: tagsValue,
            avatar: titleValue.charAt(0).toUpperCase(),
            avatarClass: 'avatar-gradient-' + ((initialArticles.length % 3) + 1),
            link: '#'
        };

        // Добавляем в начало массива
        initialArticles.unshift(newArticle);

        // Сохраняем в память браузера
        localStorage.setItem('myBlogPosts', JSON.stringify(initialArticles));

        // Перерисовываем список
        renderArticles(initialArticles);

        // Очищаем форму
        addForm.reset();
    });
}