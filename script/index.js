"use strict";

var getData = function getData(url, callback) {
    $.ajax({
        type: "GET",
        url: url,
        timeout: 2000
    }).done(function (result) {
        callback(result);
    }).fail(function (textStatus, jqXHR) {
        alert("Request failed: " + textStatus);
    }).always(function () {
        console.log("this will always be executed");
    });
};

var todaysFormattedDate = function todaysFormattedDate() {
    var d = new Date(),
        curr_date = d.getDate(),
        curr_month = d.getMonth() + 1,
        curr_year = d.getFullYear();
    if (curr_month < 10) {
        curr_month = '0' + curr_month;
    }
    var todaysDate = curr_year + "-" + curr_month + "-" + curr_date;
    return todaysDate;
};

$(function () {
    var hideElements = function hideElements() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        for (var index = 0; index < args.length; index++) {
            var $element = $("." + args[index]);
            if ($element.hasClass('haaga__small--width-25')) {
                $element.removeClass('haaga__small--width-25');
            }
            $element.addClass('haaga__small--width-0');
        }
    };

    var showElements = function showElements() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        for (var index = 0; index < args.length; index++) {
            $("." + args[index]).addClass('haaga__small--width-25');
        }
    };

    var createNode = function createNode(element) {
        return document.createElement(element);
    };

    var createTextNode = function createTextNode(text) {
        return document.createTextNode(text);
    };

    var $amicaButton = $('.amica__center__button');

    $amicaButton.on('click', function (event) {
        event.preventDefault();
        $('.amica').addClass('amica__small--width-25 amica--border');
        hideElements('haaga');
        $(this).fadeOut(1000); //hides the clicked button

        var p = createNode('p'),
            text = createTextNode('Helia-Bistro is a student café located in Haaga-Helia, Pasila, in Helsinki, next to Helsinki Fair Centre. Every day, we serve vegetarian dish, vegetarian soup and salad lunches. Students eating lunch at Helia-Bistro are entitled to a Kela meal subsidy.');
        p.appendChild(text);

        $('.amica__center img').after(p);
        var data = void 0;
        var d = new Date();
        getData('http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en', function (result) {
            data = result.MenusForDays;
            return data;
        });

        console.log(data);
    });
});