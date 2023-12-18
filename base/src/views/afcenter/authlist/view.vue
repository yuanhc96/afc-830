<template>
  <div>
    <div v-if="hasData" >
      <div class="toolBar">
        <span v-for="item in imgs">
          <img :src="item.url" alt="">
          <span>{{ dictType[item.code] }}</span>
        </span>
      </div>
      <div id="container" />
    </div>
    <no-data v-else class="pt-50" />
  </div>
</template>
<script>
import G6 from '@antv/g6'
export default {
  props: {
    viewData: {
      type: Object,
      default: {}
    },
    currentData: {
      type: Object,
      default: {}
    },
    dictType: {
      type: Object,
      default: {}
    },
    activeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      graph: null,
      imgs:[
        {
          code: 'role',
          url: '../../../../static/images/g6role.png'
        },{
          code: 'user',
          url: '../../../../static/images/g6user.png'
        },{
          code: 'org',
          url: '../../../../static/images/g6org.png'
        },{
          code: 'position',
          url: '../../../../static/images/g6position.png'
        },{
          code: 'emp',
          url: '../../../../static/images/g6emp.png'
        },{
          code: 'workGroup',
          url: '../../../../static/images/g6workgroup.png'
        }
      ]
    }
  },
  computed: {
    hasData() {
      return this.currentData.partyId && this.viewData && this.viewData.data && this.viewData.data.length
    }
  },
  watch: {
    viewData: {
      immediate: true,
      deep: true,
      async handler(val) {
        const data = await this.handlerData(val)
        this.hasData && this.draw(data)
      }
    },
    // 每次切换都会重新绘图，TODO
    activeName: {
      immediate: true,
      async handler(val) {
        if (val === 'chart') {
          const data = await this.handlerData(this.viewData)
          this.hasData && this.draw(data)
        }
      }
    }
  },
  mounted() {
    // this.draw()
  },
  methods: {
    handlerData(val) {
      const pushNodes = (arr, a) => {
        if (arr.every(i => i.id !== a.id)) {
          arr.push(a)
        }
      }
      let edges = []
      let nodes = []

      this.currentData.partyId && pushNodes(nodes, {
        id: this.currentData.partyId,
        label: this.currentData.searchValue,
        types: this.currentData.type,
        size: 55,
      })
      if (val.data && val.data.length) {
        val.data.forEach(i => {
          pushNodes(nodes, {
            id: i.id,
            label: i.name || 'noName',
            // label: i.name ? (i.name + ' (' + i.code) + ')' : 'noName',
            types: 'role'
          })
          const partyNameArr = i.partyName.split(',')
          const partyCodeArr = i.partyCode.split(',')
          partyNameArr.forEach((j, index) => {
            const partyName = this.handlePartyName(j)
            const partyCode = partyCodeArr[index].split('(')[0]
            const name = j.split('(').length && j.split('(')[0]
            const types = j.split('(').length && j.split('(')[1].split(')')[0]
            if (types !== this.currentData.type || partyCode !== this.currentData.searchCode) {
              pushNodes(nodes, {
                id: partyName,
                label: partyName,
                types
              })
              edges.push({
                source: i.id, target: partyName
              })
              edges.push({
                source: partyName, target: this.currentData.partyId
              })
            } else {
              edges.push({
                source: i.id, target: this.currentData.partyId
              })
            }
          })
          
        })
      } 
      return {
        edges,
        nodes
      }
    },
    draw(data) {
      if (this.graph) {
        this.graph.destroy()
      }
      data.edges.forEach(edge=> {
        // edge.label = `Transfer $${edge.size}`
      })

      data.nodes.forEach(node => {
        this.imgs.forEach(item => {
          if(item.code === node.types) {
            node.img = item.url
          }
        })
        // console.log(node, 'node')
        // node.donutColorMap = colors;
        // node.size = 0;
        // Object.keys(node.label).forEach(key => {
        //   node.size += 20;
        // })
        // node.size = 50
      })

      const width = document.getElementById('container').scrollWidth;
      const height = document.getElementById('container').scrollHeight || 490;
      this.graph = new G6.Graph({
        container: 'container',
        width,
        height,
        // translate the graph to align the canvas's center, support by v3.5.1
        fitCenter: true,
        // fitView: true,
        // fitViewPadding: 'auto',
        // plugins: [legend],
        plugins: [],
        modes: {
          default: ['drag-canvas', 'drag-node'],
        },
        layout: {
          type: 'radial',
          focusNode: 'li',
          linkDistance: 150,
          unitRadius: 200
        },
        defaultEdge: {
          type: 'line',
          style: {
            startArrow: {
              path: G6.Arrow.vee(10, 10, 5), // 参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
              d: 5,
              fill: '#ccc',
              lineDash: [0]
            },
            lineWidth: 1,
            stroke: '#ccc',
            lineDash: [5],
          },
          labelCfg: {
            autoRotate: true,
            style: {
              stroke: "#fff",
              lineWidth: 5
            }
          }
        },
        defaultNode: {
          type: 'image',
          img: '../../../../static/images/role.png',
          // style: {
          //   fill: '#65789B',
          //   lineWidth: 0,
          size: 40,
          labelCfg: {
            position: 'bottom',
            style: {
              lineWidth: 2,
              // fontSize: '18px'
            }
          },
        },
        // nodeStateStyles : {
        //   type: 'image',
        //   // img: '../../../../static/images/role.png',
        //   style: {
        //     fill: '#65789B',
        //     lineWidth: 0,
        //   },
        //   size: 30,
        //   labelCfg: {
        //     position: 'bottom',
        //     style: {
        //       lineWidth: 2,
        //       fontSize: '18px'
        //     }
        //   },
        // }
      });

      this.graph.data(data);
      this.graph.render();

      this.graph.on('node:mouseenter', (evt) => {
        const { item } = evt;
        this.graph.setItemState(item, 'active', false);
      });

      this.graph.on('node:mouseleave', (evt) => {
        const { item } = evt;
        this.graph.setItemState(item, 'active', false);
      });

      this.graph.on('node:click', (evt) => {
        const { item } = evt;
        this.graph.setItemState(item, 'selected', false);
      });
      this.graph.on('canvas:click', (evt) => {
        this.graph.getNodes().forEach((node) => {
          this.graph.clearItemStates(node);
        });
      });
    },
    handlePartyName(numString){
      let theString = ''
      if(numString.length>0){
        let dictType = this.dictType
        theString = numString.replace(/\((.*?)\)/g,function(numString,i){
            return `(${dictType[i]})`
        })
      }
      return theString
    }
  }
}
</script>
<style lang="scss" scoped>
  .toolBar {
    float: right;
    height: 50px;
    padding-top: 15px;
    padding-right: 10px;
    line-height: 40px;
    img {
      margin-left: 15px;
      height: 25px;
    }
  }
  #container {
    height: 600px;
  }
  canvas {
    display: block;
    margin: 0 auto;
  }
</style>
