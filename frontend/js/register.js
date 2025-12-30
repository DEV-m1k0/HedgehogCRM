// Переменные для управления состоянием
let currentStep = 1;
let selectedType = 'parent';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Показать дополнительные поля для родителя по умолчанию
    showAdditionalFields('parent');
    
    // Настройка обработчиков событий для выбора типа регистрации
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', function() {
            // Удаляем выбранный класс у всех карточек
            document.querySelectorAll('.type-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Добавляем выбранный класс текущей карточке
            this.classList.add('selected');
            
            // Сохраняем выбранный тип
            selectedType = this.getAttribute('data-type');
            
            // Показываем соответствующие дополнительные поля
            showAdditionalFields(selectedType);
        });
    });
    
    // Навигация по шагам
    document.getElementById('nextStep1').addEventListener('click', goToStep2);
    document.getElementById('prevStep2').addEventListener('click', goToStep1);
    
    // Переключение видимости паролей
    document.getElementById('togglePassword').addEventListener('click', function() {
        togglePasswordVisibility('password', this);
    });
    
    document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
        togglePasswordVisibility('confirmPassword', this);
    });
    
    // Проверка надежности пароля
    document.getElementById('password').addEventListener('input', checkPasswordStrength);
    
    // Отправка формы регистрации
    document.getElementById('registrationForm').addEventListener('submit', submitRegistrationForm);

});

// Функция показа дополнительных полей в зависимости от типа регистрации
function showAdditionalFields(type) {
    // Скрываем все дополнительные поля
    document.querySelectorAll('.additional-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    // Показываем только нужные поля
    document.getElementById(`${type}-fields`).style.display = 'block';
    
    // Настраиваем обязательные поля
    if (type === 'student') {
        document.getElementById('studentAge').required = true;
    } else if (type === 'employee') {
        document.getElementById('studentAge').required = false;
    } else {
        document.getElementById('studentAge').required = false;
    }
}

// Функция переключения видимости пароля
function togglePasswordVisibility(inputId, button) {
    const passwordInput = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Функция проверки надежности пароля
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    // Сброс
    strengthFill.className = 'strength-fill';
    strengthFill.style.width = '0%';
    strengthText.textContent = 'Надежность пароля: не указан';
    
    if (password.length === 0) return;
    
    let strength = 0;
    let text = '';
    
    // Проверка длины
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    
    // Проверка на наличие строчных букв
    if (/[a-zа-я]/.test(password)) strength += 15;
    
    // Проверка на наличие заглавных букв
    if (/[A-ZА-Я]/.test(password)) strength += 15;
    
    // Проверка на наличие цифр
    if (/\d/.test(password)) strength += 15;
    
    // Проверка на наличие специальных символов
    if (/[^A-Za-zА-Яа-я0-9]/.test(password)) strength += 15;
    
    // Определение уровня надежности
    if (strength < 25) {
        strengthFill.className = 'strength-fill strength-weak';
        text = 'Слабый';
    } else if (strength < 50) {
        strengthFill.className = 'strength-fill strength-fair';
        text = 'Средний';
    } else if (strength < 75) {
        strengthFill.className = 'strength-fill strength-good';
        text = 'Хороший';
    } else {
        strengthFill.className = 'strength-fill strength-strong';
        text = 'Надежный';
    }
    
    strengthFill.style.width = `${strength}%`;
    strengthText.textContent = `Надежность пароля: ${text}`;
}

// Навигация по шагам
function goToStep2() {
    // Обновляем индикатор шагов
    updateStepIndicator(2);
    
    // Переходим к шагу 2
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    currentStep = 2;
}

function goToStep1() {
    // Обновляем индикатор шагов
    updateStepIndicator(1);
    
    // Переходим к шагу 1
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    currentStep = 1;
}

// Обновление индикатора шагов
function updateStepIndicator(step) {
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active', 'completed');
        
        const stepNumber = parseInt(stepEl.getAttribute('data-step'));
        
        if (stepNumber < step) {
            stepEl.classList.add('completed');
        } else if (stepNumber === step) {
            stepEl.classList.add('active');
        }
    });
}

// Валидация формы
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreement = document.getElementById('agreement').checked;
    
    let isValid = true;
    
    // Сброс предыдущих ошибок
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    // Валидация имени
    if (firstName.length < 2) {
        document.getElementById('firstName-error').style.display = 'block';
        document.getElementById('firstName').classList.add('error');
        isValid = false;
    }
    
    // Валидация фамилии
    if (lastName.length < 2) {
        document.getElementById('lastName-error').style.display = 'block';
        document.getElementById('lastName').classList.add('error');
        isValid = false;
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email-error').style.display = 'block';
        document.getElementById('email').classList.add('error');
        isValid = false;
    }
    
    // Валидация телефона (упрощенная)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
    if (cleanPhone.length < 10) {
        document.getElementById('phone-error').style.display = 'block';
        document.getElementById('phone').classList.add('error');
        isValid = false;
    }
    
    // Валидация пароля
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Zа-яА-Я]/.test(password)) {
        document.getElementById('password-error').style.display = 'block';
        document.getElementById('password').classList.add('error');
        isValid = false;
    }
    
    // Проверка совпадения паролей
    if (password !== confirmPassword) {
        document.getElementById('confirm-error').style.display = 'block';
        document.getElementById('confirmPassword').classList.add('error');
        isValid = false;
    }
    
    // Проверка согласия с условиями
    if (!agreement) {
        alert('Для регистрации необходимо принять условия пользовательского соглашения');
        isValid = false;
    }
    
    return isValid;
}

// Отправка формы регистрации
function submitRegistrationForm(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const email = document.getElementById('email').value.trim();
    const submitButton = document.getElementById('registerButton');
    const originalText = submitButton.innerHTML;
    
    // Имитация отправки данных на сервер
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
    submitButton.disabled = true;
    
    // Имитация задержки сервера
    setTimeout(() => {
        // В реальном приложении здесь будет AJAX запрос к серверу
        console.log('Регистрационные данные:', {
            type: selectedType,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: email,
            phone: document.getElementById('phone').value
        });
        
        // Сброс кнопки (на случай возврата)
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // В реальном приложении: window.location.href = 'dashboard.html';
        window.location.href = 'login.html';
    }, 2000);
}