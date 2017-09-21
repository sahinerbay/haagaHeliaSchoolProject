'use strict';

$(function () {

    var init = function () {
        var $container = $('.container');

        var amica = function amica() {
            $container.append('\n                <div class="amica amica--width-50">\n                    <div class="amica__center-center">\n                        <img class="amica__center-center__logo" src="./image/amica-brand-logo.png" alt="amica logo">\n                        <a href="" class="amica__center-center__button" title="Check Amica Lunch Options">Enter</a>\n                    </div>\n                </div>\n            ');
        };

        var haaga = function haaga() {
            $container.append('\n                <div class="haaga haaga--width-50">\n                    <div class="haaga__center-center">\n                        <img class="haaga__center-center__logo" src="./image/haaga-helia-logo.png" alt="haaga-helia logo">\n                        <a href="" class="haaga__center-center__button" title="Read More Information About Haaga-Helia">Enter</a>\n                    </div>\n                </div>\n            ');
        };

        return {
            amica: amica,
            haaga: haaga
        };
    }();

    init.amica();
    init.haaga();

    var buttons = function () {
        var $amicaHomeButton = $('.amica__center-center__button');
        var $haagaHomeButton = $('.haaga__center-center__button');

        return {
            $amicaHome: $amicaHomeButton,
            $haagaHome: $haagaHomeButton
        };
    }();

    var $amica = function () {
        var container = $('.amica'),
            center = $('.amica__center-center'),
            center_logo = $('.amica__center-center__logo');

        return {
            container: container,
            center: center,
            center_logo: center_logo
        };
    }();

    var $haaga = function () {
        var container = $('.haaga'),
            center = $('.haaga__center-center'),
            center_logo = $('.haaga__center-center__logo');

        return {
            container: container,
            center: center,
            center_logo: center_logo
        };
    }();

    var amicaAPI = function () {
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

        return {
            restaurantInfo: getAmicaBasic,
            lunchInfo: getAmicaLunch
        };
    }();

    var haagaFlickrAPI = function () {

        var apiKey = 'a2cf3fa7a12e171dbd210236313bf095';

        var options = {
            method: 'flickr.photos.search',
            api_key: apiKey,
            tags: 'haaga-helia',
            format: 'json',
            perPage: 50,
            plainJSON: 'nojsoncallback=1'
        };

        var apiURL = 'https://api.flickr.com/services/rest/?method=' + options.method + '&api_key=' + options.api_key + '&tags=' + options.tags + '&per_page=' + options.perPage + '&format=' + options.format + '&' + options.plainJSON;

        var getPhotos = function getPhotos() {
            return axios.get(apiURL).then(function (response) {
                return response.data;
            }).catch(function (error) {
                console.log(error);
            });
        };

        var buildThumbnailUrl = function buildThumbnailUrl(photo) {
            return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg';
        };

        var addContent = function addContent(url) {
            return $('<div class="row__small-4 row__medium-3 row__large-2">\n                        <img src="' + url + '">                \n                    </div>');
        };

        return {
            getPhotos: getPhotos,
            buildThumbnailUrl: buildThumbnailUrl,
            addContent: addContent
        };
    }();

    var isItOpen = function isItOpen() {
        var now = new Date();
        var hours = now.getHours() + 1,
            minutes = now.getMinutes(),
            $el = $('<p class = "amica__top-center__restaurant-info__isOpen"></p>');

        //10:30am-2.00pm and 4:00pm-6:00pm
        if (hours == 10) {
            if (minutes >= 30 && minutes <= 59) {
                $el.text('OPEN!');
            } else $el.text('CLOSED!');
        } else if (hours >= 11 && hours < 14) {
            $el.text('OPEN!');
        }

        $el.insertAfter('.amica__top-center__restaurant-info__time');
    };

    var addReturnButton = function addReturnButton(element) {
        var $footer = $('\n        <div class = \'footer\'>\n            <div class = \'footer--absolute\'>\n                <a class = \'footer__button-' + element + '\'>Go Back</a>    \n            </div>\n        </div>\n    ');
        $('.' + element + '--width-100').append($footer);
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
        var today = new Date().getDay();
        if (today == 0) {
            today = 6;
        } else today -= 1;

        for (var days = 0; days < 7; days++) {
            console.log('hello');
            if (days == today) continue;
            var $activeDay = $('.row > div').eq(days);
            $activeDay.css({
                'opacity': '.3'
            });
        }
    };

    var insertRow = function insertRow() {
        return $('<div class="row row__small row__medium row__large"></div>');
    };

    //defining variables
    var today = todaysFormattedDate(false);

    var buttonsCB = function () {
        var amicaHomeButtonClicked = function amicaHomeButtonClicked(event) {
            event.preventDefault();

            $amica.container.removeClass('amica--width-50').addClass('amica--width-100 amica--relative');
            $haaga.container.removeClass('haaga--width-50').addClass('haaga--width-0');

            $amica.center.removeClass('amica__center-center').addClass('amica__top-center');
            $amica.center_logo.removeClass('amica__center-center__logo').addClass('amica__top-center__logo');

            buttons.$amicaHome.fadeOut(0);

            amicaAPI.restaurantInfo('http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en').then(function (restaurant) {
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

            amicaAPI.lunchInfo('http://www.amica.fi/api/restaurant/menu/week?language=en&restaurantPageId=6143&weekDate=' + today).then(function (data) {
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
                    $amica.container.append($row);
                });
                //remove the attritube that came from Amica API
                $('.amica td').removeAttr('width valign');
                //add style for past or future days
                addCSSForInactiveDays();
                //insert 'back to home' button
                addReturnButton('amica');
            });
        };

        var amicaReturnButtonClicked = function amicaReturnButtonClicked(event) {
            event.preventDefault();

            $amica.container.removeClass('amica--width-100 amica--relative').addClass('amica--width-50');
            var $amica__top_center = $('.amica__top-center'),
                $amica__top_center__logo = $('.amica__top-center__logo');

            $amica__top_center.removeClass('amica__top-center').addClass('amica__center-center');
            $amica__top_center__logo.removeClass('amica__top-center__logo').addClass('amica__center_center__logo');

            $haaga.container.removeClass('haaga--width-0').addClass('haaga--width-50');

            $('.footer').remove();
            $('.row').remove();
            $('.amica__top-center__restaurant-info').remove();

            buttons.$amicaHome.fadeIn(0);
        };

        var haagaHomeButtonClicked = function haagaHomeButtonClicked(event) {
            event.preventDefault();

            $amica.container.removeClass('amica--width-50').addClass('amica--width-0');
            $haaga.container.removeClass('haaga--width-50').addClass('haaga--width-100 haaga--relative');

            $haaga.center.removeClass('haaga__center-center').addClass('haaga__top-center');
            $haaga.center_logo.removeClass('haaga__center-center__logo').addClass('haaga__top-center__logo');

            buttons.$haagaHome.fadeOut(0);

            haagaFlickrAPI.getPhotos().then(function (response) {
                var $row = insertRow();
                response.photos.photo.forEach(function (element) {
                    var url = haagaFlickrAPI.buildThumbnailUrl(element);
                    $row.append(haagaFlickrAPI.addContent(url));
                });
                $haaga.container.append($row);
                addReturnButton('haaga');
            });
        };

        var haagaReturnButtonClicked = function haagaReturnButtonClicked(event) {
            event.preventDefault();

            $haaga.container.removeClass('haaga--width-100 haaga--relative').addClass('haaga--width-50');
            var $haaga__top_center = $('.haaga__top-center'),
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
        };
    }();

    buttons.$amicaHome.on('click', buttonsCB.amicaHomeButton);
    buttons.$haagaHome.on('click', buttonsCB.haagaHomeButton);

    $amica.container.on('click', '.footer__button-amica', buttonsCB.amicaReturnButton);
    $haaga.container.on('click', '.footer__button-haaga', buttonsCB.haagaReturnButton);
});