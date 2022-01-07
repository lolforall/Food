"use strict";

window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2021-12-31';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >=0 && num < 10) {
           return `0${num}`; 
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        updateClock();
        
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalOpen = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
// вариант через стили
    // function showModal() {
    //     modal.style.display = 'block';
    // }

// вариант через добавленные классы для табов
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        // modal.classList.toggle('show');
        document.body.style.overflow = 'hidden'; // запрет скрола при открытом окне
        clearInterval(modalTimerId); // обнуление интервала если пользователь открыл окно сам
    }

    function closeModal() {
        // modal.classList.toggle('show');
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; 
    }

    modalOpen.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // закрытия модалки при клике на оверфлоу
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

// закрытие окна по нажатию клавиши
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 15000); // открытие модалки через 15 сек после загр страницы

// вызов модалки, когда пользователь проскролил сайт до конца
// логика: когда сумма высот отлистаной части сайта (сверху) + видимого клиентом контента станет больше либо равной
// полной высоте скролла всей страницы - значит пользователь долистал сайт до конца => показать модалку
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); // удалить обработчик после 1-го выполнения
        }
    }

    window.addEventListener('scroll', showModalByScroll);


    // cards

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price *= this.transfer;
        }

        render() {
            const element = document.createElement('div');
            // добавление значение класса по-умолчанию в случае если его не передали в аргументах
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }       
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item',
        'big'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню "Премиум"',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        16,
        '.menu .container',
        'menu__item'
    ).render();

    // Forms
    
    // получаем все формы
    const forms = document.querySelectorAll('form');
    

    // объект с сообщениями для пользователя
    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Мы свяжемся с Вами в ближайшее время',
        failure: 'Что-то пошло не так...'
    };

    // перебор форм и вызов функции с отправкой данных из форм на сервер
    forms.forEach(item => {
        postData(item);
    });

    // функция отправки данных
    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // создание и размещение блока с сообщением пользователю
            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);
            // создание POST запроса
            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            // создание объекта FormData и помещение в него данных из формы
            // при использовании XMLHttpRequest+FormData ЗАГОЛОВОК НЕ УСТАНАВЛИВАЕТСЯ ВРУЧНУЮ
            // request.setRequestHeader('Content-type', 'multipart/form-data'); <---- НЕ НУЖНО
            // При работе с форматом JSON заголовок НУЖЕН --->
            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            // преобразование FormData в объект и затем в JSON
            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json); // при работе с FormData передаем сюда const formData

            // сообщения об успешной отправке или ошибке
            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    form.reset(); // сброс формы после успешной отправки данных
                    statusMessage.remove();
                    /* setTimeout(() => { // удалить сообщение дня пользователя через 2 секунды
                        statusMessage.remove();
                    }, 2000); */
                } else {
                    showThanksModal(message.failure);
                }
            });
        });
    }

    // замена сообщений для пользователя другим модальным окном с сообщением
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 5000);
    }
});