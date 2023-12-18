export default {
    data() {
        return {
            needReload: false,
            routeName: this.$route.name,
        }
    },
    computed: {
        dev() {
            return process.env.NODE_ENV !== 'production'
        }
    },
    // created() {
    //     this.$BaseBus.$on(`openTag:${this.routeName}`,()=>{
    //         this.reload()
    //     })
    // },
    // beforeDestroy() {
    //     this.$BaseBus.$off(`openTag:${this.routeName}`)
    // },
    activated() {
        this.$BaseBus.$on(`openTag:${this.routeName}`,()=>{
            this.reload()
        })
    },
    deactivated(){
        this.$BaseBus.$off(`openTag:${this.routeName}`)
    },
    beforeDestroy() {
        this.$BaseBus.$off(`openTag:${this.routeName}`)
    },
}