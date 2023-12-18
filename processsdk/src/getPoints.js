import utils from "./utils";

function getPoints({ sourceId, targetId, points }, rurningPoint) {
	// 获取锚点坐标
	const sourceNodeMsg = getNodeAnchor(sourceId);
	const targetNodeMsg = getNodeAnchor(targetId);
	if (sourceId === targetId) {
		// 自己链接自己
		return [
			[sourceNodeMsg.right[0], sourceNodeMsg.right[1] - 5],
			[sourceNodeMsg.right[0] + 20, sourceNodeMsg.right[1] - 5],
			[sourceNodeMsg.right[0] + 20, sourceNodeMsg.top[1] - 20],
			[sourceNodeMsg.top[0] + 10, sourceNodeMsg.top[1] - 20],
			[sourceNodeMsg.top[0] + 10, sourceNodeMsg.top[1]],
		];
	}
	if (rurningPoint === "rurningPoint") {
		console.log("反向链接");
		const point = getAnchorPoint(sourceNodeMsg, targetNodeMsg);
		const centerPoint = [
			point[0][0] + (point[1][0] - point[0][0]) / 2,
			point[0][1] + (point[1][1] - point[0][1]) / 2,
		];
		const slipe = utils.getSlope(point[0], point[1]);
		let len = 100;
		if (Math.abs(slipe) < 1 && Math.abs(slipe) !== 0) {
			len = 50 / Math.abs(slipe);
		}
		const x = len / (1 + Math.pow(1 / slipe, 2));
		const y = x === 0 ? -50 : (-1 / slipe) * x;
		points = [point[0], [centerPoint[0] + x, centerPoint[1] + y], point[1]];
	}

	if (points && points.length > 2) {
		const myPoints = points.slice(0);
		myPoints[0] = getAnchorPoint(sourceNodeMsg, {
			center: points[1],
		})[0];
		myPoints[myPoints.length - 1] = getAnchorPoint(
			{
				center: points[points.length - 2],
			},
			targetNodeMsg
		)[1];
		return myPoints;
	}

	return getAnchorPoint(sourceNodeMsg, targetNodeMsg);
}

