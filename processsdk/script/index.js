/* eslint-disable */
// console.log(define, process);
window.onload = function() {
	process.renderPricessGraph({
		json: inst.result, // define || inst
		type: "inst", // inst || Def
		dom: "process",
		config: {
			complete: "#228B22", // 已完成
			processing: "#DC143C", //进行中
			wait: "#BCBCBC", //未开始
			defConnectColor: "#222", // 流程定义图
		},
		// click: (node) => {
		// 	// alert(node.type)
		// 	console.log("click", node);
		// },
		// dblclick: (node) => {
		// 	console.log("dblclick", node);
		// },
		// mouseover: (node) => {
		// 	console.log("mouseover", node);
		// },
		// mouseout: (node) => {
		// 	console.log("mouseout", node);
		// },
		// touchstart: (node) => {
		// 	alert(node.type);
		// },
	});
};
