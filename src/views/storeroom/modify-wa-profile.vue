<template>
    <div class="view_warp" ref="heightEle">
        <el-alert title="WS账号修改资料功能介绍" type="warning">
            <template slot>
                <div class="storage_tips">
                    <div>1.在修改资料中可对头像、昵称、签名进行修改。</div>
                    <div>2.设置账号修改时间，可对修改操作做出时间的间隔。降低封号的概率。</div>
                    <!-- <div>3.在修改头像选项中可以切换不同的修改头像设置，轮巡修改是将所选中图片轮流设置为头像、随机修改是随机取用图片素材中图片设置为头像、自定义修改也是随机取用但每张图片只会被取用设置好的次数，如该图片被取用次数已达设置数目则不会再被取用于修改头像。（注意：如所选中的图片被取用的次数不足时，则剩余账号修改头像失败）。</div> -->
                    <div>3.建议：使用资料与账号以1带1的修改方式执行。</div>
                    <div>4.建议：养过的账号之间有关联性，更需要做防关联修改。</div>
                    <div>5.建议：个人号的风控对比商业号较高，更容易被风控到，建议少量多次去执行。</div>
                    <div>6.建议：普通商业号养号十五天以上再修改账号头像，降低封号的概率</div>
                    <!-- <div>8.不建议同时修改账号的头像、签名、昵称</div> -->
                </div>
            </template>
        </el-alert>
        <div style="display: flex;justify-content: space-between;">
            <el-button size="small" icon="el-icon-back" @click="$router.go(-1)" style="margin: 20px 0;">返回</el-button>
            <el-button size="small" type="primary" style="margin: 20px 0;" @click="wsRecord">修改WS资料日志</el-button>
        </div>
        <div class="view_continer">
            <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="140px">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="修改类型：" prop="updata_type">
                            <el-radio-group v-model="taskForm.updata_type">
                                <el-radio :label="idx" v-for="(item,idx) in upOption" :key="idx" v-if="idx!=0">{{ item }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="选择WS账号：" prop="account">
                            <el-select multiple collapse-tags v-model="taskForm.account" :placeholder="$t('sys_c052')">
                                <el-option v-for="item in wsAccounts" :key="item" :label="item"  :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18" v-if="taskForm.updata_type==1">
                        <el-form-item label="选择图片素材：" prop="source_id">
                            <el-select v-model="taskForm.source_id" multiple collapse-tags :placeholder="$t('sys_c052')">
                                <el-option v-for="(item,idx) in contentList" :key="item.id" :label="item.name" :value="item.id" v-if="idx!=0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18" v-else>
                        <el-form-item label="上传昵称：" prop="nickNameArry">
                            <div class="submit_btn">
                                <el-button class="custom_file1" style="margin-top: 0;">{{ $t('sys_c059') }}
                                    <input type="file" ref='uploadclear' @change="checkDataIsUse" id="uploadFile" title=" " />
                                </el-button>
                                <span class="export_tips" @click="downLoadTemp">
                                    <i class="el-icon-download" />下载模板
                                </span>
                            </div>
                            <div style="font-size: 12px;color: #606266;">支持.txt文件上传，最大支持10mb</div>
                            <div class="file_name" v-if="file_name">
                                <i class="el-icon-document" />
                                <span> {{ file_name }}</span>
                                <i class="el-icon-close" @click="clearFile" />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="修改账号时间间隔：">
                            <div class="number_01">
                                <span class="number_03">
                                    <el-input-number v-model ="taskForm.sleep1_num" type="number" :min="1" style="width: 120px;" />
                                </span>
                                <span class="number_02">~</span>
                                <span class="number_03">
                                    <el-input-number v-model ="taskForm.sleep2_num" type="number" :min="1" style="width: 120px;" />
                                </span>
                                <span class="number_02">秒。</span>
                            </div>
                            <div>建议间隔不能低于10s，间隔过低容易增加封号风险</div>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-form-item>
                    <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">开始修改资料</el-button>
                    <el-button @click="$router.go(-1)">{{ $t('sys_c024') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </template>
  
  <script>
  import { successTips } from '@/utils/index'
  import { doaccountinfo } from '@/api/storeroom'
  import { getmaterialgrouplist } from '@/api/article'
  export default {
    data() {
      return {
        isLoading:false,
        taskForm:{
            account: [],
            source_id: [],
            sleep1_num: 10,
            sleep2_num: 20,
            updata_type:1,
            nickNameArry:[]
        },
        file_name:"",
        wsAccounts:[],
        contentList:[]
      }
    },
    computed: {
        upOption(){
            return ["",this.$t('sys_rai014'),this.$t('sys_rai016')]
        },
        taskRules() {
            return {
                account: [{type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                source_id: [{ type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                updata_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                nickNameArry: [{ type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
            }
        }
    },
    created(){
        this.wsAccounts = this.$route.query.accounts.split(",");
        this.taskForm.account = this.wsAccounts;
        this.getMaterList();
    },
    methods:{
        getMaterList() {
            getmaterialgrouplist({page:1,limit: 200,type: 2}).then(res => {
                this.contentList = res.data.list || [];
            })
        },
        wsRecord(){
            this.$router.push({path:'/modify-wa-logs'});
        },
        async checkDataIsUse() {
            let that = this;
            let files = that.$refs.uploadclear.files[0];
            let fileType = files.name.split(".").pop();
            if (fileType != 'txt') return successTips(that,"error","请选择.txt文件类型");
            that.file_name = files.name;
            var reader = new FileReader();
            reader.readAsText(files);
            reader.onload = function(res) {
                that.taskForm.nickNameArry = res.target.result.replace(/\r/g,"").split("\n")
                that.$refs.taskForm.clearValidate('nickNameArry');
            }
            that.$refs.uploadclear.value = null;
        },
        clearFile(){
            this.file_name = "";
            this.taskForm.nickNameArry = [];
            this.$refs.uploadclear.value = null;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        ptype:this.taskForm.updata_type,
                        accounts:this.taskForm.account
                    }
                    if (this.taskForm.updata_type==1) {
                        params.material_group_ids = this.taskForm.source_id 
                    }else{
                        params.nick_name = this.taskForm.nickNameArry
                    }
                    this.isLoading=true;
                    doaccountinfo(params).then(res => {
                        this.isLoading=false;
                        if (res.code != 0) return;
                        this.$router.go(-1);
                        successTips(this)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        downLoadTemp(){
            var blob = new Blob(["昵称 修改规则：一行一个 随机取一个昵称进行修改"], { type: 'text/plain' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = "example-wa-modify-name.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(a.href);
        }
    }
  }
  </script>
  <style scoped lang="scss">
    .storage_tips {
        font-size: 14px;
        line-height: 1.8;
    }
    ::v-deep .el-alert__description{
        font-size: 30px;
        line-height: 24px;
        padding-top: 10px;
        padding-left: 20px;
    }
    .el-form-item{
        margin-bottom: 30px;
    }
  .view_continer{
    width: 100%;
    // max-height: 760px;
    position: relative;
    overflow-y: auto;
    padding: 0 15%;
    box-sizing: border-box;
    .custom_btn{
        padding: 0;
        color: #409eff;
        background: transparent;
        border-color: transparent;
        i{
            font-size: 16px;
        }
    }
    .custom_mess, .custom_say{
        .mess_01{
            width: 100%;
            padding: 10px 16px 10px 16px;
            background-color: #ecf5ff;
            border-radius: 4px;
            position: relative;
            box-sizing: border-box;
            .mess_t_01{
                font-size: 12px;
                display: flex;
                justify-content: flex-end;
                .mess_t_02{
                    color: #409eff;
                    font-weight: bold;
                }
            }
        }
    }
    .custom_say{
        .mess_01{
            border-radius: 4px;
            background: transparent;
            border: 1px solid #dcdfe6;
        }
    }
    .number_01{
        display: flex;
        font-size: 12px;
        line-height: 16px;
        .number_02{
            display: flex;
            align-items: center;
        }
        .number_03{
            margin: 0 5px;
        }
    }
  }
  .file_name{
    width: max-content;
    padding: 5px;
    line-height: 1;
    font-size: 14px;
    margin-top: 10px;
    border-radius: 4px;
    span{
        margin: 0 20px 0 5px;
    }
    .el-icon-close{
        opacity: 0;
        cursor: pointer;
    }
  }
  .file_name:hover{
    background-color: #f5f7fa;
    .el-icon-close{
        opacity: 1;
    }
  }
  </style>