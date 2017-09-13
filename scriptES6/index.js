$(function () {
    let hideElements = (...args) => {
        for (let index = 0; index < args.length; index++) {
            let $element = $(`.${args[index]}`);
            if($element.hasClass('haaga__small--width-100')) {
                element.removeClass('haaga__small--width-100');
            }
            $element.addClass('haaga__small--width-0');
        }
    }

    let showElements = (...args) => {
        for (let index = 0; index < args.length; index++) {
            $(`.${args[index]}`).addClass('haaga__small--width-100');
        }
    }

    let amicaButton = $('.amica__center__button');
    let haaga = $('.haaga');
    amicaButton.on('click', function (e) {
        e.preventDefault();
        hideElements('haaga');
    })

    

});