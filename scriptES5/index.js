"use strict";

require("babel-polyfill");

var left = document.getElementsByClassName("left");
var right = document.getElementsByClassName("right");

var topNav = document.getElementsByClassName("topNav");
var menuSide = document.getElementsByClassName("menuSide");

var cont = document.getElementsByClassName("content");

var leftContent = document.getElementsByClassName("leftContent");
var rightContent = document.getElementsByClassName("rightContent");

function tog(elementName, className) {
	elementName.classList.toggle(className);
}

function leftToggle() {
	tog(left[0], "twenty");

	right[0].classList.toggle("eighty");

	topNav[1].classList.remove("hide");
	topNav[1].classList.toggle("show");

	menuSide[0].classList.toggle("show");
	menuSide[0].classList.remove("hide");
	menuSide[1].classList.toggle("hide");

	cont[0].classList.toggle("hide");
	cont[1].classList.toggle("hide");

	document.getElementById("logo").classList.toggle("hide");
	document.getElementById("menuSideTitleRight").classList.add("hide");

	document.getElementById("menuSideTitleLeft").classList.remove("hide");
	document.getElementById("menuSideTitleLeft").classList.add("show");

	leftContent[0].classList.toggle("hide");
	rightContent[0].classList.toggle("show");
}

function fullRight() {
	left[0].classList.remove("twenty");
	left[0].classList.toggle("eighty");

	right[0].classList.remove("eighty");
	right[0].classList.toggle("twenty");

	topNav[0].classList.toggle("show");

	topNav[1].classList.remove("show");
	topNav[1].classList.toggle("hide");

	menuSide[0].classList.remove("show");
	menuSide[0].classList.toggle("hide");

	menuSide[1].classList.add("show");
	menuSide[1].classList.remove("hide");

	document.getElementById("menuSideTitleRight").classList.remove("hide");
	document.getElementById("menuSideTitleRight").classList.add("show");

	document.getElementById("menuSideTitleLeft").classList.add("hide");
	leftContent[0].classList.toggle("show");
	leftContent[0].classList.remove("hide");

	rightContent[0].classList.remove("show");
}

function rightToggle() {
	left[0].classList.toggle("eighty");
	right[0].classList.toggle("twenty");

	//left[0].style.boxShadow = "none";
	//right[0].style.boxShadow = "10px 20px 30px blue";

	topNav[0].classList.toggle("show");
	menuSide[1].classList.toggle("show");
	menuSide[0].classList.toggle("hide");

	cont[0].classList.toggle("hide");
	cont[1].classList.toggle("hide");

	document.getElementById("logo").classList.toggle("hide");

	document.getElementById("menuSideTitleRight").classList.remove("hide");
	document.getElementById("menuSideTitleRight").classList.add("show");

	document.getElementById("menuSideTitleLeft").classList.add("hide");

	leftContent[0].classList.toggle("show");
	leftContent[0].classList.remove("hide");
}

function fullLeft() {
	left[0].classList.remove("eighty");
	left[0].classList.toggle("twenty");

	right[0].classList.remove("twenty");
	right[0].classList.toggle("eighty");

	topNav[0].classList.remove("show");

	topNav[1].classList.remove("hide");
	topNav[1].classList.add("show");

	menuSide[0].classList.add("show");
	menuSide[0].classList.remove("hide");

	menuSide[1].classList.remove("show");
	menuSide[1].classList.add("hide");

	document.getElementById("menuSideTitleLeft").classList.remove("hide");
	document.getElementById("menuSideTitleLeft").classList.add("show");

	document.getElementById("menuSideTitleRight").classList.add("hide");

	leftContent[0].classList.toggle("hide");
	leftContent[0].classList.remove("show");

	rightContent[0].classList.toggle("show");
	leftContent[0].classList.remove("hide");
}

//Popup window function -add class "show" and overwrite overlay
function popup(country, picNum) {
	var x = document.getElementsByClassName(country);
	var y = x[0].getElementsByClassName("overlay");
	y[picNum].classList.toggle("show");
}

//Close the popup window -remove class "show" -overlay has visibility hidden 
function closeIt(country, picNum) {
	var x = document.getElementsByClassName(country);
	var y = x[0].getElementsByClassName("overlay");
	y[picNum].classList.remove("show");
}

$(document).ready(function () {
	$('.topNav li a').click(function (e) {
		$('div.topNav li a').removeClass('white');
		$(e.currentTarget).addClass('white');
	});

	//var obj = $(".picture").get(1);
	// $(obj).draggable();
});