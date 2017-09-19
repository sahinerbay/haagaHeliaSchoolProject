'use strict';

var getAmicaBasic = function getAmicaBasic(url) {
    return axios.get(url).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
};

var getAmicaLunch = function getAmicaLunch(url) {
    return axios.get(url).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
};

var isItOpen = function isItOpen() {
    var now = new Date();
    var hours = now.getHours() + 1,
        minutes = now.getMinutes(),
        $el = $('<p class = "amica__top-center__restaurant-info__isOpen"></p>');

    if (hours >= 10 && minutes >= 30 && hours < 14 && minutes <= 59 || hours >= 16 & minutes >= 0 && hours < 18 && minutes <= 59) {
        $el.text('OPEN!');
    } else $el.text('CLOSED!');

    $el.insertAfter('.amica__top-center__restaurant-info__time');
};

var addReturnButton = function addReturnButton() {
    var $footer = $('\n        <div class = \'footer\'>\n            <div class = \'footer--absolute\'>\n                <a class = \'footer__button-amica\'>Go Back</a>    \n            </div>\n        </div>\n    ');
    $('.amica--width-100').append($footer);
};

var todaysFormattedDate = function todaysFormattedDate(isMonthStartWithZero) {
    var d = new Date(),
        curr_date = d.getDate(),
        curr_month = d.getMonth() + 1,
        curr_year = d.getFullYear();
    if (isMonthStartWithZero && curr_month < 10) {
        curr_month = '0' + curr_month;
    }
    var todaysDate = curr_year + '-' + curr_month + '-' + curr_date;
    return todaysDate;
};

var addCSSForInactiveDays = function addCSSForInactiveDays() {
    var day = new Date().getDay();
    if (day == 0) {
        day = 6;
    } else day -= 1;

    var $activeDay = $('.row > div').eq(day);
    $activeDay.css({
        'opacity': '1',
        'border': '1px solid #090'
    });
};

$(function () {
    //defining variables
    var $amicaButton = $('.amica__center-center__button'),
        $amicaContainer = $('.amica'),
        today = todaysFormattedDate(false);

    var amicaButtonClicked = function amicaButtonClicked(event) {
        //prevent default action
        event.preventDefault();

        //widen amica container to 100%
        $amicaContainer.removeClass('amica--width-50').addClass('amica--width-100');

        //change from amica 50% center-center to 100% top-center
        $('.amica__center-center').removeClass('amica__center-center').addClass('amica__top-center');
        $('.amica__center-center__logo').removeClass('amica__center-center__logo').addClass('amica__top-center__logo');

        //hide elements
        $('.haaga').fadeOut(1000);
        $amicaButton.fadeOut(0);

        getAmicaBasic('http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en').then(function (restaurant) {
            var $amica__top_center__restaurant_info = $('<div class="amica__top-center__restaurant-info">\n                            <h1 class="amica__top-center__restaurant-info__name">' + restaurant.RestaurantName + '</h1>\n                            <p class="amica__top-center__restaurant-info__link"><a href="' + restaurant.RestaurantUrl + '" target="_blank">Website</a></p>\n                        </div>');

            $('.amica__top-center').append($amica__top_center__restaurant_info);

            var $restaurantInfo = $('.amica__top-center__restaurant-info');
            var $time = $('<p class="amica__top-center__restaurant-info__time">Closed!</p>');

            $restaurantInfo.append($time);
            var todaysDate = todaysFormattedDate(true);

            //loop through weekly menus
            restaurant.MenusForDays.forEach(function (element, index) {
                if (element.Date.search(todaysDate) != -1) {
                    // search today's meal
                    $time.text(element.LunchTime); // show today's meal
                    isItOpen(); // check if restaurant open and insert paragraph
                }
            });
        }).catch(function (error) {
            console.log(error);
        });

        getAmicaLunch('http://www.amica.fi/api/restaurant/menu/week?language=en&restaurantPageId=6143&weekDate=' + today).then(function (data) {
            var $row = $('<div class="row row__small row__medium row__large"></div>');
            //loops through weekly meals
            data.LunchMenus.forEach(function (element) {
                //creates columns by size (12-6-3)
                var $column = $('<div class="row__small-12 row__medium-6 row__large-3"</div>');

                //Checks if it's weekend!
                if (element.Html) {
                    $column.append('<h3>' + element.DayOfWeek + ' (' + element.Date + ')</h3>', element.Html);
                } else {
                    //if it's not weekend then insert 'restaurant closed' tag!
                    $column.append('<h3>' + element.DayOfWeek + ' (' + element.Date + ')</h3>', '<p>The Restaurant Closed!</p>');
                }
                $row.append($column);
                $amicaContainer.append($row);
            });
            //remove the attritube that came from Amica API
            $('.amica td').removeAttr('width valign');
            //add style for past or future days
            addCSSForInactiveDays();
            //insert 'back to home' button
            addReturnButton();
        });
    };

    $amicaButton.on('click', amicaButtonClicked);

    $amicaContainer.on('click', '.footer__button-amica', function () {
        $amicaContainer.removeClass('amica--width-100').addClass('amica--width-50');
        var $amica__top_center = $('.amica__top-center'),
            $amica__top_center__logo = $('.amica__top-center__logo');

        $amica__top_center.removeClass('amica__top-center').addClass('amica__center-center');
        $amica__top_center__logo.removeClass('amica__top_center__logo').addClass('amica__center_center__logo');
        $('.haaga').fadeIn(1000);
        $('.footer').remove();
        $('.row').remove();
        $('.amica__top-center__restaurant-info').remove();
        $amicaButton.fadeIn(0);
    });
});