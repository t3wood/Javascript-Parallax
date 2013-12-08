(function ($) {
	var $d = $(document);
	var useTransform = true;
	var useParallax = true;
	var ua = navigator.userAgent;
	var winLoc = window.location.toString();
	var is_webkit = ua.match(/webkit/i);
	var is_firefox = ua.match(/gecko/i);
	var is_newer_ie = ua.match(/msie (9|([1-9][0-9]))/i);
	var is_older_ie = ua.match(/msie/i) && !is_newer_ie;
	var is_ancient_ie = ua.match(/msie 6/i);
	var is_mobile = ua.match(/mobile/i);
	var use2DTransform = (ua.match(/msie 9/i) || winLoc.match(/transform\=2d/i));
	var requestAnimationFrame = null;
	var prefixes, transform;
	var parallaxItems = [];
	var scrollHandler = null;
	var nodes;
	var lastExec = new Date();
	if (winLoc.match(/notransform/i)) {
		useTransform = false;
	}
	if (winLoc.match(/noparallax/i)) {
		useParallax = false;
	}
	if (is_mobile || is_ancient_ie) {
		useParallax = false;
	}
	if (winLoc.match(/useraf/i)) {
		requestAnimationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame);
	}
	prefixes = { webkit: 'webkitTransform', firefox: 'MozTransform', ie: 'msTransform', w3c: 'transform' };
	if (useTransform) {
		if (is_webkit) {
			transform = prefixes.webkit;
		} else if (is_firefox) {
			transform = prefixes.firefox;
		} else if (is_newer_ie) {
			transform = prefixes.ie;
		}
	}
	function ParallaxItem(containerNode) {
		var container, bgElements, offset, bgHeight, containerHeight, maxScrolls, height;
		container = $(containerNode);
		bgElements = container.find('.parallax-background');
		function refreshCoords() {
			offset = container.offset().top;
			containerHeight = container.height();
			bgHeights = [];
			maxScrolls = [];
			bgElements.each(function (idx, item) {
				height = $(item).height();
				bgHeights.push(height);
				maxScrolls.push(containerHeight - height + 2);
			});
		}
		function refresh(docScrollY) {
			var i, j, scroll, transformParam;
			i = 0;
			bgElements.each(function (idx, bgElement) {
				var $bgElement = $(bgElement);
				scroll = -Math.round(((docScrollY - offset) / containerHeight) * maxScrolls[i]);
				scroll = Math.max(scroll, maxScrolls[i]);
				var transformParam;
				if (!use2DTransform) {
					transformParam = 'translate3d(0px,' + scroll + 'px, 0px)';
				} else {
					transformParam = 'translateY(' + scroll + 'px)';
				}
				if (transform && transformParam) {
					$bgElement.css(transform, transformParam);
					$bgElement.css(prefixes.w3c, transformParam);
				}
				else {
					$bgElement.css('marginTop', scroll + 'px');
				}
				i++;
			});
		}
		refreshCoords();
		return { 'refresh': refresh, 'refreshCoords': refreshCoords }
	}
	function refreshParallaxItems() {
		var docScrollY = $d.scrollTop();
		if (!parallaxItems || !parallaxItems.length) {
			return false;
		}
		for (var i = 0, j = parallaxItems.length; i < j; i++) {
			parallaxItems[i].refresh(docScrollY);
		}
	}
	function scrollWatcher() {
		if (requestAnimationFrame) {
			requestAnimationFrame(refreshParallaxItems);
		} else {
			refreshParallaxItems();
		}
	}
	function addParallaxItem(containerNode) {
		parallaxItems.push(new ParallaxItem(containerNode));
		if (!scrollHandler) {
			scrollHandler = $d.scroll(scrollWatcher);
		}
	}
	if (useParallax) {
		nodes = $('#parallax .parallax-item');
		nodes.each(function (idx, item) {
			addParallaxItem(item);
		});
		refreshParallaxItems();
	}


})(jQuery);