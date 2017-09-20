$(function () {
    let getAmicaBasic = (url) => {
        return axios.get(url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    let getAmicaLunch = (url) => {
        return axios.get(url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    let isItOpen = () => {
        let now = new Date();
        let hours = now.getHours() + 1,
            minutes = now.getMinutes(),
            $el = $('<p class = "amica__top-center__restaurant-info__isOpen"></p>');
        
        //10:30am-2.00pm and 4:00pm-6:00pm
        if (hours == 10) {
            if ((minutes >= 30 && minutes <=59)) {
                $el.text('OPEN!');
            } else $el.text('CLOSED!');
        } else if (hours >= 11 && hours < 14) {
            $el.text('OPEN!');
        }

        $el.insertAfter('.amica__top-center__restaurant-info__time');
    };

    let addReturnButton = () => {
        let $footer = $(`
        <div class = 'footer'>
            <div class = 'footer--absolute'>
                <a class = 'footer__button-amica'>Go Back</a>    
            </div>
        </div>
    `);
        $('.amica--width-100').append($footer);
    }

    let todaysFormattedDate = (isMonthStartWithZero) => {
        let d = new Date(),
            curr_date = d.getDate(),
            curr_month = d.getMonth() + 1,
            curr_year = d.getFullYear();
        if (isMonthStartWithZero && curr_month < 10) {
            curr_month = '0' + curr_month;
        }
        let todaysDate = `${curr_year}-${curr_month}-${curr_date}`;
        return todaysDate;
    };

    let addCSSForInactiveDays = () => {
        let day = new Date().getDay();
        if (day == 0) {
            day = 6;
        } else day -= 1

        let $activeDay = $('.row > div').eq(day);
        $activeDay.css({
            'opacity': '1',
            'border': '1px solid #090'
        });
    };

    //get buttons
    let buttons = function () {
        let $amicaHomeButton = $('.amica__center-center__button');
        let $haagaHomeButton = $('.haaga__center-center__button');

        return {
            $amicaHome: $amicaHomeButton,
            $haagaHome: $haagaHomeButton
        }
    }();

    let $amica = function () {
        let container = $('.amica'),
            center = $('.amica__center-center'),
            center_logo = $('.amica__center-center__logo');

        return {
            container: container,
            center: center,
            center_logo: center_logo
        }
    }();

    let $haaga = function () {
        let container = $('.haaga'),
            center = $('.haaga__center-center'),
            center_logo = $('.haaga__center-center__logo');

        return {
            container: container,
            center: center,
            center_logo: center_logo
        }
    }();

    //defining variables
    let today = todaysFormattedDate(false);

    let buttonsCB = function () {
        let amicaHomeButtonClicked = (event) => {
            event.preventDefault();

            $amica.container.removeClass('amica--width-50').addClass('amica--width-100');
            $haaga.container.removeClass('haaga--width-50').addClass('haaga--width-0');
            
            $amica.center.removeClass('amica__center-center').addClass('amica__top-center');
            $amica.center_logo.removeClass('amica__center-center__logo').addClass('amica__top-center__logo');

            buttons.$amicaHome.fadeOut(0);

            getAmicaBasic('http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en')
                .then((restaurant) => {
                    let $amica__top_center__restaurant_info =
                        $(`<div class="amica__top-center__restaurant-info">
                            <h1 class="amica__top-center__restaurant-info__name">${restaurant.RestaurantName}</h1>
                            <p class="amica__top-center__restaurant-info__link"><a href="${restaurant.RestaurantUrl}" target="_blank">Website</a></p>
                        </div>`);

                    $('.amica__top-center').append($amica__top_center__restaurant_info);

                    let $restaurantInfo = $('.amica__top-center__restaurant-info');
                    let $time = $('<p class="amica__top-center__restaurant-info__time">Closed!</p>');

                    $restaurantInfo.append($time);
                    let todaysDate = todaysFormattedDate(true);

                    //loop through weekly menus
                    restaurant.MenusForDays.forEach((element, index) => {
                        if (element.Date.search(todaysDate) != -1) { // search today's meal
                            $time.text(element.LunchTime); // show today's meal
                            isItOpen(); // check if restaurant open and insert paragraph
                        }
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });

            getAmicaLunch(`http://www.amica.fi/api/restaurant/menu/week?language=en&restaurantPageId=6143&weekDate=${today}`)
                .then(data => {
                    let $row = $('<div class="row row__small row__medium row__large"></div>');
                    //loops through weekly meals
                    data.LunchMenus.forEach((element) => {
                        //creates columns by size (12-6-3)
                        let $column = $('<div class="row__small-12 row__medium-6 row__large-3"</div>');

                        //Checks if it's weekend!
                        if (element.Html) {
                            $column.append(`<h3>${element.DayOfWeek} (${element.Date})</h3>`, element.Html);
                        } else { //if it's not weekend then insert 'restaurant closed' tag!
                            $column.append(`<h3>${element.DayOfWeek} (${element.Date})</h3>`, '<p>The Restaurant Closed!</p>');
                        }
                        $row.append($column);
                        $amica.container.append($row);
                    })
                    //remove the attritube that came from Amica API
                    $('.amica td').removeAttr('width valign');
                    //add style for past or future days
                    addCSSForInactiveDays();
                    //insert 'back to home' button
                    addReturnButton();
                })
        };

        let haagaHomeButtonClicked = (event) => {
            event.preventDefault();

            $amica.container.removeClass('amica--width-50').addClass('amica--width-0');
            $haaga.container.removeClass('haaga--width-50').addClass('amica--width-100');

            $haaga.center.removeClass('haaga__center-center').addClass('haaga__top-center');
            $haaga.center_logo.removeClass('haaga__center-center__logo').addClass('haaga__top-center__logo');

            buttons.$haagaHome.addClass('haaga__center-center__button-hide');
        }

        return {
            amicaHomeButton: amicaHomeButtonClicked,
            haagaHomeButton: haagaHomeButtonClicked
        }
    }();

    buttons.$amicaHome.on('click', buttonsCB.amicaHomeButton);
    buttons.$haagaHome.on('click', buttonsCB.haagaHomeButton);


    $amica.container.on('click', '.footer__button-amica', () => {
        $amica.container.removeClass('amica--width-100').addClass('amica--width-50');
        let $amica__top_center = $('.amica__top-center'),
            $amica__top_center__logo = $('.amica__top-center__logo');

        $amica__top_center.removeClass('amica__top-center').addClass('amica__center-center');
        $amica__top_center__logo.removeClass('amica__top-center__logo').addClass('amica__center_center__logo');

        $haaga.container.removeClass('haaga--width-0').addClass('haaga--width-50');

        $('.footer').remove();
        $('.row').remove();
        $('.amica__top-center__restaurant-info').remove();

        buttons.$amicaHome.fadeIn(0);
    });

});