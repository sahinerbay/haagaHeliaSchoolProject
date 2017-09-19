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
        $el;

    if(((hours >= 10 && minutes >= 30) && (hours < 14 && minutes <= 59)) || ((hours >= 16 & minutes >=0) && (hours < 18 && minutes <= 59))) {
        $el = $('<p>OPEN!</p>');
    } else $el = $('<p>CLOSED!</p>');

    $el.insertAfter('.amica__top-center__restaurant-info__time');
};

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

let addOpacityForInactiveDays = () => {
    let day = new Date().getDay();
    if(day == 0) {
        day = 6;
    } else day -= 1
    
    let $activeDay = $('.row > div').eq(day);
        $activeDay.css('opacity', '1');
}

$(function () {
    let $amicaButton = $('.amica__center-center__button');

    let amicaButtonClicked = (event) => {
        event.preventDefault();

        $('.amica').removeClass('amica--width-50').addClass('amica--width-100').fadeOut(0).fadeIn(1000);
        $('.amica__center-center').removeClass('amica__center-center').addClass('amica__top-center');

        //hideElements('haaga')
        $('.haaga').fadeOut(1000);
        $amicaButton.fadeOut(0); //hides the clicked button
        let todaysDate = todaysFormattedDate(true);
        getAmicaBasic('http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en')
            .then((restaurant) => {
                let $restaurantInfoDiv = $(`
                    <div class="amica__top-center__restaurant-info">
                        <p class="amica__top-center__restaurant-info__name">${restaurant.RestaurantName}</p>
                        <p class="amica__top-center__restaurant-info__link"><a href="${restaurant.RestaurantUrl}" target="_blank">Website</a></p>
                    </div>
                    `);
                $('.amica__top-center').append($restaurantInfoDiv);
                return restaurant.MenusForDays
            })
            .then((MenusForDays) => {
                let $restaurantInfo = $('.amica__top-center__restaurant-info');
                let $time = $('<p class="amica__top-center__restaurant-info__time">Closed!</p>');
                $restaurantInfo.append($time);
                
                MenusForDays.forEach((element, index) => {
                    if (element.Date.search(todaysDate) != -1) {
                        $time.text(element.LunchTime);
                        isItOpen();
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        let today = todaysFormattedDate(false);
        getAmicaLunch(`http://www.amica.fi/api/restaurant/menu/week?language=en&restaurantPageId=6143&weekDate=${today}`)
            .then(data => {
                let $row = $('<div class="row row__small row__medium row__large"></div>');
                data.LunchMenus.forEach((element) => {
                    //creates columns by size (12-6-3)
                    let $column = $('<div class="row__small-12 row__medium-6 row__large-3"</div>');

                    //Checks if it's weekend!
                    if (element.Html) {
                        $column.append(`<h3>${element.DayOfWeek} (${element.Date})</h3>`, element.Html);
                        $row.append($column);
                        $('.amica').append($row);
                    } else {
                        $column.append(`<h3>${element.DayOfWeek} (${element.Date})</h3>`, '<p>Closed!</p>');
                        $row.append($column);
                        $('.amica').append($row);
                    }
                })

                $('.amica td').removeAttr('width valign');
                addOpacityForInactiveDays();
            })

    };

    $amicaButton.on('click', amicaButtonClicked)
});



