$(function () {

    let init = function () {
        let $container = $('.container');

        let amica = () => {
            $container.append(`
                <div class="amica amica--width-50">
                    <div class="amica__center-center">
                        <img class="amica__center-center__logo" src="./image/amica-brand-logo.png" alt="amica logo">
                        <a href="" class="amica__center-center__button" title="Check Amica Lunch Options">Enter</a>
                    </div>
                </div>
            `);
        };

        let haaga = () => {
            $container.append(`
                <div class="haaga haaga--width-50">
                    <div class="haaga__center-center">
                        <img class="haaga__center-center__logo" src="./image/haaga-helia-logo.png" alt="haaga-helia logo">
                        <a href="" class="haaga__center-center__button" title="Read More Information About Haaga-Helia">Enter</a>
                    </div>
                </div>
            `);
        };

        return {
            amica: amica,
            haaga: haaga
        }
    }();

    init.amica();
    init.haaga();

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

    let amicaAPI = function () {
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

        return {
            restaurantInfo: getAmicaBasic,
            lunchInfo: getAmicaLunch
        }
    }();

    let haagaFlickrAPI = function () {

        const apiKey = 'a2cf3fa7a12e171dbd210236313bf095';

        let options = {
            method: 'flickr.photos.search',
            api_key: apiKey,
            tags: 'haaga-helia',
            format: 'json',
            perPage: 50,
            plainJSON: 'nojsoncallback=1'
        };

        const apiURL = `https://api.flickr.com/services/rest/?method=${options.method}&api_key=${options.api_key}&tags=${options.tags}&per_page=${options.perPage}&format=${options.format}&${options.plainJSON}`;

        let getPhotos = () => {
            return axios.get(apiURL)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        let buildThumbnailUrl = (photo) => {
            return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
        };

        let addContent = (url) => {
            return $(`<div class="row__small-4 row__medium-3 row__large-2">
                        <img src="${url}">                
                    </div>`);
        }

        return {
            getPhotos: getPhotos,
            buildThumbnailUrl: buildThumbnailUrl,
            addContent: addContent
        }
    }();

    let isItOpen = () => {
        let now = new Date();
        let hours = now.getHours() + 1,
            minutes = now.getMinutes(),
            $el = $('<p class = "amica__top-center__restaurant-info__isOpen"></p>');

        //10:30am-2.00pm and 4:00pm-6:00pm
        if (hours == 10) {
            if ((minutes >= 30 && minutes <= 59)) {
                $el.text('OPEN!');
            } else $el.text('CLOSED!');
        } else if (hours >= 11 && hours < 14) {
            $el.text('OPEN!');
        }

        $el.insertAfter('.amica__top-center__restaurant-info__time');
    };

    let addReturnButton = (element) => {
        let $footer = $(`
        <div class = 'footer'>
            <div class = 'footer--absolute'>
                <a class = 'footer__button-${element}'>Go Back</a>    
            </div>
        </div>
    `);
        $(`.${element}--width-100`).append($footer);
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
        let today = new Date().getDay();
        if (today == 0) {
            today = 6;
        } else today -= 1

        for (let days = 0; days < 7; days++) {
            console.log('hello')
            if (days == today) continue;
            let $activeDay = $('.row > div').eq(days);
            $activeDay.css({
                'opacity': '.3'
            });
        }
    };

    let insertRow = () => {
        return $('<div class="row row__small row__medium row__large"></div>');
    };

    //defining variables
    let today = todaysFormattedDate(false);

    let buttonsCB = function () {
        let amicaHomeButtonClicked = (event) => {
            event.preventDefault();

            $amica.container.removeClass('amica--width-50').addClass('amica--width-100 amica--relative');
            $haaga.container.removeClass('haaga--width-50').addClass('haaga--width-0');

            $amica.center.removeClass('amica__center-center').addClass('amica__top-center');
            $amica.center_logo.removeClass('amica__center-center__logo').addClass('amica__top-center__logo');

            buttons.$amicaHome.fadeOut(0);

            amicaAPI.restaurantInfo('http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en')
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

            amicaAPI.lunchInfo(`http://www.amica.fi/api/restaurant/menu/week?language=en&restaurantPageId=6143&weekDate=${today}`)
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
                    addReturnButton('amica');
                })
        };

        let amicaReturnButtonClicked = (event) => {
            event.preventDefault();

            $amica.container.removeClass('amica--width-100 amica--relative').addClass('amica--width-50');
            let $amica__top_center = $('.amica__top-center'),
                $amica__top_center__logo = $('.amica__top-center__logo');

            $amica__top_center.removeClass('amica__top-center').addClass('amica__center-center');
            $amica__top_center__logo.removeClass('amica__top-center__logo').addClass('amica__center_center__logo');

            $haaga.container.removeClass('haaga--width-0').addClass('haaga--width-50');

            $('.footer').remove();
            $('.row').remove();
            $('.amica__top-center__restaurant-info').remove();

            buttons.$amicaHome.fadeIn(0);
        };

        let haagaHomeButtonClicked = (event) => {
            event.preventDefault();

            $amica.container.removeClass('amica--width-50').addClass('amica--width-0');
            $haaga.container.removeClass('haaga--width-50').addClass('haaga--width-100 haaga--relative');

            $haaga.center.removeClass('haaga__center-center').addClass('haaga__top-center');
            $haaga.center_logo.removeClass('haaga__center-center__logo').addClass('haaga__top-center__logo');

            buttons.$haagaHome.fadeOut(0);

            haagaFlickrAPI.getPhotos().then(response => {
                let $row = insertRow();
                response.photos.photo.forEach(element => {
                    let url = haagaFlickrAPI.buildThumbnailUrl(element);
                    $row.append(haagaFlickrAPI.addContent(url));
                });
                $haaga.container.append($row);
                addReturnButton('haaga');
            });
        };

        let haagaReturnButtonClicked = (event) => {
            event.preventDefault();

            $haaga.container.removeClass('haaga--width-100 haaga--relative').addClass('haaga--width-50');
            let $haaga__top_center = $('.haaga__top-center'),
                $haaga__top_center__logo = $('.haaga__top-center__logo');

            $haaga__top_center.removeClass('haaga__top-center').addClass('haaga__center-center');
            $haaga__top_center__logo.removeClass('haaga__top-center__logo').addClass('haaga__center_center__logo');

            $amica.container.removeClass('amica--width-0').addClass('amica--width-50');

            $('.footer').remove();
            $('.row').remove();
            //$('.amica__top-center__restaurant-info').remove();

            buttons.$haagaHome.fadeIn(0);
        };

        return {
            amicaHomeButton: amicaHomeButtonClicked,
            haagaHomeButton: haagaHomeButtonClicked,
            amicaReturnButton: amicaReturnButtonClicked,
            haagaReturnButton: haagaReturnButtonClicked
        }
    }();

    buttons.$amicaHome.on('click', buttonsCB.amicaHomeButton);
    buttons.$haagaHome.on('click', buttonsCB.haagaHomeButton);

    $amica.container.on('click', '.footer__button-amica', buttonsCB.amicaReturnButton);
    $haaga.container.on('click', '.footer__button-haaga', buttonsCB.haagaReturnButton);

});