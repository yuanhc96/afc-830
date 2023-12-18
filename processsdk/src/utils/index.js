function debounce(func, wait) {
	// 防抖
	let timeout = null;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func();
		}, wait);
	};
}

function getDomReact(dom) {
	// 获取节dom置信息
	return dom.getBoundingClientRect();
}

function getLength(start, end) {
	// 获取两点连线长度
	return Math.sqrt(
		Math.pow(end[1] - start[1], 2) + Math.pow(end[0] - start[0], 2)
	);
}

function getTextWidth(text, fontSize) {
	// 获取文字宽度
	const span = document.createElement("span");
	span.innerHTML = text;
	span.style.position = "fixed";
	span.style.opacity = "0";
	span.style.fontSize = fontSize;
	document.body.appendChild(span);
	const width = span.getBoundingClientRect().width;
  // removeElement(span)
	// span.remove();
	return width;
}

// function removeElement(_element){
//   var _parentElement = _element.parentNode;
//   if(_parentElement){
//          _parentElement.removeChild(_element);
//   }
// }
function getNodeById(id) {
	// 获取节点 dom
	return document.getElementById(id);
}

function err(data) {
	throw console.error(data);
}

function getType(data) {
	const str = Object.prototype.toString.call(data);
	if (str === "[object Object]") {
		return "object";
	} else if (str === "[object Array]") {
		return "array";
	} else if (str === "[object String]") {
		return "string";
	} else {
		return "";
	}
}

function getStyle(obj) {
	let str = "";
	for (const i in obj) {
		str += i + ":" + obj[i] + ";";
	}
	return str;
}

function svgImageBase64() {
	return "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+";
}

function getSlope(start, end) {
	// 获得斜率
	const yStep = end[1] - start[1];
	const xStep = end[0] - start[0];
	return yStep / xStep;
}

function is(source, target) {
	// 判断两个数据结构是否相同
	function arrayIs(data0, data1) {
		if (data0.length === data1.length) {
			data0.forEach((item, index) => {
				if (getType(item) === "object") {
					// console.log(objectIs(item, data1[index]))
					return objectIs(item, data1[index]);
				}
			});
		}
		return false;
	}

	function objectIs(data0, data1) {
		let type = true;
		for (const i in data0) {
			if (getType(source[i]) === "array") {
				type = arrayIs(data0[i], data1[i]);
			} else if (getType(source[i]) === "object") {
				type = objectIs(data0[i], data1[i]);
			} else if (data0[i] !== data1[i]) {
				type = false;
			}
		}
		return type;
	}
	if (source && target) {
		for (const i in source) {
			if (getType(source[i]) === "array") {
				return arrayIs(source[i], target[i]);
			} else if (getType(source[i]) === "object") {
				return objectIs(source[i], target[i]);
			}
		}
	}
	return source === target;
}

export default {
	debounce,
	getDomReact,
	getLength,
	getTextWidth,
	getNodeById,
	err,
	getType,
	svgImageBase64,
	getStyle,
	getSlope,
	is,
};
