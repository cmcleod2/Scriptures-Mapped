/*=======================================================================
 * FILE: chapter.js
 * AUTHOR: Christopher McLeod
 * DATE: Winter 2021
 *
 * DESCIRPTION: Module to create and navigate chapter content.
 *               IS 542, Winter 2021, BYU
*/
/*jslint
    browser, long
*/
/*property
    content, element, forEach, freeze, getElementById, href, id, innerHTML,
    link, numChapters, parentBookId, querySelectorAll, requestChapter,
    setupMarkers, title, tocName, volumeForId
*/

/*--------------------------------------------------------------------
*               IMPORTS
*/
import Html from "./htmlHelper.js";
import MapScripApi from "./mapScripApi.js";
import {books} from "./mapScripApi.js";
import MapHelper from "./mapHelper.js";
import injectBreadcrumbs from "./breadcrumbs.js";

/*--------------------------------------------------------------------
*               CONSTANTS
*/
const CLASS_ICON = "material-icons";
const CLASS_NEXTPREV = "nextprev";
const ICON_NEXT = "skip_next";
const ICON_PREVIOUS = "skip_previous";
const TAG_SPAN = "span";
const VALUE_0 = 0;
const VALUE_1 = 1;
const VALUE_2 = 2;
const VALUE_350 = 350;
const VALUE_100percent = "100%";
const VALUE_neg100percent = "-100%";

/*--------------------------------------------------------------------
*               PRIVATE VARIABLES
*/
let trackArr = [];
let requestedBookId;
let requestedChapter;
let requestedNextPrevious;
let offScreen = "scripnav2";
let visible = "scripnav1";

/*--------------------------------------------------------------------
*               PRIVATE METHODS
*/
const animate = function () {
    let current = `${requestedBookId}:${requestedChapter}`;

    if (current === trackArr[0].prev) {
        $(`#${offScreen}`).css({left: VALUE_neg100percent, top: VALUE_0, height: VALUE_100percent, opacity: VALUE_1});
        $(`#${offScreen}`).animate({left: VALUE_0}, {duration: VALUE_350});
        $(`#${visible}`).animate({left: VALUE_100percent}, {duration: VALUE_350});
        $(`#${offScreen}`).css({zIndex: VALUE_2});
        $(`#${visible}`).css({zIndex: VALUE_1});
    } else {
        $(`#${offScreen}`).css({left: VALUE_100percent, top: VALUE_0, height: VALUE_100percent, opacity: VALUE_1});
        $(`#${offScreen}`).animate({left: VALUE_0}, {duration: VALUE_350});
        $(`#${visible}`).animate({left: VALUE_neg100percent}, {duration: VALUE_350});
        $(`#${offScreen}`).css({zIndex: VALUE_2});
        $(`#${visible}`).css({zIndex: VALUE_1});
    }

    let temp = offScreen;
    offScreen = visible;
    visible = temp;
};

const getScripturesCallback = function (chapterHtml) {
    let book = books[requestedBookId];

    document.getElementById(offScreen).innerHTML = chapterHtml;

    animate();

    document.querySelectorAll(".navheading").forEach(function (element) {
        element.innerHTML += `<div class="${CLASS_NEXTPREV}">${requestedNextPrevious}</div>`;
    });

    if (book !== undefined) {
        injectBreadcrumbs(MapScripApi.volumeForId(book.parentBookId), book, requestedChapter);
    } else {
        injectBreadcrumbs();
    }

    MapHelper.setupMarkers(visible);
};

const getScripturesFailure = function (error) {
    document.getElementById(visible).innerHTML = `Unable to retrieve chapter contents. ${error}`;
    injectBreadcrumbs();
};

const navigateChapter = function (bookId, chapter) {
    requestedBookId = bookId;
    requestedChapter = chapter;

    if (trackArr.length >= 2) {
        trackArr.shift();
    }

    let newHist = {};

    let nextPrev = previousChapter(bookId, chapter);


    if (nextPrev === undefined) {
        requestedNextPrevious = "";
        newHist.prev = "None"
    } else {
        requestedNextPrevious = nextPreviousMarkup(nextPrev, ICON_PREVIOUS);
        newHist.prev = `${nextPrev[0]}:${nextPrev[1]}`;
    }

    nextPrev = nextChapter(bookId, chapter);

    if (nextPrev === undefined) {
        newHist.next = "None";
    }
    if (nextPrev !== undefined) {
        requestedNextPrevious += nextPreviousMarkup(nextPrev, ICON_NEXT);
        newHist.next = `${nextPrev[0]}:${nextPrev[1]}`;
    }

    trackArr.push(newHist);

    MapScripApi.requestChapter(bookId, chapter, getScripturesCallback, getScripturesFailure);
};

const nextChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== undefined) {
        if (chapter < book.numChapters) {
            return [
                bookId,
                chapter + 1,
                titleForBookChapter(book, chapter + 1)
            ];
        }

        let nextBook = books[bookId + 1];

        if (nextBook !== undefined) {
            let nextChapterValue = 0;

            if (nextBook.numChapters > 0) {
                nextChapterValue = 1;
            }

            return [
                nextBook.id,
                nextChapterValue,
                titleForBookChapter(nextBook, nextChapterValue)
            ];
        }
    }
};

const nextPreviousMarkup = function (nextPrev, icon) {
    return Html.link({
        content: Html.element(TAG_SPAN, icon, CLASS_ICON),
        href: `#0:${nextPrev[0]}:${nextPrev[1]}`,
        title: nextPrev[2]
    });
};

const previousChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== undefined) {
        if (chapter > 1) {
            return [
                bookId,
                chapter - 1,
                titleForBookChapter(book, chapter - 1)
            ];
        }

        let nextBook = books[bookId - 1];

        if (nextBook !== undefined) {
            let nextChapterValue = 0;

            if (nextBook.numChapters > 0) {
                nextChapterValue = nextBook.numChapters;
            }

            return [
                nextBook.id,
                nextChapterValue,
                titleForBookChapter(nextBook, nextChapterValue)
            ];
        }
    }
};

const titleForBookChapter = function (book, chapter) {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }
};

/*--------------------------------------------------------------------
*               PUBLIC API
*/
export default Object.freeze(navigateChapter);