'use strict';

$(function () {
    var hideElements = function hideElements() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        for (var index = 0; index < args.length; index++) {
            var $element = $('.' + args[index]);
            if ($element.hasClass('haaga__small--width-100')) {
                element.removeClass('haaga__small--width-100');
            }
            $element.addClass('haaga__small--width-0');
        }
    };

    var showElements = function showElements() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        for (var index = 0; index < args.length; index++) {
            $('.' + args[index]).addClass('haaga__small--width-100');
        }
    };

    var amicaButton = $('.amica__center__button');
    var haaga = $('.haaga');
    amicaButton.on('click', function (e) {
        e.preventDefault();
        hideElements('haaga');
    });
});