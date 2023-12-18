import '@babel/polyfill';
import nodeConfig from "../static/config/node.js";
import Design from "./design.js";

// window.renderPrisessGraph = renderPricessGraph;
export function renderPricessGraph({
	json,
	type,
  showDefId,
	dom,
	click,
	dblclick,
	mouseover,
	mouseout,
	touchstart,
}) {
	const { states, participants, transaction,transCtrlBeans } = json;
	new Design(`#${dom}`, {
		...getNodeList(),
		connectList: getConnectionList(),
    type,
    showDefId
	})
		// 绑定事件
		.on("click", (node, ele) => {
			click && click(node, ele);
		})
		.on("dblclick", (node, ele) => {
			dblclick && dblclick(node, ele);
		})
		.on("mouseover", (node, ele) => {
			mouseover && mouseover(node, ele);
		})
		.on("mouseout", (node, ele) => {
			mouseout && mouseout(node, ele);
		})
		.on("touchstart", (node, ele) => {
			touchstart && touchstart(node, ele);
		});

	function getNodeList() {
		let nodeList = [];
		let width = 0;
		let height = 0;
		for (const i in states) {
			const { nodeGraphInfo } = nodeConfig[states[i].type];
			nodeList.push({
				...states[i],
				id: i,
				img: `./static/image/process${type}_graph/${states[i].type}_${states[i].currentState}.gif`,
				participant: participants ? participants[i] : "",
				x: Number(states[i].x),
				y: Number(states[i].y) + Number(states[i].height) / 2 + 10,
				width: Number(nodeGraphInfo.width),
				height: Number(nodeGraphInfo.height),
				autoActivityType: getAutoActivityType(i),
			});
			Number(states[i].x) > width && (width = Number(states[i].x));
			Number(states[i].y) > height && (height = Number(states[i].y));
		}
		return {
			nodeList,
			width:width+100,
			height:height+200,
		};
	}

	function getConnectionList() {
		return transaction.map((item) => {
			const { x, y, height, width } = states[item.from];
			const { extendAttribute } = item;
			extendAttribute&&delete extendAttribute["extend-nodes"];
			return {
				sourceId: item.from,
				targetId: item.to,
				label: item.name || "",
				color: getcolor(item, transaction, transCtrlBeans),
				points: getInsPoint(
					{
						bendPoints: extendAttribute,
					},
					{
						x: Number(x) + Number(width) / 2,
						y: Number(y) + Number(height) / 2 + 10,
					}
				),
				pathId: item.from + item.to,
			};
		});
	}

	function getInsPoint({ bendPoints }, { x, y }) {
		if (bendPoints) {
			if (
				Object.prototype.toString.call(bendPoints) === "[object Object]" &&
				Object.keys(bendPoints).length &&
				bendPoints["1w1"] &&
				bendPoints["1h1"]
			) {
				const arr = [[]];
				let _index = 1;
				Object.keys(bendPoints).forEach((item, index) => {
					if (index % 4 === 0) {
						arr.push([
							Number(x) + Number(bendPoints[`${_index}w1`]),
							Number(y) + Number(bendPoints[`${_index}h1`]),
						]);
						_index++;
					}
				});
				arr.push([]);
				return arr;
			} else if (
				Object.prototype.toString.call(bendPoints) === "[object Array]"
			) {
				return [
					[],
					...bendPoints.map((item) => {
						return [
							Number(x) + Number(item["1w1"]),
							Number(y) + Number(item["1h1"]),
						];
					}),
					[],
				];
			}
		}
		return [];
	}

	function getcolor(item, transaction, transCtrlBeans) {
		let color = '#BCBCBC'
		transaction.forEach(tran => {
		  transCtrlBeans.forEach(beans => {
			if (tran.from === item.from && tran.to === item.to && tran.from === beans.srcActDefID && tran.to === beans.destActDefID) {
			  color = '#228B22'
			}
		  })
		})
		return color
	  }

	function getAutoActivityType(str) {
		if (str.indexOf("eosService") > -1) {
			return "EOSservice";
		} else if (str.indexOf("restService") > -1) {
			return "Restservice";
		} else {
			return "toolapp";
		}
	}
}
