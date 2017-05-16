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

    if ($(window).width() < 1100 && $(window).load()) { // 1210
        $(".page-header").hide();
        $(".selection_area").hide();
        $("#map").hide();
        $("#info").hide();

        $(".temporary").fadeIn();
    }

    if ($(window).load()) {
        if ($(window).width() < 1100) {
            $(".page-header").hide();
            $(".selection_area").hide();
            $("#map").hide();
            $("#info").hide();

            $(".temporary").fadeIn();
        }
    }

    $(window).resize(function() {
        if ($(window).width() < 1100 && $(window).load()) {
            $(".page-header").fadeOut();
            $(".selection_area").fadeOut();
            $("#map").fadeOut();
            $("#info").fadeOut();
            $(".card").fadeOut();
            $(".small-card").fadeOut();
            $(".tooltip").fadeOut();
            $(".back-top").fadeOut();

            $(".temporary").fadeIn();
        }
        else {
            location.reload();
            // $(".page-header").fadeIn();
            // $(".temporary").fadeOut();
            // if ($('#info').hasClass('compared')) {
            //     $(".card").fadeIn();
            //     $(".small-card").fadeIn();
            //     $(".tooltip").fadeIn();
            //     $(".back-top").fadeIn();
            // } else {
            //     $(".selection_area").fadeIn();
            //     $("#map").fadeIn();
            //     $("#info").fadeIn();
            // }
        }

        // if ($(window).load()) {
        //     if ($(window).width() < 1100) {
        //         $(".page-header").fadeOut(500);
        //         $(".selection_area").fadeOut();
        //         $("#map").fadeOut(500);
        //         $("#info").hide();
        //
        //         $(".temporary").fadeIn();
        //     }
        // }
        // else {
        //     $(".page-header").fadeIn();
        //     $(".selection_area").fadeIn();
        //     $("#map").fadeIn();
        //     $("#info").fadeIn();
        //
        //     $(".temporary").fadeOut();
        // }

    });});