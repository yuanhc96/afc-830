<template>
  <div>
    <diV>
      <icon class="iconfont icon-yaoqingren" path="yaoqingren"></icon>
      <el-button
        class="add-btn"
        size="mini"
        @click="openAdd"
        :disabled="disabled"
        >+ 添加</el-button
      >
      <el-button
        class="clear-btn"
        size="mini"
        @click="clearList"
        :disabled="disabled"
      >
        清 空</el-button
      >
    </diV>
    <el-row>
      <div class="person-boxs-wrapper clearfix">
        <div
          class="person-box"
          v-for="(item, index) in participants"
          :key="index"
          :class="{ 'div-disabled': disabled }"
        >
          <div class="person-box-header">
            {{ dictType[item.typeCode] }}
          </div>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              {{ item.name }}
            </div>
            <div class="person-box-content">
              <div class="name">{{ item.name }}</div>
              <div class="idNum">ID:{{ item.id }}</div>
            </div>
          </el-tooltip>
          <div class="close-btn" @click="del(item)">
            <i class="el-icon-close" />
          </div>
        </div>
      </div>
    </el-row>
    <SelectTypes
      :dialog-visible.sync="dialogVisible"
      :isMultiple="true"
      :partyTypes="partyTypes"
      @sure="sure"
    ></SelectTypes>
  </div>
</template>
<script>
import Icon from "@/components/Icon/icon";
import { BaseVue, List } from "@lib";
import { mapGetters } from "vuex";
export default {
  components: { Icon },
  mixins: [BaseVue, List],
  props: {
    participants: {
      type: Object,
      default: [],
    },
    partyTypes: {
      type: Object,
      default: [
        { code: "emp", name: "员工" },
        { code: "org", name: "机构" },
        { code: "role", name: "角色" },
      ],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dictType: {},
      dicttypeid: "sys_party_types",
    };
  },
  watch: {
    dicts: {
      immediate: true,
      handler(val) {
        if (val) {
          if (this.partyTypes.length > 0) {
            let dictType = {};
            this.partyTypes.forEach((item) => {
              dictType[item.code] = item.name;
            });
            this.dictType = dictType;
          }
        }
      },
    },
  },
  mounted() {},
  computed: {
    ...mapGetters(["dicts"]),
  },
  methods: {
    sure(selectData) {
      let partyRole = selectData.map((item) => {
        let data = {
          id: item.id,
          name: item.name,
          typeCode: item.extra.type,
        };
        return data;
      });
      //拼接+去重
      let participants = [...this.participants]
        .concat(partyRole)
        .filter((value, index, array) => {
          return (
            array.findIndex(
              (item) => item.id === value.id && item.name === value.name
            ) === index
          );
        });
      this.$emit("update:participants", participants);
      //this.$emit('sureSelectData',selectData)
    },
    del(value) {
      const newParticipants = this.participants.filter((item) => {
        return item.id !== value.id || item.typeCode !== value.typeCode;
      });
      this.$emit("update:participants", newParticipants);
      // this.$emit("delItembyId", id);
    },
    clearList() {
      this.$emit("update:participants", []);
    },
  },
};
</script>
<style lang="scss" scoped>
.div-disabled {
  /**pointer-events: none禁止鼠标点击事件，当元素中有这一属性时，链接、点击事件统统失效**/
  pointer-events: none;
  cursor: default;
}
.icon-yaoqingren {
  font-size: 26px;
  color: #606266;
  margin-right: 5px;
}
.add-btn,
.clear-btn {
  display: inline-block;
  vertical-align: middle;
  padding: 0 10px;
  line-height: 26px;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  margin-top: -10px;
}
.add-btn {
  border: 1px solid #2987f7;
  color: #2987f7;
  &:hover {
    background-color: #2987f7;
    color: #fff;
  }
}

.clear-btn {
  margin-left: 8px;
  border: 1px solid #e0e0e0;
}

.person-boxs-wrapper {
  margin-top: 15px;
  .person-box {
    position: relative;
    float: left;
    width: calc(16% - 9px);
    height: 58px;
    margin: 0 12px 10px 0;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #c6deff;
    overflow: hidden;
    cursor: pointer;
    transition: border 0.3s;
    &:nth-of-type(6n) {
      margin-right: 0;
    }
    &.active,
    &:hover {
      border: 1px solid #378af7;
    }
    &.active {
      .close-btn {
        display: block;
      }
    }
    &:hover {
      .close-btn {
        display: block;
      }
    }

    .close-btn {
      display: none;
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 21px solid #378af7;
      border-right: 21px solid transparent;
      border-left: 21px solid transparent;
      transform: rotate(45deg);
      position: absolute;
      top: -4px;
      right: -14px;

      i {
        position: absolute;
        top: 7px;
        right: -7px;
        font-size: 12px;
        color: #fff;
        transform: rotate(45deg);
      }
    }

    &-header {
      float: left;
      width: 50px;
      height: 100%;
      font-size: 14px;
      font-weight: 500;
      color: #378af7;
      background-color: rgba(55, 138, 247, 0.1);
      text-align: center;
      line-height: 58px;
    }

    &-content {
      float: left;
      width: calc(100% - 50px);
      height: 100%;
      padding: 2px 10px;
      color: #131313;

      .name {
        font-size: 14px;
        font-weight: 500;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
      }

      .idNum {
        font-size: 14px;
        line-height: 17px;
        color: #666666;
      }
    }
  }
}
</style>
