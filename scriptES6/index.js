$(function () {

    let getPhoneScreen = (value) => {
        const mq = window.matchMedia(`(max-width: ${value})`);
        return mq.matches;
    };

    let isMobile = getPhoneScreen('529px');

    //Adding core html for homepage
    let init = function (size) {
        let $container = $('.container'),
            classAttr;

        if (size) classAttr = 'height';
        else classAttr = 'width';

        let amica = () => {
            $container.append(`
                <div class="amica amica--${classAttr}-50">
                    <div class="amica__center-center">
                        <img class="amica__center-center__logo" src="./image/amica-brand-logo.png" alt="amica logo">
                        <a href="" class="amica__center-center__button" title="Check Amica Lunch Options">Enter</a>
                        <h1 class="amica__center-center__name"><a href='http://www.amica.fi/en/restaurants/ravintolat-kaupungeittain/helsinki/helia-bistro.-opetustalo/' target="_blank">Helia Bistro</a></h1>
                    </div>
                </div>
            `);
        };

        let haaga = () => {
            $container.append(`
                <div class="haaga haaga--${classAttr}-50">
                    <div class="haaga__center-center">
                        <img class="haaga__center-center__logo" src="./image/haaga-helia-logo.png" alt="haaga-helia logo">
                        <a href="" class="haaga__center-center__button" title="Read More Information About Haaga-Helia">Enter</a>
                        <h1 class="haaga__center-center__name"><a href='http://www.haaga-helia.fi/fi/etusivu' target="_blank">Haaga Helia</a></h1>
                    </div>
                </div>
            `);
        };

        return {
            amica: amica,
            haaga: haaga
        }
    }(isMobile);

    init.amica();
    init.haaga();

    let adjustScreenAngle = () => {
        let isMobile = getPhoneScreen('529px');

        //true for switching from landscape to portrait
        if (isMobile && (screen.orientation.angle == 0)) {
            if ($amica.container.hasClass('amica--width-50')) {
                $amica.container.attr('class', 'amica amica--height-50');
                $haaga.container.attr('class', 'haaga haaga--height-50');
            }
        }
        //false for switching from portrait to landscape    
        else if (!isMobile && (screen.orientation.angle == -90 || screen.orientation.angle == 90)) {
            if ($amica.container.hasClass('amica--height-50')) {
                $amica.container.attr('class', 'amica amica--width-50');
                $haaga.container.attr('class', 'haaga haaga--width-50');
            }
        }
    }

    //adds 'back to home' button
    let addReturnButton = (element) => {
        let $loadingIcon;
        if(element == 'haaga') {
            $loadingIcon = "<img class='footer__loading' src='../image/loading_icon.gif' alt='Loading…' />";
        } else $loadingIcon = "";

        let $footer = $(`
            <div class = 'footer'>
                ${$loadingIcon}
                <a class = 'footer__button-${element}'>Go Back</a>    
            </div>
        `);
        $(`.${element}`).append($footer);
    };

    let insertRow = () => {
        return $('<div class="row row__small row__medium row__large"></div>');
    };

    //Formatting the date to match amica api date!
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

    let setClassesFromHome = (onPage, onPageSelector, offPage, offPageSelector) => {
        let isMobile = getPhoneScreen('529px');

        if (isMobile) {
            onPageSelector.attr('class', `${onPage} ${onPage}--height-100 ${onPage}--overflow`);
            offPageSelector.attr('class', `${offPage} ${offPage}--height-0`);
        } else {
            onPageSelector.attr('class', `${onPage} ${onPage}--width-100 ${onPage}--overflow`);
            offPageSelector.attr('class', `${offPage} ${offPage}--width-0`);
        }
    };

    let setClassesToHome = (onPage, onPageSelector, offPage, offPageSelector) => {
        let isMobile = getPhoneScreen('529px');

        if (isMobile) {
            onPageSelector.attr('class', `${onPage} ${onPage}--height-50`);
            offPageSelector.attr('class', `${offPage} ${offPage}--height-50`);
        } else {
            onPageSelector.attr('class', `${onPage} ${onPage}--width-50`);
            offPageSelector.attr('class', `${offPage} ${offPage}--width-50`);
        }
    };

    //Assigning home buttons for haaga and amica 
    let buttons = function () {
        let $amicaHomeButton = $('.amica__center-center__button');
        let $haagaHomeButton = $('.haaga__center-center__button');

        return {
            $amicaHome: $amicaHomeButton,
            $haagaHome: $haagaHomeButton
        }
    }();

    //Assigning amica elements
    let $amica = function () {
        let container = $('.amica'),
            center = $('.amica__center-center'),
            center_logo = $('.amica__center-center__logo'),
            center_name = $('.amica__center-center__name');

        return {
            container: container,
            center: center,
            center_logo: center_logo,
            center_name: center_name
        }
    }();

    //assigning haaga elements
    let $haaga = function () {
        let container = $('.haaga'),
            center = $('.haaga__center-center'),
            center_logo = $('.haaga__center-center__logo'),
            center_name = $('.haaga__center-center__name');

        return {
            container: container,
            center: center,
            center_logo: center_logo,
            center_name: center_name
        }
    }();

    //Request to amica api
    let amicaAPI = function () {
        let today = todaysFormattedDate(false);

        let url_restaurant = 'http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en';
        let url_lunch = `http://www.amica.fi/api/restaurant/menu/week?language=en&restaurantPageId=6143&weekDate=${today}`;

        let getAmicaBasic = () => {
            return axios.get(url_restaurant)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        let addRestaurantInfo = (restaurant) => {
            return $(`<div class="amica__top-center__restaurant-info">
                        <h1 class="amica__top-center__restaurant-info__name"><a href="${restaurant.RestaurantUrl}" target="_blank">${restaurant.RestaurantName}</a></h1>
                        <p class="amica__top-center__restaurant-info__time">Closed!</p>
                    </div>`);
        };

        let getAmicaLunch = () => {
            return axios.get(url_lunch)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        let addLunchInfo = (day) => {
            let $column = $('<div class="row__xs-12 row__small-12 row__medium-6 row__large-3"</div>');

            //Checks if it's weekend!
            if (day.Html != "") {
                $column.append(`<h3>${day.DayOfWeek} (${day.Date})</h3>`, day.Html);
            } else { //if it's not weekend then insert 'restaurant closed' tag!
                $column.append(`<h3>${day.DayOfWeek} (${day.Date})</h3>`, '<p>The Restaurant Closed!</p>');
            }
            return $column;
        };

        //add style for past/future days
        let styleInactiveDays = () => {
            let today = new Date().getDay();
            if (today == 0) {
                today = 6;
            } else today -= 1

            for (let days = 0; days < 7; days++) {
                if (days == today) {
                    let $activeDay = $('.row > div').eq(days);
                    $activeDay.css({
                        border: '2px solid #007549',
                        padding: '10px',
                        'box-shadow': '2px 2px 3px rgba(0,0,0,0.16)'
                    })
                } else {
                    let $inActiveDay = $('.row > div').eq(days);
                    $inActiveDay.css({
                        'opacity': '.3'
                    });
                }
            }
        };

        //Checks if the restaurant open atm
        let addOpenClose = (insertAfterEl) => {
            let now = new Date();
            let hours = now.getHours(),
                minutes = now.getMinutes(),
                $el = $('<p class = "amica__top-center__restaurant-info__isOpen"></p>'),
                open = 'OPEN!',
                closed = 'CLOSED!';
            //10:30am-2.00pm and 4:00pm-6:00pm
            if (hours == 10) {
                if ((minutes >= 30 && minutes <= 59)) {
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
        }
    }();

    //Request to flickr api using tag name
    let haagaFlickrAPI = function () {

        const apiKey = 'a2cf3fa7a12e171dbd210236313bf095';

        let options = {
            method: 'flickr.photos.search',
            api_key: apiKey,
            tags: 'haaga-helia',
            format: 'json',
            perPage: 30,
            currentPage: 1,
            plainJSON: 'nojsoncallback=1',
        };

        let createApiUrl = () => {
            return `https://api.flickr.com/services/rest/?method=${options.method}&api_key=${options.api_key}&tags=${options.tags}&per_page=${options.perPage}&page=${options.currentPage}&format=${options.format}&${options.plainJSON}`;
        }

        let getPhotos = () => {
            options.currentPage = 1;
            let apiUrl = createApiUrl();            
            return axios.get(apiUrl)
                .then(function (response) {
                    options.totalPages = response.data.photos.pages;
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        let loadMorePhotos = () => {
            options.currentPage += 1;
            let apiUrl = createApiUrl();  
            return axios.get(apiUrl)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

    
        let buildThumbnailUrl = (photo) => {
            return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
        };

        let addContent = (url) => {
            let url2 = url.replace(/_q./, '_c.')
            return $(`<div class="row__xs-12 row__small-4 row__medium-3 row__large-2">
                        <img src="${url}">
                        <div class="modal">
                            <div class="modal__container">
                                <img src="${url2}">
                            </div>
                        </div>                
                    </div>`);
        };

        let addHaagaInfo = () => {
            return $(`<div class="haaga__top-center__campus-info">
                        <h1 class="haaga__top-center__campus-info__name"><a href='http://www.haaga-helia.fi/fi/etusivu' target="_blank">Haaga Helia</a></h1>
                        <p class="haaga__top-center__campus-info__link"></p>
                    </div>`);
        };

        let createPopUp = (e) => {
            $(e.target).next(".modal").css('display', 'block');
        };

        let removePopUp = (e) => {
            let modal = $('.modal');
            if (event.target == modal) {
                modal.css('display', 'none');
            }
            $(e.target).closest(".modal").css('display', 'none');
        };

        let infiniteLoading = () => {
            let $win = $(window);
            // End of the document reached?
            if ($(document).height() - $win.height() == Math.ceil($win.scrollTop()) && options.currentPage < options.totalPages) {
                $('.footer__loading').css('visibility', 'visible');
                loadMorePhotos()
                    .then(response => {
                        let $row = $('.row');

                        response.photos.photo.forEach(element => {
                            let url = buildThumbnailUrl(element);
                            $row.append(addContent(url));
                        });
                        $('.footer__loading').css('visibility', 'hidden');
                        if(options.currentPage == options.totalPages) {
                            $('.footer').prepend(`<p class='footer__info'>${response.photos.total} photos loaded.</p>`);
                        }
                    });
            }
        };

        return {
            getPhotos: getPhotos,
            buildThumbnailUrl: buildThumbnailUrl,
            addContent: addContent,
            addHaagaInfo: addHaagaInfo,
            createPopUp: createPopUp,
            removePopUp: removePopUp,
            infiniteLoading: infiniteLoading
        }
    }();

    //Callback functions for buttons
    let buttonsCB = function () {
        let amicaHomeButtonClicked = (event) => {
            event.preventDefault();

            setClassesFromHome('amica', $amica.container, 'haaga', $haaga.container);

            $amica.center.removeClass('amica__center-center').addClass('amica__top-center');
            $amica.center_logo.removeClass('amica__center-center__logo').addClass('amica__top-center__logo');

            buttons.$amicaHome.add($haaga.center).add($amica.center_name).fadeOut(0);

            amicaAPI.getRestaurantInfo()
                .then((restaurant) => {
                    let $amica__top_center__restaurant_info = amicaAPI.addRestaurantInfo(restaurant);
                    $('.amica__top-center').append($amica__top_center__restaurant_info);

                    let todaysDate = todaysFormattedDate(true);
                    let $restaurantTime = $('.amica__top-center__restaurant-info__time');

                    //loops through each day of the week
                    restaurant.MenusForDays.forEach((element, index) => {
                        //for weekdays
                        if (element.Date.search(todaysDate) != -1) { // search today's meal
                            $restaurantTime.text(element.LunchTime); // show today's meal
                            amicaAPI.addOpenClose($restaurantTime); // checks if restaurant open and insert paragraph (open/closed)
                        }
                        //for weekend 
                        else {
                            $('.amica__top-center__restaurant-info__isOpen').text('CLOSED!');
                        }
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });

            amicaAPI.getLunchInfo()
                .then(data => {
                    let $row = insertRow();
                    //loops through weekly meals
                    data.LunchMenus.forEach((today) => {
                        //creates columns by size (12-6-3)
                        let $column = amicaAPI.addLunchInfo(today);
                        $row.append($column);
                    });

                    $amica.container.append($row);

                    //remove the attritube that came from Amica API
                    $('.amica td').removeAttr('width valign');

                    //add style for past or future days
                    amicaAPI.styleInactiveDays();

                    //insert 'back to home' button
                    addReturnButton('amica');
                })
        };

        let amicaReturnButtonClicked = (event) => {
            event.preventDefault();

            setClassesToHome('amica', $amica.container, 'haaga', $haaga.container);

            let $amica__top_center = $('.amica__top-center'),
                $amica__top_center__logo = $('.amica__top-center__logo');

            $amica__top_center.removeClass('amica__top-center').addClass('amica__center-center');
            $amica__top_center__logo.removeClass('amica__top-center__logo').addClass('amica__center-center__logo');

            $('.footer, .row, .amica__top-center__restaurant-info').remove();

            buttons.$amicaHome.add($haaga.center).add($amica.center_name).fadeIn(0);
        };

        let haagaHomeButtonClicked = (event) => {
            event.preventDefault();

            setClassesFromHome('haaga', $haaga.container, 'amica', $amica.container);

            $haaga.center.removeClass('haaga__center-center').addClass('haaga__top-center');
            $haaga.center_logo.removeClass('haaga__center-center__logo').addClass('haaga__top-center__logo');

            let $haaga__top_center__campus_info = haagaFlickrAPI.addHaagaInfo();
            $(".haaga__top-center").append($haaga__top_center__campus_info);

            buttons.$haagaHome.add($amica.center).add($haaga.center_name).fadeOut(0);

            haagaFlickrAPI.getPhotos()
                .then(response => {
                    let $row = insertRow();

                    response.photos.photo.forEach(element => {
                        let url = haagaFlickrAPI.buildThumbnailUrl(element);
                        $row.append(haagaFlickrAPI.addContent(url));
                    });
                    $haaga.container.append($row);

                    $row.on('click', haagaFlickrAPI.createPopUp);
                    //set display none for pseudo element of .modal__container by using pointer:none css property
                    $row.on('click', '.modal__container', haagaFlickrAPI.removePopUp);
                    $row.on('click', '.modal', haagaFlickrAPI.removePopUp)

                    addReturnButton('haaga');
                    $('.footer').find('.footer__loading').css('visibility', 'hidden');
                });
        };

        let haagaReturnButtonClicked = (event) => {
            event.preventDefault();

            setClassesToHome('haaga', $haaga.container, 'amica', $amica.container);

            let $haaga__top_center = $('.haaga__top-center'),
                $haaga__top_center__logo = $('.haaga__top-center__logo');

            $haaga__top_center.removeClass('haaga__top-center').addClass('haaga__center-center');
            $haaga__top_center__logo.removeClass('haaga__top-center__logo').addClass('haaga__center-center__logo');

            $('.footer, .row, .haaga__top-center__campus-info').remove();

            buttons.$haagaHome.add($amica.center).add($haaga.center_name).fadeIn(0);
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

    $(window).on({
        "orientationchange": adjustScreenAngle,
        "scroll": haagaFlickrAPI.infiniteLoading
    });
});