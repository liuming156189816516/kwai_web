<template>
  <div class="video-player">
    <!-- 视频容器 -->
    <div class="video-container">
      <video
        ref="videoElement"
        :src="src"
        @timeupdate="updateProgress"
        @loadedmetadata="handleLoadedMetadata"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      />

      <!-- 自定义控制栏 -->
      <div class="controls">
        <!-- 播放/暂停按钮 -->
        <button style="font-size: 20px" @click="togglePlay">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>

        <!-- 进度条 -->
        <div class="progress-bar" @click="seekToTime">
          <div
            class="progress"
            :style="{ width: progress + '%' }"
          />
        </div>

        <!-- 时间显示 -->
        <span class="time">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </span>

        <!-- 音量控制 -->
        <div class="volume-control">
          <button style="font-size: 16px" @click="toggleMute">
            {{ isMuted ? '🔇' : '🔊' }}
          </button>
          <input
            v-model="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            @input="updateVolume"
          >
        </div>

        <!-- 全屏按钮 -->
        <button style="font-size: 20px" @click="toggleFullscreen">⛶</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    src: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      volume: 1,
      isMuted: false
    }
  },
  mounted() {
    this.video = this.$refs.videoElement
    if (this.autoplay) this.video.play()
  },
  methods: {
    // 播放/暂停切换
    togglePlay() {
      this.isPlaying ? this.video.pause() : this.video.play()
    },

    // 更新播放进度
    updateProgress() {
      this.currentTime = this.video.currentTime
      this.progress = (this.currentTime / this.duration) * 100
    },

    // 跳转到指定时间
    seekToTime(e) {
      const rect = e.target.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      this.video.currentTime = pos * this.duration
    },

    // 音量控制
    updateVolume(e) {
      this.video.volume = this.volume
      this.isMuted = this.volume === 0
    },

    // 静音切换
    toggleMute() {
      this.isMuted = !this.isMuted
      this.video.muted = this.isMuted
      if (!this.isMuted) this.volume = this.video.volume
    },

    // 全屏切换
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        this.$el.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    },

    // 时间格式化
    formatTime(seconds) {
      const date = new Date(0)
      date.setSeconds(seconds)
      return date.toISOString().substr(11, 8)
    },

    // 视频元数据加载
    handleLoadedMetadata() {
      this.duration = this.video.duration
    },
    // 关闭暂停播放
    closePausePlay() {
      this.isPlaying = false
      this.video.pause()
    }
  }
}
</script>

<style scoped>
.video-player {
  position: relative;
  max-width: 550px;
  height: 100%;
  margin: 0 auto;
}

.video-container {
  position: relative;
  background: #000;
  height: 100%;
}

video {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex-grow: 1;
  height: 5px;
  background: #444;
  cursor: pointer;
}

.progress {
  height: 100%;
  background: #00a8ff;
  transition: width 0.1s linear;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100px;
}

button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
}

input[type="range"] {
  width: 70px;
}

.time {
  color: white;
  font-family: monospace;
}
</style>
