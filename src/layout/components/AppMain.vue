<template>
  <section :class="['app-main',userInfo.account_type==3?'app-full-main':'']">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main, .app-full-main {
  width: 100%;
  height: 100%;
  // height: calc(100vh - 50px);
  // min-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 0 20px;
  margin-top: 10px;
  box-sizing: border-box;
  position: relative;
  // background-color: sandybrown;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.app-full-main{
  padding-top: 50px !important;
}


.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
