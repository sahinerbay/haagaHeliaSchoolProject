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

    if (((hours >= 10 && minutes >= 30) && (hours < 14 && minutes <= 59)) || ((hours >= 16 & minutes >= 0) && (hours < 18 && minutes <= 59))) {
        $el.text('OPEN!');
    } else $el.text('CLOSED!');

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
}

$(function () {
    //defining variables
    let $amicaButton = $('.amica__center-center__button'),
        $amicaContainer = $('.amica'),
        today = todaysFormattedDate(false);

    let amicaButtonClicked = (event) => {
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
                    if (element.Date.search(todaysDate) != -1) {    // search today's meal
                        $time.text(element.LunchTime);  // show today's meal
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
                    $amicaContainer.append($row);
                })
                //remove the attritube that came from Amica API
                $('.amica td').removeAttr('width valign');
                //add style for past or future days
                addCSSForInactiveDays();
                //insert 'back to home' button
                addReturnButton();
            })
    };

    $amicaButton.on('click', amicaButtonClicked);


    $amicaContainer.on('click', '.footer__button-amica', () => {
        $amicaContainer.removeClass('amica--width-100').addClass('amica--width-50');
        let $amica__top_center = $('.amica__top-center'),
            $amica__top_center__logo = $('.amica__top-center__logo');

        $amica__top_center.removeClass('amica__top-center').addClass('amica__center-center');
        $amica__top_center__logo.removeClass('amica__top_center__logo').addClass('amica__center_center__logo');
        $('.haaga').fadeIn(1000);
        $('.footer').remove();
        $('.row').remove();
        $('.amica__top-center__restaurant-info').remove();
        $amicaButton.fadeIn(0);

    })
});



