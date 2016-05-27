/**
 * Created by xishiyi7 on 2016/5/26.
 */

if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
	module.exports = 'loading';
}

(function (angular) {
	'use strict';

	angular.module('loading', [])

		.run(['$templateCache', function ($templateCache) {
			     $templateCache.put('loading.html',
			                        "<div class = \"loading-scale {{_loadingCss}} \" ng-style=\"_loadingStyle\" >"
			                        + "<h2 class = \"loading-opacity-h2\" >{{_loadingMessage}}</h2>"
			                        + "<div></div><div></div><div></div><div></div><div></div></div>"
			     );
		     }])
		.service('Loading', ['$q', '$compile', '$templateCache', function ($q, $compile, $templateCache) {

			         /**
			          * Loading class
			          * @param o object
			          * @param success callback
			          * @param error callback
			          * @constructor
			          */
			         var Loading = function (o, success, error) {

				         var options = {
					         q          : o.promise || null,
					         scope      : o.scope || o.$scope || null,
					         ele        : o.element || o.$element || 'body',
					         templateUrl: o.templateUrl,
					         msg        : o.message,
					         size       : o.size,
					         background : o.background,
					         style      : o.style,
					         css        : o.css
				         };

				         var self = this,
					         template = options.templateUrl ? $templateCache.get(options.templateUrl) : $templateCache.get(self.template),
					         templateEle;

				         if (!options.scope) {
					         options.scope = angular.element(options.ele).scope();
				         }

				         // still in the DOM, return
				         if (!self.promises.length) {

					         // global
					         if (options.ele === 'body') {
						         template = "<div>" + template + "</div>";
						         templateEle = $compile(template)(options.scope || null);
						         templateEle
							         .css('position', 'absolute')
							         .css('top', 0)
							         .css('left', 0)
							         .css('right', 0)
							         .css('bottom', 0)
							         .css('background', options.background || 'rgba(160, 160, 160, 0.5)')
							         .css('height', '100%')
							         .css('z-index', '9999');

						         templateEle.children(0)
							         .css('position', 'relative')
							         .css('top', '50%')
							         .css('left', '50%');
					         }
					         else {
						         templateEle = $compile(template)(options.scope || null);
					         }
					         angular.element(options.ele).append(templateEle);
				         }

				         if (angular.isArray(options.q)) {
					         angular.forEach(options.q, function (item) {
						         if (isPromise(item)) {
							         self.promises.push(item);
						         }
					         })
				         }
				         else {
					         if (isPromise(options.q)) {
						         self.promises.push(options.q);
					         }
					         else {
						         return;
					         }
				         }

				         Object.defineProperties(options.scope, {
					         _loadingMessage: {
						         enumerable: false,
						         writable  : true,
						         value     : options.msg || 'loading...'    // loading message
					         },
					         _loadingStyle  : {
						         enumerable: false,
						         writable  : true,
						         value     : angular.extend(angular.isObject(options.style) ? options.style : {}, {'font-size': (options.size || 16) + 'px'})    // style
					         },
					         _loadingCss    : {
						         enumerable: false,
						         writable  : true,
						         value     : options.css || ''    // css
					         }
				         });

				         $q.all(self.promises).then(function () {
					         angular.element(options.ele)[0].removeChild(templateEle[0]);
					         self.promises.length = 0;
					         (success || angular.noop)();
				         }, function () {
					         angular.element(options.ele)[0].removeChild(templateEle[0]);
					         self.promises.length = 0;
					         (error || angular.noop)();
				         });
			         };

			         var isPromise = function (p) {
				         var then = p && (p.then || p.$then || (p.$promise && p.$promise.then));
				         return typeof then !== 'undefined';
			         };

			         Loading.prototype.promises = [];

			         Object.defineProperties(Loading.prototype, {
				         template: {
					         enumerable: false,
					         writable  : false,
					         value     : 'loading.html'
				         }
			         });

			         return Loading;
		         }
		         ])
	;
})
(angular);


