'use strict';

$(function () {

    var getPhoneScreen = function getPhoneScreen(value) {
        var mq = window.matchMedia('(max-width: ' + value + ')');
        return mq.matches;
    };

    var isMobile = getPhoneScreen('529px');

    //Adding core html for homepage
    var init = function (size) {
        var $container = $('.container'),
            classAttr = void 0;

        if (size) classAttr = 'height';else classAttr = 'width';

        var amica = function amica() {
            $container.append('\n                <div class="amica amica--' + classAttr + '-50">\n                    <div class="amica__center-center">\n                        <img class="amica__center-center__logo" src="./image/amica-brand-logo.png" alt="amica logo">\n                        <a href="" class="amica__center-center__button" title="Check Amica Lunch Options">Enter</a>\n                    </div>\n                </div>\n            ');
        };

        var haaga = function haaga() {
            $container.append('\n                <div class="haaga haaga--' + classAttr + '-50">\n                    <div class="haaga__center-center">\n                        <img class="haaga__center-center__logo" src="./image/haaga-helia-logo.png" alt="haaga-helia logo">\n                        <a href="" class="haaga__center-center__button" title="Read More Information About Haaga-Helia">Enter</a>\n                    </div>\n                </div>\n            ');
        };

        return {
            amica: amica,
            haaga: haaga
        };
    }(isMobile);

    init.amica();
    init.haaga();

    window.addEventListener("orientationchange", function () {
        var isMobile = getPhoneScreen('529px');

        if ((screen.orientation.angle == -90 || screen.orientation.angle == 90) && isMobile) {
            $amica.container.attr('class', 'amica amica--width-50');
            $haaga.container.attr('class', 'haaga haaga--width-50');
        } else if (screen.orientation.angle == 0 && isMobile) {
            $amica.container.attr('class', 'amica amica--height-50');
            $haaga.container.attr('class', 'haaga haaga--height-50');
        }
    }, false);

    //adds 'back to home' button
    var addReturnButton = function addReturnButton(element) {
        var $footer = $('\n        <div class = \'footer\'>\n                <a class = \'footer__button-' + element + '\'>Go Back</a>    \n        </div>\n    ');
        $('.' + element).append($footer);
    };

    var insertRow = function insertRow() {
        return $('<div class="row row__small row__medium row__large"></div>');
    };

    //Formatting the date to match amica api date!
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

    //Assigning home buttons for haaga and amica 
    var buttons = function () {
        var $amicaHomeButton = $('.amica__center-center__button');
        var $haagaHomeButton = $('.haaga__center-center__button');

        return {
            $amicaHome: $amicaHomeButton,
            $haagaHome: $haagaHomeButton
        };
    }();

    //Assigning amica elements
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

    //assigning haaga elements
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

    //Request to amica api
    var amicaAPI = function () {
        var today = todaysFormattedDate(false);

        var url_restaurant = 'http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en';
        var url_lunch = 'http://www.amica.fi/api/restaurant/menu/week?language=en&restaurantPageId=6143&weekDate=' + today;

        var getAmicaBasic = function getAmicaBasic() {
            return axios.get(url_restaurant).then(function (response) {
                return response.data;
            }).catch(function (error) {
                console.log(error);
            });
        };

        var addRestaurantInfo = function addRestaurantInfo(restaurant) {
            return $('<div class="amica__top-center__restaurant-info">\n                    <h1 class="amica__top-center__restaurant-info__name">' + restaurant.RestaurantName + '</h1>\n                    <p class="amica__top-center__restaurant-info__link"><a href="' + restaurant.RestaurantUrl + '" target="_blank">Website</a></p>\n                    <p class="amica__top-center__restaurant-info__time">Closed!</p>\n                    </div>');
        };

        var getAmicaLunch = function getAmicaLunch() {
            return axios.get(url_lunch).then(function (response) {
                return response.data;
            }).catch(function (error) {
                console.log(error);
            });
        };

        var addLunchInfo = function addLunchInfo(day) {
            var $column = $('<div class="row__small-12 row__medium-6 row__large-3"</div>');

            //Checks if it's weekend!
            if (day.Html != "") {
                $column.append('<h3>' + day.DayOfWeek + ' (' + day.Date + ')</h3>', day.Html);
            } else {
                //if it's not weekend then insert 'restaurant closed' tag!
                $column.append('<h3>' + day.DayOfWeek + ' (' + day.Date + ')</h3>', '<p>The Restaurant Closed!</p>');
            }
            return $column;
        };

        //add style for past/future days
        var styleInactiveDays = function styleInactiveDays() {
            var today = new Date().getDay();
            if (today == 0) {
                today = 6;
            } else today -= 1;

            for (var days = 0; days < 7; days++) {
                if (days == today) continue;
                var $activeDay = $('.row > div').eq(days);
                $activeDay.css({
                    'opacity': '.3'
                });
            }
        };

        //Checks if the restaurant open atm
        var addOpenClose = function addOpenClose(insertAfterEl) {
            var now = new Date();
            var hours = now.getHours(),
                minutes = now.getMinutes(),
                $el = $('<p class = "amica__top-center__restaurant-info__isOpen"></p>'),
                open = 'OPEN!',
                closed = 'CLOSED!';
            //10:30am-2.00pm and 4:00pm-6:00pm
            if (hours == 10) {
                if (minutes >= 30 && minutes <= 59) {
                    $el.text(open);
                } else $el.text(closed);
            } else if (hours >= 11 && hours < 14) {
                $el.text(open);
            } else if (hours >= 16 && hours < 18) {
                $el.text(open);
            } else $el.text(closed);
            $el.insertAfter(insertAfterEl);
        };

        return {
            getRestaurantInfo: getAmicaBasic,
            addRestaurantInfo: addRestaurantInfo,
            getLunchInfo: getAmicaLunch,
            addLunchInfo: addLunchInfo,
            styleInactiveDays: styleInactiveDays,
            addOpenClose: addOpenClose
        };
    }();

    //Request to flickr api using tag name
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

    //Callback functions for buttons
    var buttonsCB = function () {
        var amicaHomeButtonClicked = function amicaHomeButtonClicked(event) {
            event.preventDefault();

            var isMobile = getPhoneScreen('529px');

            if (isMobile) {
                $amica.container.attr('class', 'amica amica--height-100 amica--relative');
                $haaga.container.attr('class', 'haaga haaga--height-0');
            } else {
                $amica.container.attr('class', 'amica amica--width-100 amica--relative');
                $haaga.container.attr('class', 'haaga haaga--width-0');
            }
            $amica.center.removeClass('amica__center-center').addClass('amica__top-center');
            $amica.center_logo.removeClass('amica__center-center__logo').addClass('amica__top-center__logo');

            buttons.$amicaHome.fadeOut(0);
            $haaga.center.fadeOut(0);

            amicaAPI.getRestaurantInfo().then(function (restaurant) {
                var $amica__top_center__restaurant_info = amicaAPI.addRestaurantInfo(restaurant);
                $('.amica__top-center').append($amica__top_center__restaurant_info);

                var todaysDate = todaysFormattedDate(true);
                var $restaurantTime = $('.amica__top-center__restaurant-info__time');

                //loops through each day of the week
                restaurant.MenusForDays.forEach(function (element, index) {
                    //for weekdays
                    if (element.Date.search(todaysDate) != -1) {
                        // search today's meal
                        $restaurantTime.text(element.LunchTime); // show today's meal
                        amicaAPI.addOpenClose($restaurantTime); // checks if restaurant open and insert paragraph (open/closed)
                    }
                    //for weekend 
                    else {
                            $('.amica__top-center__restaurant-info__isOpen').text('CLOSED!');
                        }
                });
            }).catch(function (error) {
                console.log(error);
            });

            amicaAPI.getLunchInfo().then(function (data) {
                var $row = insertRow();
                //loops through weekly meals
                data.LunchMenus.forEach(function (today) {
                    //creates columns by size (12-6-3)
                    var $column = amicaAPI.addLunchInfo(today);
                    $row.append($column);
                });

                $amica.container.append($row);

                //remove the attritube that came from Amica API
                $('.amica td').removeAttr('width valign');

                //add style for past or future days
                amicaAPI.styleInactiveDays();

                //insert 'back to home' button
                addReturnButton('amica');
            });
        };

        var amicaReturnButtonClicked = function amicaReturnButtonClicked(event) {
            event.preventDefault();

            var isMobile = getPhoneScreen('529px');

            if (isMobile) {
                $amica.container.attr('class', 'amica amica--height-50');
                $haaga.container.attr('class', 'haaga haaga--height-50');
            } else {
                $amica.container.attr('class', 'amica amica--width-50');
                $haaga.container.attr('class', 'haaga haaga--width-50');
            }

            var $amica__top_center = $('.amica__top-center'),
                $amica__top_center__logo = $('.amica__top-center__logo');

            $amica__top_center.removeClass('amica__top-center').addClass('amica__center-center');
            $amica__top_center__logo.removeClass('amica__top-center__logo').addClass('amica__center-center__logo');

            $('.footer').remove();
            $('.row').remove();
            $('.amica__top-center__restaurant-info').remove();

            buttons.$amicaHome.fadeIn(0);
            $haaga.center.fadeIn(0);
        };

        var haagaHomeButtonClicked = function haagaHomeButtonClicked(event) {
            event.preventDefault();

            var isMobile = getPhoneScreen('529px');

            if (isMobile) {
                $amica.container.attr('class', 'amica amica--height-0');
                $haaga.container.attr('class', 'haaga haaga--height-100 haaga--relative');
            } else {
                $amica.container.attr('class', 'amica amica--width-0');
                $haaga.container.attr('class', 'haaga haaga--width-100 haaga--relative');
            }

            $haaga.center.removeClass('haaga__center-center').addClass('haaga__top-center');
            $haaga.center_logo.removeClass('haaga__center-center__logo').addClass('haaga__top-center__logo');

            buttons.$haagaHome.fadeOut(0);
            $amica.center.fadeOut(0);

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

            var isMobile = getPhoneScreen('529px');

            if (isMobile) {
                $amica.container.attr('class', 'amica amica--height-50');
                $haaga.container.attr('class', 'haaga haaga--height-50');
            } else {
                $amica.container.attr('class', 'amica amica--width-50');
                $haaga.container.attr('class', 'haaga haaga--width-50');
            }

            var $haaga__top_center = $('.haaga__top-center'),
                $haaga__top_center__logo = $('.haaga__top-center__logo');

            $haaga__top_center.removeClass('haaga__top-center').addClass('haaga__center-center');
            $haaga__top_center__logo.removeClass('haaga__top-center__logo').addClass('haaga__center-center__logo');

            $('.footer').remove();
            $('.row').remove();

            buttons.$haagaHome.fadeIn(0);
            $amica.center.fadeIn(0);
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