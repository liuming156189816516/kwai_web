<template>
    <div class="sharing_warp">
        <div class="pop_mask" v-show="isMask">
            <div class="mask_form">
                <div class="mask_head">{{ $t('sys_l013') }}</div>
                <el-form size="small" :model="passForm" :rules="passRules" label-position="top" ref="passForm" label-width="100px">
                    <el-form-item :label="$t('sys_l007')" prop="password">
                        <el-input clearable v-model="passForm.password" />
                    </el-form-item>
                    <el-form-item style="display: flex;justify-content: flex-end;margin-bottom: 0;">
                        <el-button type="primary" :loading="isLoading" @click="submitForm('passForm')">{{ $t('sys_c024') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <child-component ref="childen" :message="true" :pwd_type="pwd_type" @showMasker="listenChild" v-if="!isMask" />
    </div>
</template>
<script>
import { cutParam } from '@/utils/index'
import { checkpassword } from '@/api/login'
import { MessageBox } from 'element-ui'
import ChildComponent from '@/views/counterWorkOrder/ticket-details.vue'
export default {
    components: { ChildComponent },
    data() {
        return {
            isMask: true,
            pwd_type:1,
            isLoading:false,
            passForm: {
                password: ""
            },
            workTimeTask:null,
            workTime:10000
        }
    },
    computed: {
        passRules() {
            return {
                password: [{ required: true, message: this.$t('sys_mat061', { value: this.$t('sys_c016') }), trigger: 'blur' }],
            }
        }
    },
    created(){
        let params = cutParam(location.href);
        let storageUid = localStorage.getItem('check_uid')||"";
        if (storageUid == params.uid) {
            this.isMask = false;
        }else{
            this.isMask = true;
        }
    },
    mounted(){
        // if (!this.isMask) {
        //     this.$refs.childen.startWorkHeart();
        // }
    },
    methods: {
        listenChild(val){
            if(!val) return;
            MessageBox.confirm(this.$t('sys_l010'),this.$t('sys_l013'), {
                confirmButtonText:this.$t('sys_c024'),
                closeOnClickModal:false, 
                showCancelButton:false, 
                showClose:false,
                type: 'warning'
            }).then(() => {
                this.isMask = val;
                localStorage.removeItem('check_uid');
                localStorage.removeItem('check_pwd');
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isLoading=true;
                    let params = cutParam(location.href);
                    checkpassword({uid:params.uid,sid:params.sid,password:this.passForm.password}).then(res=>{
                        if (res.code !=0) return;
                        this.isMask = false;
                        this.isLoading = false;
                        localStorage.setItem('check_uid',params.uid);
                        localStorage.setItem('check_pwd',this.passForm.password);
                        // console.log(this.passForm.password);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    destroyed() {
        clearInterval(this.$refs.childen.workTimeTask);
        window.removeEventListener('beforeunload', e => this.$refs.childen.startWorkHeart(e))
    }
}
</script>

<style scoped lang="scss">
.sharing_warp {
    padding: 20px;
}

.pop_mask {
    display: flex;
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    align-items: center;
    justify-content: center;
    background-color: #ccc;

    .mask_form {
        width: 420px;
        padding: 20px;
        border-radius: 4px;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #ebeef5;
        font-size: 18px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        .mask_head {
            color: #303133;
            padding-bottom: 15px;
            font-size: 18px;
        }
    }
}
</style>