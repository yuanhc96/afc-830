<template>
   <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
        <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="ml-10 mr-10" :icon="c.icon">{{c.text}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
export default {
    props:{
        commands:[]
    },
    methods:{
        handleCommand(command){
            command.call(this)
            this.$emit('command',command)
        }
    }
}
</script>