let getData = (url, callback) => {
    $.ajax({
        type: "GET",
        url: url,
        timeout: 2000
    }).done(function (result) {
        callback(result);
    }).fail(function (textStatus, jqXHR) {
        alert("Request failed: " + textStatus)
    }).always(function () {
        console.log("this will always be executed");
    });
};

let todaysFormattedDate = () => {
	let d = new Date(),
  		curr_date = d.getDate(),
      curr_month = d.getMonth() + 1,
      curr_year = d.getFullYear();
  if( curr_month < 10) {
		curr_month = '0' + curr_month;  
  }
  let todaysDate = `${curr_year}-${curr_month}-${curr_date}`;
  return todaysDate;
};

$(function () {
    let hideElements = (...args) => {
        for (let index = 0; index < args.length; index++) {
            let $element = $(`.${args[index]}`);
            if ($element.hasClass('haaga__small--width-25')) {
                $element.removeClass('haaga__small--width-25');
            }
            $element.addClass('haaga__small--width-0');
        }
    }

    let showElements = (...args) => {
        for (let index = 0; index < args.length; index++) {
            $(`.${args[index]}`).addClass('haaga__small--width-25');
        }
    };

    let createNode = (element) => {
        return document.createElement(element);
    };

    let createTextNode = (text) => {
        return document.createTextNode(text);
    };

    let $amicaButton = $('.amica__center__button');


    $amicaButton.on('click', function (event) {
        event.preventDefault();
        $('.amica').addClass('amica__small--width-25 amica--border');
        hideElements('haaga');
        $(this).fadeOut(1000); //hides the clicked button

        let p = createNode('p'),
            text = createTextNode('Helia-Bistro is a student café located in Haaga-Helia, Pasila, in Helsinki, next to Helsinki Fair Centre. Every day, we serve vegetarian dish, vegetarian soup and salad lunches. Students eating lunch at Helia-Bistro are entitled to a Kela meal subsidy.');
        p.appendChild(text);

        $('.amica__center img').after(p);
        let data; 
        var d = new Date();
        getData('http://www.amica.fi/modules/json/json/Index?costNumber=0084&language=en', (result)=> {
            data = result.MenusForDays;
            return data;
        });

        console.log(data)
        
    })



});



