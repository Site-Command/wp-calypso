/**
* Functions for working with theme search filters. The filter syntax is
* {taxonomy}:{term}
*
* Valid values for {taxonomy} and {term} are contained in the
* `taxonomies` object.
*/

/**
 * External dependencies
 */
import forIn from 'lodash/forIn';
import omitBy from 'lodash/omitBy';
import includes from 'lodash/includes';

// Regular expressions for matching "taxonomy:term" search-box syntax
const FILTER_REGEX_STRING = '(\\w+)\\:([\\w-]*)';
const FILTER_REGEX_GLOBAL = new RegExp( FILTER_REGEX_STRING, 'g' );
const FILTER_REGEX_SINGLE = new RegExp( '^' + FILTER_REGEX_STRING + '$' );
const FILTER_TAXONOMY_GROUP = 1;
const FILTER_TERM_GROUP = 2;

/* eslint-disable */
/* Autogenerated object */
const taxonomies = {
    "color": [
        "black",
        "blue",
        "brown",
        "dark",
        "gray",
        "green",
        "light",
        "orange",
        "pink",
        "purple",
        "red",
        "silver",
        "tan",
        "white",
        "yellow"
    ],
    "column": [
        "four-columns",
        "left-sidebar",
        "one-column",
        "right-sidebar",
        "three-columns",
        "two-columns"
    ],
    "feature": [
        "accessibility-ready",
        "author-bio",
        "blog-excerpts",
        "breadcrumb-navigation",
        "classic-menu",
        "custom-background",
        "custom-colors",
        "custom-header",
        "custom-menu",
        "editor-style",
        "featured-content-with-pages",
        "featured-image-header",
        "featured-images",
        "fixed-menu",
        "flexible-header",
        "front-page-post-form",
        "full-width-template",
        "infinite-scroll",
        "microformats",
        "multiple-menus",
        "one-page",
        "portfolio",
        "post-formats",
        "post-slider",
        "rtl-language-support",
        "site-logo",
        "sticky-post",
        "testimonials",
        "theme-options",
        "threaded-comments",
        "translation-ready",
        "video",
        "wordads"
    ],
    "layout": [
        "fixed-layout",
        "fluid-layout",
        "grid-layout",
        "responsive-layout"
    ],
    "picks": [
        "featured",
        "staff-picks",
        "takashi-collection"
    ],
    "subject": [
        "announcement",
        "art",
        "artwork",
        "blog",
        "business",
        "cartoon",
        "collaboration",
        "craft",
        "design",
        "education",
        "fashion",
        "food",
        "gaming",
        "holiday",
        "hotel",
        "journal",
        "lifestream",
        "magazine",
        "major-league-baseball",
        "mlb",
        "music",
        "nature",
        "news",
        "outdoors",
        "partner",
        "photoblogging",
        "photography",
        "portfolio",
        "productivity",
        "real-estate",
        "school",
        "scrapbooking",
        "seasonal",
        "sports",
        "travel",
        "tumblelog",
        "video",
        "wedding"
    ],
    "style": [
        "abstract",
        "artistic",
        "bright",
        "clean",
        "colorful",
        "conservative",
        "contemporary",
        "curved",
        "dark",
        "earthy",
        "elegant",
        "faded",
        "flamboyant",
        "flowery",
        "formal",
        "funny",
        "futuristic",
        "geometric",
        "glamorous",
        "grungy",
        "hand-drawn",
        "handcrafted",
        "humorous",
        "industrial",
        "light",
        "metallic",
        "minimal",
        "modern",
        "natural",
        "paper-made",
        "playful",
        "professional",
        "retro",
        "simple",
        "sophisticated",
        "tech",
        "textured",
        "traditional",
        "urban",
        "vibrant",
        "whimsical"
    ]
};
/* eslint-enable */

/**
 * @return {Object} [taxonomies][terms]
 */
export function getTaxonomies( ) {
	return taxonomies;
}

let termTable;
let ambiguousTerms;

/**
 * @return {Object} a table of terms to taxonomies.
 */
function getTermTable() {
	if ( ! termTable ) {
		termTable = {};
		forIn( taxonomies, ( terms, taxonomy ) => {
			terms.forEach( ( term ) => {
				const key = isTermAmbiguous( term ) ? `${ taxonomy }:${ term }` : term;
				termTable[ key ] = taxonomy;
			} );
		} );
	}
	return termTable;
}

