/*=======================================================================
 * FILE: mapScripApi.js
 * AUTHOR: Christopher McLeod
 * DATE: Winter 2021
 *
 * DESCIRPTION: Module to get data from scriptures.byu.edu.
 *               IS 542, Winter 2021, BYU
*/
/*jslint
    browser, long
*/
/*property
    anchor, books, classKey, content, div, element, forEach, freeze, fullName,
    getElementById, gridName, hash, href, id, innerHTML, length, link,
    numChapters, parentBookId, slice, split, volumeForId
*/


/*--------------------------------------------------------------------
*               IMPORTS
*/
import Html from "./htmlHelper.js";
import MapScripApi from "./mapScripApi.js";
import {books} from "./mapScripApi.js";
import {volumes} from "./mapScripApi.js";
import injectBreadcrumbs from "./breadcrumbs.js";
import navigateChapter from "./chapter.js";


/*--------------------------------------------------------------------
*               CONSTANTS
*/
const BOTTOM_PADDING = "<br /><br />";
const CLASS_BOOKS = "books";
const CLASS_BUTTON = "waves-effect waves-light btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const DIV_SCRIPTURE_NAVIGATOR = "scripnav";
const TAG_HEADER5 = "h4";
const VALUE_0 = 0;
const VALUE_1 = 1;
const VALUE_2 = 2;
const VALUE_350 = 350;
const VALUE_100percent = "100%";

/*--------------------------------------------------------------------
*               PRIVATE VARIABLES
*/
let offScreen = "scripnav2";
let visible = "scripnav1";

/*--------------------------------------------------------------------
*               PRIVATE METHODS
*/
const animate = function () {
    $(`#${offScreen}`).css({left: VALUE_0, top: VALUE_0, height: VALUE_100percent, opacity: VALUE_0});
    $(`#${offScreen}`).animate({opacity: VALUE_1}, {duration: VALUE_350});
    $(`#${visible}`).animate({opacity: VALUE_0}, {duration: VALUE_350});
    $(`#${offScreen}`).css({zIndex: VALUE_2});
    $(`#${visible}`).css({zIndex: VALUE_1});

    let temp = offScreen;
    offScreen = visible;
    visible = temp;
};

const bookChapterValid = function (bookId, chapter) {
    let book = books[bookId];

    if (book === undefined || chapter < 0 || chapter > book.numChapters) {
        return false;
    }

    if (chapter === 0 && book.numChapters > 0) {
        return false;
    }

    return true;
};

const booksGrid = function (volume) {
    return Html.div({
        classKey: CLASS_BOOKS,
        content: booksGridContent(volume)
    });
};

const booksGridContent = function (volume) {
    let gridContent = "";

    volume.books.forEach(function (book) {
        gridContent += Html.link({
            classKey: CLASS_BUTTON,
            id: book.id,
            href: `#${volume.id}:${book.id}`,
            content: book.gridName
        });
    });

    return gridContent;
};

const chaptersGrid = function (book) {
    return Html.div({
        classKey: CLASS_VOLUME,
        content: Html.element(TAG_HEADER5, book.fullName)
    }) + Html.div({
        classKey: CLASS_BOOKS,
        content: chaptersGridContent(book)
    });
};

const chaptersGridContent = function (book) {
    let gridContent = "";
    let chapter = 1;

    while (chapter <= book.numChapters) {
        gridContent += Html.link({
            classKey: `${CLASS_BUTTON} ${CLASS_CHAPTER}`,
            id: chapter,
            href: `#0:${book.id}:${chapter}`,
            content: chapter
        });

        chapter += 1;
    }

    return gridContent + BOTTOM_PADDING;
};

const navigateBook = function (bookId) {
    let book = books[bookId];

    if (book.numChapters <= 1) {
        navigateChapter(bookId, book.numChapters);
    } else {
        document.getElementById(offScreen).innerHTML = Html.div({
            id: DIV_SCRIPTURE_NAVIGATOR,
            content: chaptersGrid(book)
        });

        animate();

        injectBreadcrumbs(MapScripApi.volumeForId(book.parentBookId), book);
    }
};

const navigateHome = function (volumeId) {
    document.getElementById(offScreen).innerHTML = Html.div({
        id: DIV_SCRIPTURE_NAVIGATOR,
        content: volumesGridContent(volumeId)
    });

    animate();

    injectBreadcrumbs(MapScripApi.volumeForId(volumeId));
};



const onHashChanged = function () {

    let ids = [];

    if (location.hash !== "" && location.hash.length > 1) {
        ids = location.hash.slice(1).split(":");
    }

    if (ids.length <= 0) {
        navigateHome();
    } else if (ids.length === 1) {
        let volumeId = Number(ids[0]);

        if (volumeId < volumes[0].id || volumeId > volumes.slice(-1)[0].id) {
            navigateHome();
        } else {
            navigateHome(volumeId);
        }
    } else {
        let bookId = Number(ids[1]);

        if (books[bookId] === undefined) {
            navigateHome();
        } else {
            if (ids.length === 2) {
                navigateBook(bookId);
            } else {
                let chapter = Number(ids[2]);

                if (bookChapterValid(bookId, chapter)) {
                    navigateChapter(bookId, chapter);
                } else {
                    navigateHome();
                }
            }
        }
    }
};

const volumesGridContent = function (volumeId) {
    let gridContent = "";

    volumes.forEach(function (volume) {
        if (volumeId === undefined || volumeId === volume.id) {
            gridContent += Html.div({
                classKey: CLASS_VOLUME,
                content: Html.anchor(volume) + Html.element(TAG_HEADER5, volume.fullName)
            });

            gridContent += booksGrid(volume);
        }
    });

    return gridContent + BOTTOM_PADDING;
};

/*--------------------------------------------------------------------
*               PUBLIC API
*/
export default Object.freeze(onHashChanged);