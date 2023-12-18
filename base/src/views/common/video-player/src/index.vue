<template>
  <video-player
    ref="videoPlayer"
    v-bind="$attrs"
    :options="playerOptions"
    :playsinline="true"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
    @ended="onPlayerEnded($event)"
    @loadeddata="onPlayerLoadeddata($event)"
    @waiting="onPlayerWaiting($event)"
    @playing="onPlayerPlaying($event)"
    @timeupdate="onPlayerTimeupdate($event)"
    @canplay="onPlayerCanplay($event)"
    @canplaythrough="onPlayerCanplaythrough($event)"
    @ready="playerReadied"
    @statechanged="playerStateChanged($event)"
  />
</template>

<script>
export default {
  name: 'paly-video',
  props: {
    height: {
      default: '360'
    },
    autoplay: {
      default: false
      // 如果true,浏览器准备好时开始回放
    },
    muted: {
      default: false
      // 是否消除任何音频
    },
    language: {
      default: 'en'
    },
    playbackRates: {
      default: [0.7, 1.0, 1.5, 2.0]
      // 播放速度
    },
    sourceType: {
      default: 'video/mp4'
    },
    sourceSrc: {
      default: null
    },
    poster: {
      default: null
    },
  },
  computed: {
    playerOptions() {
      // 该插件具备很多其他可配置属性，需要可自行添加props
      return {
        height: this.height,
        autoplay: this.autoplay,
        muted: this.muted,
        language: this.language,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: this.sourceType,
          src: this.sourceSrc,
        }],
        poster: this.poster,
      }
    }
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      this.$emit('onPlayerPlay', player)
    },
    onPlayerPause(player) {
      this.$emit('onPlayerPause', player)
    },
    onPlayerEnded(player) {
      this.$emit('onPlayerEnded', player)
    },
    onPlayerLoadeddata(player) {
      this.$emit('onPlayerLoadeddata', player)
    },
    onPlayerWaiting(player) {
      this.$emit('onPlayerWaiting', player)
    },
    onPlayerPlaying(player) {
      this.$emit('onPlayerPlaying', player)
    },
    onPlayerTimeupdate(player) {
      this.$emit('onPlayerTimeupdate', player)
    },
    onPlayerCanplay(player) {
      this.$emit('onPlayerCanplay', player)
    },
    onPlayerCanplaythrough(player) {
      this.$emit('onPlayerCanplaythrough', player)
    },
    // or listen state event
    playerStateChanged(playerCurrentState) {
      this.$emit('playerStateChanged', playerCurrentState)
    },
    // player is ready
    playerReadied(player) {
      this.$emit('playerReadied', player)
    }
  }
}
</script>
