document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных
    let calendar;
    let currentLessonId = null;
    let lessons = JSON.parse(localStorage.getItem('teacherLessons')) || [];
    let studentList = ['Иванов А.', 'Петрова М.', 'Сидоров Д.', 'Кузнецова Е.', 'Смирнов В.', 'Федорова А.'];
    
    // Инициализация календаря
    initCalendar();
    
    // Обработчики событий
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelLessonBtn').addEventListener('click', closeModal);
    document.getElementById('saveLessonBtn').addEventListener('click', saveLesson);
    document.getElementById('deleteLessonBtn').addEventListener('click', deleteLesson);
    document.getElementById('addStudentBtn').addEventListener('click', addStudentRow);
    
    // Закрытие модального окна при клике на фон
    document.getElementById('lessonModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Инициализация строк учеников
    initStudentRows();
    
    // Функция инициализации календаря
    function initCalendar() {
        const calendarEl = document.getElementById('calendar');
        
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: window.innerWidth < 768 ? 'timeGridDay' : 'dayGridMonth',
            locale: 'ru',
            firstDay: 1, // Понедельник - первый день недели
            dayMaxEvents: 2, // Максимум событий в ячейке до появления "+ещё"
            dayMaxEventRows: true, // Ограничить количество строк событий
            headerToolbar: {
                left: window.innerWidth < 768 ? 'dayGridMonth,timeGridDay' : 'prev,next today',
                center: 'title',
                right: window.innerWidth < 768 ? 'prev,next' : 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            slotMinTime: '08:00', // Начало времени
            slotMaxTime: '20:00', // Конец времени
            eventTimeFormat: { hour: '2-digit', minute: '2-digit', omitZeroMinute: false },
            moreLinkClick: 'popover', // При клике на "+ещё" показывать всплывающее окно
            buttonText: {
                today: 'Сегодня',
                month: 'Месяц',
                week: 'Неделя',
                day: 'День'
            },
            height: 'auto', // Автоматическая высота
            contentHeight: 'auto', // Автоматическая высота контента
            expandRows: true, // Растягивать строки по высоте
            stickyHeaderDates: true,
            allDayText: 'Весь день',
            weekText: 'Нед.',
            noEventsText: 'Нет уроков для отображения',
            moreLinkText: 'ещё',
            navLinks: true,
            editable: true,
            dayMaxEvents: true,
            longPressDelay: 500, // Задержка в миллисекундах
            eventLongPressDelay: 500,
            selectLongPressDelay: 500,
            events: lessons.map(lesson => ({
                id: lesson.id,
                title: lesson.topic,
                start: lesson.dateTime,
                end: lesson.endTime || addHours(lesson.dateTime, 1),
                extendedProps: {
                    type: lesson.type,
                    notes: lesson.notes,
                    students: lesson.students
                },
                backgroundColor: getLessonColor(lesson.type),
                borderColor: getLessonColor(lesson.type),
                textColor: 'white'
            })),
            windowResize: function(view) {
                // Корректируем панель инструментов, но не удаляем кнопки видов
                if (window.innerWidth < 768) {
                    calendar.setOption('headerToolbar', {
                        left: 'prev,next',
                        center: 'title',
                        right: 'dayGridMonth,timeGridDay' // Оставляем как минимум две кнопки
                    });
                } else {
                    calendar.setOption('headerToolbar', {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    });
                }
                calendar.updateSize();
            },
            dateClick: function(info) {
                openModal(null, info.dateStr);
            },
            eventClick: function(info) {
                openModal(info.event.id);
            },
            eventDrop: function(info) {
                updateLessonDate(info.event.id, info.event.start);
            },
            eventResize: function(info) {
                updateLessonEndTime(info.event.id, info.event.end);
            },
            moreLinkContent: function(args) {
                return { html: '+' + args.num + ' ещё' };
            }
        });
        
        calendar.render();

        // Ресайз календаря при изменении размера окна
        window.addEventListener('resize', function() {
            calendar.updateSize();
        });
    }
    
    // Функция открытия модального окна
    function openModal(lessonId = null, dateStr = null) {
        const modal = document.getElementById('lessonModal');
        modal.style.display = 'flex';
        
        if (lessonId) {
            // Режим редактирования
            const lesson = lessons.find(l => l.id === lessonId);
            if (lesson) {
                currentLessonId = lessonId;
                document.getElementById('modalTitle').textContent = 'Редактирование урока';
                document.getElementById('lessonTopic').value = lesson.topic;
                
                // Разделяем дату и время для редактирования
                const lessonDate = new Date(lesson.dateTime);
                document.getElementById('lessonDate').value = lessonDate.toISOString().split('T')[0];
                document.getElementById('lessonTime').value = 
                    lessonDate.getHours().toString().padStart(2, '0') + ':' + 
                    lessonDate.getMinutes().toString().padStart(2, '0');
                
                document.getElementById('lessonType').value = lesson.type;
                document.getElementById('lessonNotes').value = lesson.notes || '';
                
                // Заполнение данных учеников
                renderStudentRows(lesson.students || []);
                
                document.getElementById('deleteLessonBtn').style.display = 'block';
            }
        } else {
            // Режим добавления
            currentLessonId = null;
            document.getElementById('modalTitle').textContent = 'Добавление урока';
            document.getElementById('lessonForm').reset();
            
            // Установка даты
            if (dateStr) {
                // Если кликнули на дату в календаре
                document.getElementById('lessonDate').value = dateStr;
            } else {
                // Если открыли другим способом
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('lessonDate').value = today;
            }
            
            // Время по умолчанию - 09:00
            document.getElementById('lessonTime').value = '09:00';
            
            // Сброс данных учеников
            renderStudentRows(studentList.map(name => ({
                name: name,
                attendance: true,
                grade: ''
            })));
            
            document.getElementById('deleteLessonBtn').style.display = 'none';
        }
    }
    
    // Функция закрытия модального окна
    function closeModal() {
        document.getElementById('lessonModal').style.display = 'none';
    }
    
    // Функция сохранения урока
    function saveLesson() {
        const topic = document.getElementById('lessonTopic').value.trim();
        const date = document.getElementById('lessonDate').value;
        const time = document.getElementById('lessonTime').value;
        const type = document.getElementById('lessonType').value;
        const notes = document.getElementById('lessonNotes').value;
        
        if (!topic) {
            alert('Пожалуйста, введите тему урока');
            return;
        }
        
        // Создаем полную дату и время
        const dateTime = `${date}T${time}`;
        
        // Сбор данных об учениках
        const students = [];
        const studentRows = document.querySelectorAll('.student-row');
        studentRows.forEach(row => {
            const name = row.querySelector('.student-name').value;
            const attendance = row.querySelector('.student-attendance').checked;
            const grade = row.querySelector('.student-grade').value;
            
            if (name) {
                students.push({
                    name: name,
                    attendance: attendance,
                    grade: grade || null
                });
            }
        });
        
        const lessonData = {
            id: currentLessonId || generateId(),
            topic: topic,
            dateTime: dateTime,
            endTime: addHours(dateTime, 1),
            type: type,
            notes: notes,
            students: students,
            createdAt: new Date().toISOString()
        };
        
        if (currentLessonId) {
            // Обновление существующего урока
            const index = lessons.findIndex(l => l.id === currentLessonId);
            if (index !== -1) {
                lessons[index] = {...lessons[index], ...lessonData};
            }
        } else {
            // Добавление нового урока
            lessons.push(lessonData);
        }
        
        // Сохранение в localStorage
        localStorage.setItem('teacherLessons', JSON.stringify(lessons));
        
        // Обновление календаря
        calendar.refetchEvents();

        
        // Закрытие модального окна
        closeModal();
        
        // Показать уведомление
        showNotification('Урок успешно сохранен!', 'success');
    }
    
    // Функция удаления урока
    function deleteLesson() {
        if (!currentLessonId) return;
        
        if (confirm('Вы уверены, что хотите удалить этот урок?')) {
            lessons = lessons.filter(l => l.id !== currentLessonId);
            localStorage.setItem('teacherLessons', JSON.stringify(lessons));
            calendar.refetchEvents();
            closeModal();
            showNotification('Урок удален', 'warning');
        }
    }

    
    // Вспомогательные функции
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function getLessonColor(type) {
        const colors = {
            '1': '#4f46e5', // Математика
            '2': '#10b981', // Физика
            '3': '#f59e0b', // Химия
            '4': '#8b5cf6'  // Информатика
        };
        return colors[type] || '#4361ee';
    }
    
    function formatDateTimeForInput(dateTime) {
        const date = new Date(dateTime);
        return date.toISOString().slice(0, 16);
    }
    
    function addHours(dateTime, hours) {
        const date = new Date(dateTime);
        date.setHours(date.getHours() + hours);
        return date.toISOString();
    }
    
    function updateLessonDate(lessonId, newDate) {
        const lesson = lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson.dateTime = newDate.toISOString();
            localStorage.setItem('teacherLessons', JSON.stringify(lessons));
        }
    }
    
    function updateLessonEndTime(lessonId, endTime) {
        const lesson = lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson.endTime = endTime.toISOString();
            localStorage.setItem('teacherLessons', JSON.stringify(lessons));
        }
    }
    
    function showNotification(message, type = 'info') {
        // Создание уведомления
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background-color: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#4361ee'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Удаление уведомления через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Добавление CSS анимаций
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Функции для работы с учениками
    function initStudentRows() {
        renderStudentRows(studentList.map(name => ({
            name: name,
            attendance: true,
            grade: ''
        })));
    }
    
    function renderStudentRows(students) {
        const container = document.getElementById('studentsContainer');
        container.innerHTML = '';
        
        students.forEach((student, index) => {
            const row = document.createElement('div');
            row.className = 'student-row';
            row.innerHTML = `
                <input type="text" class="form-control student-name" value="${student.name}" placeholder="ФИО ученика">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="student-attendance" id="attendance-${index}" ${student.attendance ? 'checked' : ''}>
                    <label for="attendance-${index}" style="margin: 0;">Присутствовал</label>
                </div>
                <input type="number" class="form-control student-grade" value="${student.grade || ''}" placeholder="Оценка" min="1" max="5">
            `;
            container.appendChild(row);
        });
    }
    
    function addStudentRow() {
        const container = document.getElementById('studentsContainer');
        const index = container.children.length;
        
        const row = document.createElement('div');
        row.className = 'student-row';
        row.innerHTML = `
            <input type="text" class="form-control student-name" placeholder="ФИО ученика">
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" class="student-attendance" id="attendance-${index}" checked>
                <label for="attendance-${index}" style="margin: 0;">Присутствовал</label>
            </div>
            <input type="number" class="form-control student-grade" placeholder="Оценка" min="1" max="5">
        `;
        container.appendChild(row);
    }
});