function getAnchorPoint(sourceMsg, targetMsg) {
	// 获取连接点的坐标
	const sourceNodeMsg = {
		halfWidth: 0,
		halfHeight: 0,
		...sourceMsg,
	};
	const targetNodeMsg = {
		halfWidth: 0,
		halfHeight: 0,
		...targetMsg,
	};
	const start = sourceNodeMsg.center;
	const end = targetNodeMsg.center;
	const slope = (end[1] - start[1]) / (end[0] - start[0]); // 斜率
	let zuobiaoArr = [];
	if (end[0] > start[0] && Math.abs(slope) < 0.8) {
		// 结束在开始右侧
		if (end[1] >= start[1]) {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] + sourceNodeMsg.halfWidth,
					sourceNodeMsg.center[1] + sourceNodeMsg.halfWidth * slope,
				],
				[
					targetNodeMsg.center[0] - targetNodeMsg.halfWidth,
					targetNodeMsg.center[1] - targetNodeMsg.halfWidth * slope,
				],
			];
		} else {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] + sourceNodeMsg.halfWidth,
					sourceNodeMsg.center[1] + sourceNodeMsg.halfWidth * slope,
				],
				[
					targetNodeMsg.center[0] - targetNodeMsg.halfWidth,
					targetNodeMsg.center[1] - targetNodeMsg.halfWidth * slope,
				],
			];
		}
	} else if (end[0] > start[0] && Math.abs(slope) > 0.8) {
		if (end[1] >= start[1]) {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] + sourceNodeMsg.halfHeight / slope || 0,
					sourceNodeMsg.center[1] + sourceNodeMsg.halfHeight,
				],
				[
					targetNodeMsg.center[0] - targetNodeMsg.halfHeight / slope || 0,
					targetNodeMsg.center[1] - targetNodeMsg.halfHeight,
				],
			];
		} else {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] - sourceNodeMsg.halfHeight / slope || 0,
					sourceNodeMsg.center[1] - sourceNodeMsg.halfHeight,
				],
				[
					targetNodeMsg.center[0] + targetNodeMsg.halfHeight / slope || 0,
					targetNodeMsg.center[1] + targetNodeMsg.halfHeight,
				],
			];
		}
	} else if (end[0] < start[0] && Math.abs(slope) < 0.8) {
		if (end[1] >= start[1]) {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] - sourceNodeMsg.halfWidth,
					sourceNodeMsg.center[1] - sourceNodeMsg.halfWidth * slope,
				],
				[
					targetNodeMsg.center[0] + targetNodeMsg.halfWidth,
					targetNodeMsg.center[1] + targetNodeMsg.halfWidth * slope,
				],
			];
		} else {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] - sourceNodeMsg.halfWidth,
					sourceNodeMsg.center[1] - sourceNodeMsg.halfWidth * slope,
				],
				[
					targetNodeMsg.center[0] + targetNodeMsg.halfWidth,
					targetNodeMsg.center[1] + targetNodeMsg.halfWidth * slope,
				],
			];
		}
	} else {
		if (end[1] > start[1]) {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] + sourceNodeMsg.halfHeight / slope || 0,
					sourceNodeMsg.center[1] + sourceNodeMsg.halfHeight,
				],
				[
					targetNodeMsg.center[0] - targetNodeMsg.halfHeight / slope || 0,
					targetNodeMsg.center[1] - targetNodeMsg.halfHeight,
				],
			];
		} else {
			zuobiaoArr = [
				[
					sourceNodeMsg.center[0] - sourceNodeMsg.halfHeight / slope || 0,
					sourceNodeMsg.center[1] - sourceNodeMsg.halfHeight,
				],
				[
					targetNodeMsg.center[0] + targetNodeMsg.halfHeight / slope || 0,
					targetNodeMsg.center[1] + targetNodeMsg.halfHeight,
				],
			];
		}
	}
	return zuobiaoArr;
}

function getNodeAnchor(nodeId) {
	// 获取节点上下左右四个点的坐标
	const node = getNodeMsg(nodeId);
	const obj = {
		left: [node.offsetLeft, node.offsetTop + node.offsetHeight / 2],
		top: [node.offsetLeft + node.offsetWidth / 2, node.offsetTop],
		right: [
			node.offsetLeft + node.offsetWidth,
			node.offsetTop + node.offsetHeight / 2,
		],
		bottom: [
			node.offsetLeft + node.offsetWidth / 2,
			node.offsetTop + node.offsetHeight,
		],
		halfWidth: node.offsetWidth / 2,
		halfHeight: node.offsetHeight / 2,
	};
	obj.center = [
		~~(obj.left[0] + obj.right[0]) / 2,
		~~(obj.top[1] + obj.bottom[1]) / 2,
	];
	return obj;
}

function getNodePosition(nodeId) {
	const node = getNodeMsg(nodeId);
	return {
		left: node.offsetLeft,
		right: node.offsetLeft + node.offsetWidth,
		top: node.offsetTop,
		bottom: node.offsetTop + node.offsetHeight,
		width: node.offsetWidth,
		height: node.offsetHeight,
		centerX: node.offsetLeft + node.offsetWidth / 2,
		centerY: node.offsetTop + node.offsetHeight / 2,
	};
}

function getNodeMsg(id) {
	const nodeDom = utils.getNodeById(id);
	return {
		offsetLeft: ~~nodeDom.getAttribute("x"),
		offsetTop: ~~nodeDom.getAttribute("y"),
		offsetHeight: ~~nodeDom.getAttribute("height"),
		offsetWidth: ~~nodeDom.getAttribute("width"),
	};
}

export { getNodeAnchor, getNodePosition, getPoints };

export default getPoints;
