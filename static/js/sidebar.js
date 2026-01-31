// Основные элементы
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const demoButtons = ['demoBtn1', 'demoBtn2', 'demoBtn3', 'demoBtn4'];

// Текущая активная демо-кнопка
let activeDemoButton = null;

// Функция для открытия/закрытия боковой панели
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    
    // На мобильных устройствах используем оверлей
    if (window.innerWidth <= 768) {
        document.body.classList.toggle('no-scroll');
    } else {
        document.body.classList.toggle('no-scroll');
    }
    
    // Обновляем aria-label
    const isActive = sidebar.classList.contains('active');
    hamburgerBtn.setAttribute('aria-label', isActive ? 'Закрыть меню' : 'Открыть меню');
}

// Функция для закрытия боковой панели
function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    document.body.classList.remove('sidebar-open');
    document.body.classList.remove('no-scroll');
    hamburgerBtn.setAttribute('aria-label', 'Открыть меню');
    
    // Сбрасываем все демо-кнопки
    demoButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.classList.remove('active');
    });
    activeDemoButton = null;
}

// Обработчики для основной кнопки
hamburgerBtn.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Обработчики для демо-кнопок
demoButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем закрытие при клике на кнопку
            
            // Сбрасываем предыдущую активную кнопку
            if (activeDemoButton && activeDemoButton !== this) {
                activeDemoButton.classList.remove('active');
            }
            
            // Переключаем текущую кнопку
            this.classList.toggle('active');
            
            // Обновляем активную кнопку
            if (this.classList.contains('active')) {
                activeDemoButton = this;
            } else {
                activeDemoButton = null;
            }
        });
    }
});

// Закрытие панели при нажатии ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebar();
    }
});

// Закрытие панели при ресайзе (на мобильных устройствах)
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
        document.body.classList.add('sidebar-open');
        document.body.classList.remove('no-scroll');
    } else if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
        document.body.classList.remove('sidebar-open');
        document.body.classList.add('no-scroll');
    }
});

// Добавляем стили для отключения скролла на мобильных
const style = document.createElement('style');
style.textContent = `
    body.no-scroll {
        overflow: hidden;
        position: fixed;
        width: 100%;
    }
    
    @media (max-width: 768px) {
        body.sidebar-open {
            margin-left: 0;
        }
    }
`;
document.head.appendChild(style);