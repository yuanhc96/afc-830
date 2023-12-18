import "./style/index.scss";
import * as d3 from "d3";
import utils from "./utils/index.js";
import Path from "./path";

const ZONNMS = [40, 55, 70, 85, 100, 150, 200];

class Design {
	constructor(dom, config = {}) {
		this.on = (type, call) => {
			this[type] = call;
			return this;
		};
		if (dom) {
			// console.log(config);
			this.id = dom.replace("#", "");
			d3.select(dom).attr("style", `position: relative; width: 100%`);
			// .attr("class", "grde");

			this.dom = d3
				.select(dom)
				.append("div")
				.attr(
					"style",
					`height: ${config.height+30}px; width: 100%; overflow: scroll;`
				);
			this.init(config);

			const select = d3
				.select(dom)
				.append("select")
				.attr(
					"style",
					"position: absolute; right: 20px; top: 20px; width: 100px"
				);
			select.node().onchange = (e) => {
				this.svg.attr(
					"style",
					`transform-origin: left top;transform: scale(${Math.abs(
						~~e.target.value / 100
					)});`
				);
			};
			select.append("option").attr("value", 100).html(`${100}%`);
			ZONNMS.forEach((item) => {
				select.append("option").attr("value", item).html(`${item}%`);
			});
			select.attr("selected", 100);
		} else {
			utils.err("初始化需要一个dom");
		}
	}
	init(config) {
		this.config = {
			hash: new Date().getTime(),
			...config,
		};
		this.creatSvg();
		this.renderNode();
		this.renderLine();
	}

	creatSvg() {
		const { width, height } = utils.getDomReact(this.dom.node());
		this.domWidth = width;
		this.domHeight = height;
		const { connectList } = this.config;
		const COLORS = Array.from(new Set(connectList.map((item) => item.color)));
		this.svg = this.dom
			.append("svg")
			.attr("xmlns", "http://www.w3.org/2000/svg")
			.attr("width", this.config.width + "px")
			.attr("height", this.config.height + "px")
			// .attr("style", "position: absolute")
			.attr("zIndex", 0)
			.attr("left", 0)
			.attr("top", 0)
			.attr("drawLine", false)
    const defs = this.svg.append('defs')
    defs.append('marker')
      .attr('id', 'markerArrow222')
      .attr('markerWidth', '8')
      .attr('markerHeight', '8')
      .attr('refX', '7')
      .attr('refY', '5')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M2,2 L2,8 L8,5 L2,2')
      .attr('style', 'fill: #222;')
      COLORS.forEach(item => {
        defs.append('marker')
        .attr('refX', '7')
        .attr('refY', '5')
        .attr('id', `markerArrow${item}`)
        .attr('markerWidth', '16')
        .attr('markerHeight', '16')
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M2,2 L2,8 L8,5 L2,2')
        .attr('style', `fill: ${item}`)
      })
	}

	renderNode() {
		const { nodeList } = this.config;
		let timer = 0;
		nodeList.forEach((item) => {
			this.svg
				.append("image")
				.attr("x", item.x)
				.attr("y", item.y)
				.attr("width", item.width)
				.attr("height", item.height)
				.attr("xlink:href", item.img)
				.attr("id", item.id)
        // .attr('title', item.extendAttribute && item.extendAttribute.activityDefID || item.extendAttribute.processDefId)
				.on("click", () => {
					clearTimeout(timer);
					timer = setTimeout(() => {
						this.click && this.click(item, utils.getNodeById(item.id));
					}, 200);
				})
				.on("dblclick", () => {
					clearTimeout(timer);
					this.dblclick && this.dblclick(item, utils.getNodeById(item.id));
				})
				.on("mouseover", () => {
					this.mouseover && this.mouseover(item, d3.event);
				})
				.on("touchstart", () => {
					this.touchstart && this.touchstart(item, utils.getNodeById(item.id));
				})
				.on("mouseout", () => {
					this.mouseout && this.mouseout(item, utils.getNodeById(item.id));
				});

			const width = utils.getTextWidth(item.name, `${12}px`);
			this.renderText({
				x: item.x + item.width / 2 - width / 2,
				y: item.y + item.height + 20,
				text: item.name,
			});
      if (this.config.type === 'Def' && this.config.showDefId) {
        const TextWidth = utils.getTextWidth(item.extendAttribute.activityDefID, `${12}px`);
        this.renderText({
          x: item.x + item.width / 2 - TextWidth / 2,
          y: item.y + item.height + 40,
          text: item.extendAttribute.activityDefID,
        });
      }
		});
	}

	renderText({ x, y, text }) {
		this.svg
			.append("text")
			.text(text)
			.attr("font-size", "12")
			.attr("x", x)
			.attr("y", y);
	}
	renderLine() {
		// 渲染连线
		const { connectList } = this.config;
		connectList.forEach((connect) => {
			this.renderconnect(connect);
		});
	}

	renderconnect(connect) {
		// 渲染连线
		const { nodeList } = this.config;
		const path = new Path({
			mode: this.config.mode,
			connect: connect,
			pathId: connect.pathId,
			svg: this.svg,
			hash: this.config.hash,
			sourceType: nodeList.find((item) => item.id === connect.sourceId).type,
			targetType: nodeList.find((item) => item.id === connect.targetId).type,
		});
		connect.path = path;
	}
}

export default Design;
