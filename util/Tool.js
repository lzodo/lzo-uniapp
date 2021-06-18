/*-工具类-*/
export default class Tool {
	constructor() {}

	//动态ico
	static createTitleIco(url) {
		var link =
			document.querySelector("link[rel*='icon']") ||
			document.createElement("link");
		link.type = "image/x-icon";
		link.rel = "shortcut icon";
		link.href = url;
		document.getElementsByTagName("head")[0].appendChild(link);
	}
	//时间转换
	static dateFormat(val, state) {
		let st = state || 0;
		let value = new Date(val);
		let year = value.getFullYear();
		let month = this.padDate(value.getMonth() + 1);
		let day = this.padDate(value.getDate());
		let hour = this.padDate(value.getHours());
		let minutes = this.padDate(value.getMinutes());
		let seconds = this.padDate(value.getSeconds());
		if (st == 0) {
			return (
				year +
				"-" +
				month +
				"-" +
				day +
				" " +
				hour +
				":" +
				minutes +
				":" +
				seconds
			);
		} else if (st == 1) {
			return [
				year + "-" + month + "-" + day,
				hour + ":" + minutes + ":" + seconds
			];
		}
	}
	static padDate(val) {
		val = val < 10 ? "0" + val : val;
		return val;
	}
	// 判断对象所有属性是否都为空
	static objectKeyIsEmpty(obj, not) {
		let empty = null;
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (key != not) {
					if (obj[key] == null || obj[key] == "") {
						empty = true;
					} else {
						empty = false;
						break;
					}
				}
			}
		}
		return empty;
	}
	//获取?后面所有参数
	static getUrlParams() {
		let url = window.location.search;
		let theRequest = new Object();
		if (url.indexOf("?") != -1) {
			let str = url.substr(1);
			let strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = decodeURIComponent(
					strs[i].split("=")[1]
				);
			}
		}
		return theRequest;
	}

	//滚动到底部
	static scrollpage(ele, pageEle, top, callback, callback2) {
		$(ele).scroll(function(e) {
			var scrollTop = $(this).scrollTop();
			var docHeight = $(document).height();
			var pageHeight = $(pageEle).height() + top;
			//有些手机产生小数点使scrollTop + docHeight 无法达到pageHeight大小
			if (scrollTop + docHeight + 2 >= pageHeight) {
				callback();
			}
			// callback2(scrollTop + docHeight,pageHeight)
			// console.log('======================')
			// console.log(scrollTop)
			// console.log(docHeight)
			// console.log(scrollTop + docHeight)
			// console.log(pageHeight)
			// console.log('======================')
		});
	}
	//IOS blur
	static iosBlur() {
		let self = this;
		$("input,select,textarea").blur(function() {
			let win = self.getOS();
			if (win == "MacOSX" || win == "ios") {
				setTimeout(function() {
					var scrollHeight =
						document.documentElement.scrollTop ||
						document.body.scrollTop ||
						0;
					window.scrollTo(0, Math.max(scrollHeight - 1, 0));
					console.log("iosblur");
				}, 100);
			}
		});
	}
	static overscroll(el) {
		el.addEventListener("touchstart", function() {
			var top = el.scrollTop,
				totalScroll = el.scrollHeight,
				currentScroll = top + el.offsetHeight;
			if (top === 0) {
				el.scrollTop = 1;
			} else if (currentScroll === totalScroll) {
				el.scrollTop = top - 1;
			}
		});

		el.addEventListener("touchmove", function(evt) {
			if (el.offsetHeight < el.scrollHeight) evt._isScroller = true;
		});

		document.body.addEventListener("touchmove", function(evt) {
			if (!evt._isScroller) {
				evt.preventDefault();
			}
		});
	}

	//返回?后面指定的参数
	static getQueryString(Paras) {
		return this.getUrlParams()[Paras];
	}

	/**
	 * 设置标题页
	 */
	static setTitle(title) {
		document.title = title ? title : "";
		var mobile = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(mobile)) {
			var iframe = document.createElement("iframe");
			iframe.style.visibility = "hidden";
			iframe.setAttribute("src", "");
			var iframeCallback = function() {
				setTimeout(function() {
					iframe.removeEventListener("load", iframeCallback);
					document.body.removeChild(iframe);
				}, 0);
			};
			iframe.addEventListener("load", iframeCallback);
			document.body.appendChild(iframe);
		}
	}
	/**
	 *
	 * @desc 获取操作系统类型
	 * @return {String}
	 */
	static getOS() {
		var userAgent =
			("navigator" in window &&
				"userAgent" in navigator &&
				navigator.userAgent.toLowerCase()) ||
			"";
		var vendor =
			("navigator" in window &&
				"vendor" in navigator &&
				navigator.vendor.toLowerCase()) ||
			"";
		var appVersion =
			("navigator" in window &&
				"appVersion" in navigator &&
				navigator.appVersion.toLowerCase()) ||
			"";

		if (/mac/i.test(appVersion)) return "MacOSX";
		if (/win/i.test(appVersion)) return "windows";
		if (/linux/i.test(appVersion)) return "linux";
		if (
			/iphone/i.test(userAgent) ||
			/ipad/i.test(userAgent) ||
			/ipod/i.test(userAgent)
		)
			"ios";
		if (/android/i.test(userAgent)) return "android";
		if (/win/i.test(appVersion) && /phone/i.test(userAgent))
			return "windowsPhone";
	}
}
