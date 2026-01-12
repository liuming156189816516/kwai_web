<template>
    <div>
        <el-button size="small" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
            <span>{{$t('sys_q006')}}</span>
        </el-button>
        <div class="password_main">
            <el-form size="small" :model="userForm" label-width="0x" :rules="userRules" ref="userForm"
                style="width: 320px;">
                <el-form-item>
                    <el-input v-model="userInfo.account" disabled :placeholder="$t('sys_l006')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="userForm.password" :placeholder="$t('sys_mat104')"
                        :type="showEye ? 'password' : ''">
                        <template #suffix>
                            <div class="show-pwd" @click="showPwd">
                                <svg-icon :icon-class="showEye ? 'eye' : 'eye-open'" />
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="surePwd">
                    <el-input v-model="userForm.surePwd" :placeholder="$t('sys_c018')"
                        :type="showEye ? 'password' : ''">
                        <template #suffix>
                            <div class="show-pwd" @click="showPwd">
                                <svg-icon :icon-class="showEye ? 'eye' : 'eye-open'" />
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%;" :loading="isLoading" type="primary" @click="updateBtn('userForm')">{{ $t('sys_c024') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import md5 from "js-md5";
import { mapGetters } from 'vuex'
import { removeToken } from '@/utils/auth'
import { successTips } from "@/utils/index"
import { doadminuser } from "@/api/permission"
export default {
    data() {
        const validatPwd = (rule,value,callback)=>{
            if (!value) {
                return callback(new Error(this.$t("sys_mat104")))
            }else{
                callback()  
            }
        }
        const validatSurePwd = (rule,value,callback)=>{
            if (!value) {
                return callback(new Error(this.$t("sys_c018")))
            }else if(value !== this.userForm.password){
                return callback(new Error(this.$t("sys_c099")))
            }else{
                callback()  
            }
        }
        return {
            showEye: true,
            isLoading: false,
            userForm: {
                password: "",
                surePwd: "",
            },
            userRules:{
                password: [{ required: true,validator:validatPwd, trigger: 'blur' }],
                surePwd: [{ required: true, validator:validatSurePwd, trigger: 'blur' }],
            }
        }
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    created() {
        this.userForm.account = this.userInfo.account
    },
    methods: {
        showPwd() {
            this.showEye = !this.showEye;
        },
        updateBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        ptype: 2,
                        uid: this.userInfo.uid,
                        pwd: md5(this.userForm.password),
                        pwd_str: this.userForm.password
                    }
                    this.isLoading = true;
                    doadminuser(params).then(res => {
                        this.isLoading = false;
                        if (res.code != 0) return;
                        successTips(this)
                        removeToken()
                        this.$router.push('/login')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.password_main {
    display: flex;
    margin: 0 auto;
    padding-top: 20px;
    align-items: center;
    justify-content: center;
    .el-form-item{
        margin-bottom: 20px;
    }
}
</style>