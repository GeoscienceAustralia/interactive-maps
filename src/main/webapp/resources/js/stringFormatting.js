// http://jsperf.com/js-camelcase

String.prototype.toCamelCase = function () {
	"use strict";
	return this.replace(/\s(.)/g, function ($1) {
		return $1.toUpperCase();
	}).replace(/\s/g, '').replace(/^(.)/, function ($1) {
		return $1.toLowerCase();
	});
};

String.prototype.camelizeOne = function () {
	"use strict";
	return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
		return index == 0
			? letter.toLowerCase()
			: letter.toUpperCase();
	}).replace(/\s+/g, '');
};

String.prototype.camelizeTwo = function () {
	"use strict";
	return this.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
		if (+match === 0)
			return ""; // or if (/\s+/.test(match)) for white spaces
		return index == 0
			? match.toLowerCase()
			: match.toUpperCase();
	});
};

String.prototype.toUpperCaseFirstChar = function () {
	"use strict";
	return this.substr(0, 1).toUpperCase() + this.substr(1);
};

String.prototype.toLowerCaseFirstChar = function () {
	"use strict";
	return this.substr(0, 1).toLowerCase() + this.substr(1);
};

String.prototype.toUpperCaseEachWord = function (delim) {
	"use strict";
	delim = delim
		? delim
		: ' ';
	return this.split(delim).map(function (v) {
		return v.toUpperCaseFirstChar();
	}).join(delim);
};

String.prototype.toLowerCaseEachWord = function (delim) {
	"use strict";
	delim = delim
		? delim
		: ' ';
	return this.split(delim).map(function (v) {
		return v.toLowerCaseFirstChar();
	}).join(delim);
};