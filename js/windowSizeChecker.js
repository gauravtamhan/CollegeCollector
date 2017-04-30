/*
 * This file contains all of the code for ensuring the browser is
 * set above the minimum width requirement. This is to ensure that all of the
 * elements shown in our visualization are shown large enough so that they
 * are easy to read.
 *
 * This code was adapted from an online example, and then modified to work with
 * our DOM elements and to fit our criteria for checking the browser size.
 *
 */

$(document).ready(function() {

    d3.select("body").append("div")
        .attr("class", "temporary")
        .style("display", "none")
        .append("h2")
        .attr("class", "browserWarning")
        .html("&#8592 Please increase the size of your browser &#8594");

    if ($(window).width() < 1210 && $(window).load()) {
        $(".page-header").hide();
        $(".selection_area").hide();
        $("#map").hide();
        $("#info").hide();

        $(".temporary").fadeIn();
    }

    if ($(window).load()) {
        if ($(window).width() < 1210) {
            $(".page-header").hide();
            $(".selection_area").hide();
            $("#map").hide();
            $("#info").hide();

            $(".temporary").fadeIn();
        }
    }

    $(window).resize(function() {
        if ($(window).width() < 1210 && $(window).load()) {
            $(".page-header").fadeOut();
            $(".selection_area").fadeOut();
            $("#map").fadeOut();
            $("#info").fadeOut();

            $(".temporary").fadeIn();
        }
        else {
            $(".page-header").fadeIn();
            $("#info").fadeIn();
            $(".temporary").fadeOut();
            if ($('#info').hasClass('info')) {
                $(".selection_area").fadeIn();
                $("#map").fadeIn();
            }
        }

        if ($(window).load()) {
            if ($(window).width() < 1210) {
                $(".page-header").fadeOut(500);
                $(".selection_area").fadeOut();
                $("#map").fadeOut(500);
                $("#info").hide();

                $(".temporary").fadeIn();
            }
        }
        else {
            $(".page-header").fadeIn();
            $(".selection_area").fadeIn();
            $("#map").fadeIn();
            $("#info").fadeIn();

            $(".temporary").fadeOut();
        }

    });});