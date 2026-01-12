<template>
  <div class="login-container">
    <!-- <div class="change_lang" @click="changeLang">
      <img :src="require(`@/assets/login/${langValue||'zh'}.png`)" alt="" srcset="">
      <span>{{ langValue||'zh' }}</span>
    </div> -->
    <div class="radius_left"></div>
    <div class="radius_top"></div>
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/login/side-logo.png">
      </div>
      <div class="login-form">
        <div class="login-title">
          <img class="icon" src="../../assets/login/avatar.png" alt="logo">
          <!-- <h2 class="title">{{ $t('sys_l002') }}</h2> -->
          <!-- <h2 class="title">iMX</h2> -->
          <h2 class="title">Bees SCRM</h2>
        </div>
        <div class="account_type">
          <span class="left_text">{{$t('sys_l057')}}</span>
          <el-radio-group v-model="loginForm.seatName" @change="changeAccount">
            <el-radio border v-for="(item, idx) in accountOption" v-show="item != ''" :key="idx" :label="idx">{{ item }}</el-radio>
          </el-radio-group>
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <el-form-item label="" prop="username">
            <el-input v-model="loginForm.username" :placeholder="$t('sys_l006')" auto-complete="on">
              <template #prefix>
                <img src="../../assets/login/zhanghao.png">
                <!-- <i class="el-icon-user" /> -->
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" :placeholder="$t('sys_l007')" auto-complete="on"
              :type="showEye ? 'password' : ''">
              <template #prefix>
                <img src="../../assets/login/mima.png">
                <!-- <i class="el-icon-lock" /> -->
              </template>
              <template #suffix>
                <!-- <div class="show-pwd" @click="showPwd"> -->
                  <svg-icon class="show-pwd" :icon-class="showEye ? 'eye' : 'eye-open'" @click="showPwd" />
                <!-- </div> -->
              </template>
            </el-input>
          </el-form-item>

          <el-form-item style="width: 100%">
            <el-button :loading="loading" :disabled="!checked" class="login-btn" type="primary" @click="submitForm('loginForm')">{{$t('sys_l001') }}</el-button>
            <el-checkbox v-model="checked">
              <span class="el-checkbox__label">
                <span style="color: rgb(51, 51, 51);">我已阅读并同意</span>
                <a href="javascript:;" @click="viewXieyi(0)">《用户协议》</a>
                <a href="javascript:;" @click="viewXieyi(1)">《隐私政策》ces1</a>
                <a href="javascript:;" >测试</a>
              </span>
            </el-checkbox>
            <div class="service_tg" @click="jumpServeTg" v-if="isServe">
              <span class="icon_img">
                <img src="../../assets/tg_icon.png" alt="" srcset="">
              </span>
              <span>
                {{ $t('sys_l107') }}
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="masker_cover" v-show="xieyiShow" @click.stop="hideXieyi">
      <div class="masker_content">
        <i class="el-icon-close"></i>
        <xieyi v-if="xieyi==0" />
        <yinsi v-if="xieyi==1" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import xieyi from './xieyi'
import yinsi from './yinsi'
export default {
  components:{xieyi,yinsi},
  data() {
    return {
      xieyi:0,
      checked: true,
      showEye: true,
      loading: false,
      xieyiShow: false,
      passwordType: false,
      loginForm: {
        username: '',
        password: '',
        seatName: 2
      }
    }
  },
  computed: {
    ...mapState({
      langValue: state => state.app.locaLang,
      userInfo: state => state.user.userInfo
    }),
    loginRules() {
      return {
        username: [{ required: true, message: this.$t('sys_l006'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('sys_l007'), trigger: 'blur' }]
      }
    },
    accountOption() {
      return ['', '', this.$t('sys_l016'), this.$t('sys_l017')]
    },
    isServe(){
      let isShow;
      if(process.env.VUE_APP_OUTDIR=='prod'){
        isShow = true;
      }else{
        isShow = false;
      }
      return isShow;
    }
  },
  methods: {
    showPwd() {
      this.showEye = !this.showEye;
    },
    changeLang() {
      this.$store.dispatch('app/switchLang', this.langValue)
      setTimeout(() => { this.$refs.loginForm.resetFields() })
    },
    changeAccount(){
      this.$refs.loginForm.resetFields()
    },
    jumpServeTg(){
      window.open(process.env.VUE_APP_TG,'_blank');
    },
    viewXieyi(idx){
      this.xieyi = idx;
      this.xieyiShow = true;
    },
    hideXieyi(e){
      console.log(e.target);
      if (e.target.className != "lh-base") {
        this.xieyiShow = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          setTimeout(async () => {
            const isOk = await this.$store.dispatch('user/login', this.loginForm);
            if (isOk) {
              this.$store.dispatch('user/getMenuInfo');
              if (this.userInfo.account_type == 3) {
                this.$router.push({ path: '/chatroom' })
              } else {
                this.$router.push({ path: '/' })
              }
              this.$notify({title: this.$t('sys_l013'),message: this.$t('sys_l012'),type: 'success',duration: 3000})
              // this.$store.dispatch('app/showNotice',true);
            }
            this.loading = false
          }, 1000)
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
