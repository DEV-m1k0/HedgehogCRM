/**
 * Анимации для модуля клиентов
 * HEDGEHOG CRM System
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация анимаций
    initClientsAnimations();
});

function initClientsAnimations() {
    // Анимация появления карточек
    const clientCards = document.querySelectorAll('.client-card');
    clientCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    // Анимация модальных окон
    initModalAnimations();
    
    // Анимация вкладок
    initTabsAnimation();
    
    // Анимация загрузки
    initLoadingAnimation();
    
    // Анимация валидации форм
    initFormValidationAnimation();
}

function initModalAnimations() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const modalContent = modal.querySelector('.modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal);
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        
        // Анимация открытия
        modal.addEventListener('transitionend', () => {
            if (modal.classList.contains('active')) {
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }
        });
    });
    
    // Открытие модального окна
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const modalContent = modal.querySelector('.modal');
            modalContent.style.transform = 'scale(0.9)';
            modalContent.style.opacity = '0';
            modalContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            
            modal.classList.add('active');
            
            setTimeout(() => {
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }, 10);
        }
    };
    
    // Закрытие модального окна
    window.closeModal = function(modal) {
        const modalContent = modal.querySelector('.modal');
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.remove('active');
        }, 300);
    };
}

function initTabsAnimation() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            const allTabs = this.closest('.tabs').querySelectorAll('.tab');
            const allContents = document.querySelectorAll('.tab-content');
            
            // Анимация переключения вкладок
            if (tabContent) {
                // Скрываем все содержимое
                allContents.forEach(content => {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        content.classList.remove('active');
                    }, 150);
                });
                
                // Убираем активный класс со всех вкладок
                allTabs.forEach(t => t.classList.remove('active'));
                
                // Активируем текущую вкладку
                this.classList.add('active');
                
                // Показываем содержимое с анимацией
                setTimeout(() => {
                    tabContent.classList.add('active');
                    setTimeout(() => {
                        tabContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        tabContent.style.opacity = '1';
                        tabContent.style.transform = 'translateY(0)';
                    }, 10);
                }, 150);
            }
        });
    });
}

function initLoadingAnimation() {
    // Анимация загрузки для кнопок
    const buttons = document.querySelectorAll('.btn[data-loading]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.getAttribute('data-loading') === 'true') {
                const originalText = this.innerHTML;
                this.innerHTML = `
                    <span class="loading-spinner"></span>
                    ${this.getAttribute('data-loading-text') || 'Загрузка...'}
                `;
                this.disabled = true;
                
                // Создаем элемент спиннера
                const spinner = this.querySelector('.loading-spinner');
                if (spinner) {
                    spinner.style.display = 'inline-block';
                    spinner.style.width = '12px';
                    spinner.style.height = '12px';
                    spinner.style.border = '2px solid rgba(255,255,255,0.3)';
                    spinner.style.borderRadius = '50%';
                    spinner.style.borderTopColor = '#fff';
                    spinner.style.animation = 'spin 1s linear infinite';
                    spinner.style.marginRight = '8px';
                }
                
                // Через 2 секунды возвращаем исходное состояние (для демо)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    this.setAttribute('data-loading', 'false');
                }, 2000);
            }
        });
    });
    
    // Добавляем стили для спиннера
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .loading-spinner {
                display: inline-block;
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

function initFormValidationAnimation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('.form-control[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                const errorElement = input.nextElementSibling;
                
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.classList.add('show');
                        errorElement.style.animation = 'shake 0.3s ease';
                    }
                } else {
                    input.classList.remove('error');
                    
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.classList.remove('show');
                    }
                }
            });
            
            // Анимация успешной отправки
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        ${submitBtn.getAttribute('data-success-text') || 'Сохранено!'}
                    `;
                    submitBtn.style.background = 'var(--success)';
                    
                    // Возвращаем исходное состояние через 2 секунды
                    setTimeout(() => {
                        submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Сохранить';
                        submitBtn.style.background = '';
                    }, 2000);
                }
            }
        });
        
        // Анимация при фокусе на поле ввода
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    });
    
    // Добавляем стили для анимации ошибок
    if (!document.querySelector('#validation-styles')) {
        const style = document.createElement('style');
        style.id = 'validation-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Утилиты для работы с клиентами
window.ClientsUI = {
    // Переключение режима редактирования
    toggleEditMode: function(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            const isEditMode = card.classList.contains('edit-mode');
            
            if (isEditMode) {
                card.classList.remove('edit-mode');
                card.querySelectorAll('.view-mode').forEach(el => el.style.display = 'block');
                card.querySelectorAll('.edit-mode-field').forEach(el => el.style.display = 'none');
            } else {
                card.classList.add('edit-mode');
                card.querySelectorAll('.view-mode').forEach(el => el.style.display = 'none');
                card.querySelectorAll('.edit-mode-field').forEach(el => el.style.display = 'block');
                
                // Анимация появления полей редактирования
                const editFields = card.querySelectorAll('.edit-mode-field');
                editFields.forEach((field, index) => {
                    field.style.opacity = '0';
                    field.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        field.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        field.style.opacity = '1';
                        field.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }
        }
    },
    
    // Быстрое добавление тега
    addTag: function(clientId, tag) {
        const tagsContainer = document.querySelector(`#${clientId} .tags-container`);
        if (tagsContainer) {
            const newTag = document.createElement('span');
            newTag.className = `tag ${tag.type || ''}`;
            newTag.textContent = tag.text;
            newTag.style.opacity = '0';
            newTag.style.transform = 'scale(0.8)';
            
            tagsContainer.appendChild(newTag);
            
            setTimeout(() => {
                newTag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                newTag.style.opacity = '1';
                newTag.style.transform = 'scale(1)';
            }, 10);
        }
    },
    
    // Фильтрация клиентов
    filterClients: function(filterType) {
        const clientCards = document.querySelectorAll('.client-card');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Обновляем активную кнопку фильтра
        filterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Анимация фильтрации
        clientCards.forEach((card, index) => {
            const shouldShow = filterType === 'all' || card.classList.contains(filterType);
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 30);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    },
    
    // Поиск клиентов
    searchClients: function(searchTerm) {
        const clientCards = document.querySelectorAll('.client-card');
        
        clientCards.forEach((card, index) => {
            const clientName = card.querySelector('.client-name').textContent.toLowerCase();
            const clientEmail = card.querySelector('.client-email')?.textContent?.toLowerCase() || '';
            const clientPhone = card.querySelector('.client-phone')?.textContent?.toLowerCase() || '';
            
            const matches = clientName.includes(searchTerm.toLowerCase()) ||
                           clientEmail.includes(searchTerm.toLowerCase()) ||
                           clientPhone.includes(searchTerm.toLowerCase());
            
            if (matches || searchTerm === '') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 30);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
};