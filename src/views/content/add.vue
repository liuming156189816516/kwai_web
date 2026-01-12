<template>
    <div>
        <el-form size="small" :model="quickForm" :rules="quickRules" ref="quickForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('sys_q001')" prop="reply_name">
                <el-input clearable maxlength="50" show-word-limit v-model="quickForm.reply_name" :placeholder="$t('sys_mat021')" style="width: 230px;" />
            </el-form-item>
            <el-form-item :label="$t('sys_mat093')" prop="source_list">
                <el-button :disabled="quickForm.source_list.length>=5" type="primary" @click="showSourceBtn">{{ $t('sys_mat093') }}</el-button>
                <span style="display: inline-block; margin-left: 10px;">{{ $t('sys_q008') }}</span>
            </el-form-item>
            <el-form-item :label="$t('sys_q007')" v-if="quickForm.source_list.length>0">
                <div class="source_main" v-for="(item,idx) in quickForm.source_list" :key="item.id" :draggable="true" @dragstart="dragStart(idx)" @dragover.prevent @drop="drop(idx)">
                    <div class="source_l">
                        <span class="source_type">{{ sourceOption[item.type] }}</span>
                        <span class="source_title">{{ item.name }}</span>
                    </div>
                    <div class="reply_main">
                        <div v-if="item.type==1">
                            <div>
                                <el-tag type="info" size="mini">{{ $t('sys_mat019') }}</el-tag>
                            </div>
                            <div class="content_warp">
                                <el-tag size="mini">{{ $t('sys_mat017') }}</el-tag>
                                <span class="reply_content">{{ item.content }}</span>
                            </div>
                        </div>
                        <div class="content_warp" v-if="item.type==2">
                            <img :src="item.content">
                        </div>
                        <div class="content_warp" v-if="item.type==3">
                            <audio controls>
                                <source :src="item.content" type="audio/mpeg">
                            </audio>
                        </div>
                        <div class="content_warp" v-if="item.type==4">
                            <video width="210" height="100" controls>
                                <source :src="item.content" type="video/mp4">
                            </video>
                        </div>
                    </div>
                    <div class="reply_fun">
                        <i class="el-icon-edit" @click="handleQuickBtn(item,1)"></i>
                        <i class="el-icon-delete" @click="handleQuickBtn(item,2)"></i>
                    </div>
                </div>
            </el-form-item>
            <el-form-item style="margin-top: 20px;">
                <el-button @click="$router.go(-1)">{{ $t('sys_q006') }}</el-button>
                <el-button type="primary" :loading="isLoading" @click="submitReply('quickForm')">{{ $t('sys_c024') }}</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :title="$t('sys_mat108')" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
            <material :key="Math.floor(new Date().getTime())" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
        </el-dialog>
    </div>
</template>
<script>
import { successTips } from '@/utils/index'
import material from './material.vue';
import { dospeech,getspeechinfo } from '@/api/article'
export default {
    components:{material},
    data() {
        return {
            id:"",
            group_id:"",
            source_id:"",
            isLoading:false,
            showSource:false,
            group_type:null,
            childMess:{
                check_len:0,
                check:true,
                is_show:1,
                type:0
            },
            draggedItemIndex:-1,
            quickForm:{
                reply_name:"",
                source_list:[]
            }
        }
    },
    computed:{
        quickRules() {
            return {
                reply_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q001')}), trigger: 'change' }],
                source_list: [{ type: 'array', required: true, message: this.$t('sys_c089',{value:this.$t('sys_q005')}), trigger: 'change' }],
            }
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092')]
        }
    },
    created(){
        this.group_id = this.$route.query.g_id||"";
        this.group_type =this.$route.query.type||"";
        if (this.group_type == 2) {
            this.id =this.$route.query.id||"";
            this.quickForm.reply_name = this.$route.query.name;
            this.getQuickList();
        }
    },
    methods:{
        dragStart(index) {
          this.draggedItemIndex = index;
        },
        drop(index) {
          const draggedItem = this.quickForm.source_list[this.draggedItemIndex];
          this.quickForm.source_list.splice(this.draggedItemIndex, 1);
          this.quickForm.source_list.splice(index, 0, draggedItem);
          this.draggedItemIndex = -1;
        },
        async getQuickList(){
            let {data:{content}} = await getspeechinfo({id:this.id});
            this.quickForm.source_list = content||[];
            this.quickForm.source_list.forEach((obj,idx) =>{
                obj.id = idx+1
            })
        },
        showSourceBtn(){
            this.source_id = "";
            this.childMess.check=true;
            this.childMess.check_len = this.quickForm.source_list.length;
            this.showSource=true;
        },
        getChildren(msg){
            this.showSource=false;
            let backMsg = JSON.parse(msg);
            if (this.source_id) {
                for (let k = 0; k < this.quickForm.source_list.length; k++) {
                    if (this.quickForm.source_list[k].id == this.source_id) {
                        this.quickForm.source_list[k] = this.childMess.is_show==1?backMsg:backMsg[0]
                    }
                }
            }else{
                this.quickForm.source_list=[...this.quickForm.source_list,...backMsg]
            }
            if (this.quickForm.source_list.length>0) {
                this.$refs.quickForm.clearValidate('source_list');
            }
        },
        handleQuickBtn(row,type){
            if (type == 1) {
                this.source_id = row.id;
                this.childMess.is_show=1;
                this.childMess.check=false;
                this.childMess.type=String(row.type);
                this.childMess.check_len = this.quickForm.source_list.length-1;
                this.showSource=true;
            }else{
                for (let k = 0; k < this.quickForm.source_list.length; k++) {
                    if (this.quickForm.source_list[k].id == row.id) {
                        this.quickForm.source_list.splice(k,1)
                    }
                }
            }
        },
        async submitReply(formName) {
            this.$refs[formName].validate(async(valid) => {
                if (valid) {
                    let params = {
                        ptype:Number(this.group_type),
                        group_id:this.group_id,
                        name:this.quickForm.reply_name,
                        content:this.quickForm.source_list
                    }
                    this.isLoading = true;
                    this.group_type==2?params.id=this.id:"";
                    let res = await dospeech(params);
                    this.isLoading = true;
                    if (res.code !=0) return;
                    successTips(this);
                    this.$router.go(-1)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './add.scss';
</style>