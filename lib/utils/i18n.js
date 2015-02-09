var _ = require("lodash");
var path = require("path");
var fs = require("fs");

var I18N_PATH = path.resolve(__dirname, "../../theme/i18n/")

var getLocales = _.memoize(function() {
	var locales = fs.readdirSync(I18N_PATH);
	return _.chain(locales)
        .map(function(local) {
            local = path.basename(local, ".json");
            return [local, _.extend(require(path.join(I18N_PATH, local)), {
            	id: local
            })];
        })
        .object()
        .value();
});

var getLanguages = function() {
	return _.keys(getLocales());
};

var getByLanguage = function(lang) {
	lang = normalizeLanguage(lang);
	var locales = getLocales();
	return locales[lang];
};

var compareLocales = function(lang, locale) {
	var langMain = _.first(lang.split("-"));
	var localeMain = _.first(locale.split("-"));

	if (locale == lang) return 100;
	if (localeMain == langMain) return 50;
	return 0;
};

var normalizeLanguage = _.memoize(function(lang) {
	var locales = getLocales();
	var language = _.chain(locales)
		.values()
		.map(function(locale) {
			locale = locale.id;

			return {
				locale: locale,
				score: compareLocales(lang, locale)
			}
		})
		.sortBy("score")
		.pluck("locale")
		.last()
		.value();
	return language || lang;
});

module.exports = {
	getLocales: getLocales,
	getLanguages: getLanguages,
	getByLanguage: getByLanguage,
	normalizeLanguage: normalizeLanguage
};