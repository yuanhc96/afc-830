import * as d3 from "d3";
import utils from "./utils/index";
import getPoints from "./getPoints";

/**
 * @param option 配置项
 * @param color 连线颜色
 * @param activeColor 选中连线的颜色
 * @param pathId 连线id 必须
 * @param width 连线宽度
 * @param fontSize labelfontSize
 */
export default class Path {
	constructor(option) {
		this.init();
		if (option && option.pathId) {
			this.config = {
				...this.config,
				...option,
			};
			if (option.connect) {
				this.config.connect.sourceType = option.sourceType;
				this.config.connect.targetType = option.targetType;
				this.points = getPoints(option.connect);
			}
			this.creatpath();
			this.getTexxtWidth();
			this.getTextPath(option.connect);
			this.config.rurningPoint = null;
		} else {
			utils.err("创建连线需要传入id");
		}
	}
	init() {
		this.ImageList = [];
		this.virtualList = [];
		this.config = {
			pathId: "",
			scope: "http://www.w3.org/2000/svg",
			color: "",
			activeColor: "#222",
			width: 1.5,
			fontSize: 14,
			hash: "",
		};
		this.points = [];
	}

	creatpath() {
		this.path = this.config.svg
			.append("path")
			.attr("d", this.getD(this.points))
			.attr("id", this.config.pathId)
			.attr(
				"style",
				`fill:none;stroke:${this.getColor()};stroke-width:${this.config.width}`
			)
			.attr("marker-end", `url(#markerArrow${this.getColor()})`);
	}

	onPathClick() {
		// console.log('点击连线')
		this.path.attr(
			"style",
			`fill:none;stroke:${this.config.activeColor};stroke-width:${this.config.width}`
		);
		this.pathClick &&
			this.pathClick({
				type: "click",
				pathId: this.config.pathId,
				...this,
			});
	}

	onPathDblClick() {
		// console.log('双击连线')
		this.pathClick &&
			this.pathClick({
				type: "dblclick",
				pathId: this.config.pathId,
			});
	}

	getTexxtWidth() {
		if (this.config.connect) {
			this.textWidth = utils.getTextWidth(
				this.config.connect.label,
				`${this.config.fontSize}px`
			);
		}
	}

	/**
	 * @param pointArr 连线拐点的数组
	 */

	getD(pointArr) {
		// 获取path的 d 属性
		const context = d3.path();
		pointArr.forEach((item, index) => {
			if (index === 0) {
				context.moveTo(item[0], item[1]);
			} else if (index !== pointArr.length - 1) {
				context.arcTo(
					item[0],
					item[1],
					pointArr[index + 1][0],
					pointArr[index + 1][1],
					6
				);
			} else {
				context.lineTo(item[0], item[1]);
			}
		});
		return context.toString();
	}

	/**
	 * 计算两点间的直线巨鹿
	 * @param start 起始点数组
	 * @param end 重点数组
	 */

	getLength(start, end) {
		// 获取两点连线长度
		return Math.sqrt(
			Math.pow(end[1] - start[1], 2) + Math.pow(end[0] - start[0], 2)
		);
	}

	getTextPath(connect) {
		// text 标签用于添加label
		if (connect) {
			this.text = this.config.svg
				.append("text")
				.attr("font-size", this.config.fontSize)
				.html(connect.label)
				.attr("user-select", "none")
				.on("dblclick", () => {
					this.pathClick &&
						this.pathClick({
							type: "dblclick",
							pathId: this.config.pathId,
						});
				});
			this.setTextPoint();
		}
	}

	setTextPoint() {
		const { x, y } = this.path
			.node()
			.getPointAtLength(this.getLineLength(this.points) / 2);
		this.text.attr("y", y - 6).attr("x", x - this.textWidth / 2);
	}

	getLineLength(lineArr) {
		// 计算连线的长度
		let prev = null;
		let length = 0;
		lineArr.forEach((item) => {
			if (prev) {
				length += utils.getLength(prev, item);
			}
			prev = item;
		});
		return length;
	}

	getColor() {
		return this.config.connect && this.config.connect.color
			? this.config.connect.color
			: this.config.color;
	}
}