// Ambiguous = belongs to more than one taxonomy
function isTermAmbiguous( term ) {
	if ( ! ambiguousTerms ) {
		const ambiguousTermTable = omitBy( getTermCount(), ( count ) => count < 2 );
		ambiguousTerms = Object.keys( ambiguousTermTable );
	}
	return includes( ambiguousTerms, term );
}

function getTermCount() {
	const termCount = {};
	forIn( taxonomies, ( terms ) => {
		terms.forEach( ( term ) => {
			const count = termCount[ term ];
			termCount[ term ] = count ? count + 1 : 1;
		} );
	} );
	return termCount;
}

// return specified part of a taxonomy:term string
function splitFilter( filter, group ) {
	const match = filter.match( FILTER_REGEX_SINGLE );
	if ( match ) {
		return match[ group ];
	}
	return '';
}

// return term from a taxonomy:term string
function getTerm( filter ) {
	const term = splitFilter( filter, FILTER_TERM_GROUP );
	if ( isTermAmbiguous( term ) ) {
		return `${ getTaxonomy( filter ) }:${ term }`;
	}
	return term;
}

function stripTermPrefix( term ) {
	return term.replace( /^\w+:/, '' );
}

// return taxonomy from a taxonomy:term string
function getTaxonomy( filter ) {
	return splitFilter( filter, FILTER_TAXONOMY_GROUP );
}

/**
 * Given the 'term' part, returns a complete filter
 * in "taxonomy:term" search-box format.
 *
 * Supplied terms that belong to more than one taxonomy must be
 * prefixed taxonomy:term
 *
 * @param {string} term - the term slug
 * @return {string} - complete taxonomy:term filter, or empty string if term is not valid
 */
export function getFilter( term ) {
	const terms = getTermTable();
	if ( terms[ term ] ) {
		return `${ terms[ term ] }:${ stripTermPrefix( term ) }`;
	}
	return '';
}

/**
 * Checks that a taxonomy:term filter is valid, using the theme
 * taxonomy data.
 *
 * @param {string} filter - filter in form taxonomy:term
 * @return {boolean} true if filter pair is valid
 */
export function filterIsValid( filter ) {
	return getTermTable()[ getTerm( filter ) ] === getTaxonomy( filter );
}

/**
 * Return a sorted array of filter terms.
 *
 * Sort is alphabetical on the complete "taxonomy:term" string.
 *
 * Supplied terms that belong to more than one taxonomy must be
 * prefixed taxonomy:term. Returned terms will
 * keep this prefix.
 *
 * @param {array} terms - Array of term strings
 * @return {array} sorted array
 */
export function sortFilterTerms( terms ) {
	return terms.map( getFilter ).filter( filterIsValid ).sort().map( getTerm );
}

/**
 * Return a string of valid, sorted, comma-separated filter
 * terms from an input string. Input may contain search
 * terms (which will be ignored) as well as filters.
 *
 * Returned terms that belong to more than one taxonomy will be
 * prefixed taxonomy:term
 *
 * @param {string} input - the string to parse
 * @return {string} comma-seperated list of valid filters
 */
export function getSortedFilterTerms( input ) {
	const matches = input.match( FILTER_REGEX_GLOBAL );
	if ( matches ) {
		const terms = matches.filter( filterIsValid ).map( getTerm );
		return sortFilterTerms( terms ).join( ',' );
	}
	return '';
}

/**
 * Strips any "taxonomy:term" filter strings from the input.
 *
 * @param {string} input - the string to parse
 * @return {string} input string minus any filters
 */
export function stripFilters( input ) {
	const withoutFilters = input.replace( FILTER_REGEX_GLOBAL, '' ).trim();
	return withoutFilters.replace( /\s+/g, ' ' );
}

export function getSubjects() {
	return taxonomies.subject;
}

/**
 * Returns true for valid term.
 *
 * Supplied terms that belong to more than one taxonomy must be
 * prefixed with taxonomy:term
 *
 * @param {string} term - term to validate
 * @return {bool} true if term is valid
 */
export function isValidTerm( term ) {
	return !! getTermTable()[ term ];
}
