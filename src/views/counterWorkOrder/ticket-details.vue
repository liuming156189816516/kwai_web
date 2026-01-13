<template>
    <div class="">
        <!-- <div class="pop_cover"></div> -->
        <el-form size="small" :inline="true" style="margin-top: 10px;" v-if="!message">
            <el-form-item>
                <el-button size="small" @click="$router.go(-1)">
                    <i class="el-icon-back"></i>
                    <span>{{$t('sys_q006')}}</span>
                </el-button>
            </el-form-item>
        </el-form>
        <div class="detail_card">
            <el-button v-if="isLoading" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
            <template v-else>
                <div style="width: 100%;">
                    <div style="display: flex;align-items: flex-end;font-size: 14px;">
                        <span style="font-size: 20px;">工单统计</span>
                        <span class="is_disabled work_order">工单号:{{ work_id }}</span>
                        <span>重置时间:{{ reset_time > 0 ? $baseFun.resetTime(reset_time * 1000) : '0' }}</span>
                    </div>
                    <div class="card_warp">
                        <div class="card_item" v-for="(item, idx) in cardOption" :style="{ background: `${item.b_g}` }" @click="getStatistics(1)">
                            <div style="display: flex;align-items: center;">
                                <span class="card_text">{{ item.idx }}</span> <span>{{ item.label }}:</span>
                            </div>
                            <span class="card_num" :style="{ color: `${item.t_c}` }"
                                v-text="idx == 4 || idx == 5 ? (item.num * 100).toFixed(2) + '%' : item.num"></span>
                        </div>
                    </div>
                    <div class="foot_msg">本工单建议在置零时间<span>（{{ zeroing_time }}）</span> 前导出清单，双方确认售后数量，按
                        <span> B + D = {{ fansSun }}</span> 进行日结。如果过了当天重置时间，则需要导出清单进行统计
                    </div>
                </div>
            </template>
        </div>
        <el-form size="small" :inline="true" style="margin-top: 20px;">
            <el-form-item>
                <el-popover placement="bottom" width="500" :offset="195" v-model="visible">
                    <div class="custom_popover">
                        <div class="select_01 select_02" style="margin-bottom: 10px;">
                            <div v-for="(genre, index) in screenSelect">
                                <el-row :gutter="10" style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <el-col :span="24">
                                        <el-col :span="8">
                                            <el-select v-model="genre.label" :placeholder="$t('sys_c052')">
                                                <el-option :disabled="item.check" v-for="(item, idx) in screenOptions" :key="item.value" :label="item.name" :value="item.value" v-show="idx != 0" />
                                            </el-select>
                                        </el-col>
                                        <template v-if="genre.label == 1 || genre.label == 2 || genre.label == 3 || genre.label == 4">
                                            <el-col :span="7">
                                                <el-select v-model="genre.blong" :placeholder="$t('sys_c052')">
                                                    <el-option :label="$t('sys_g050')" :value="1" />
                                                </el-select>
                                            </el-col>
                                            <el-col :span="9" v-if="genre.label == 1 || genre.label == 2">
                                                <el-input :placeholder="screenOptions[genre.label].name"
                                                    v-model="genre.reason" clearable />
                                            </el-col>

                                            <el-col :span="9" v-if="genre.label == 3 || genre.label == 4">
                                                <el-select v-model="genre.reason"
                                                    :placeholder="screenOptions[genre.label].name">
                                                    <el-option :disabled="item.check"
                                                        v-for="(item, idx) in genre.label == 3 ? assianOptions : accountOptions"
                                                        :key="idx" :label="item" :value="idx" v-if="idx != 0" />
                                                </el-select>
                                            </el-col>
                                        </template>
                                    </el-col>
                                    <el-col :span="1" style="display: flex; justify-items:flex-end">
                                        <i class="el-icon-close" @click="delScreen(index)"></i>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="screen_01">
                            <div class="screen_t_01" @click="addScreen(0)">
                                <i class="el-icon-plus"></i>
                                <span>增加筛选条件</span>
                            </div>
                            <div class="screen_t_01" @click="addScreen(1)">
                                <i class="el-icon-delete"></i>
                                <span>清理规则</span>
                            </div>
                        </div>
                    </div>
                    <div slot="reference" class="level_01">
                        <i class="el-icon-arrow-down"></i>
                        <div class="level_01_1">{{ $t('sys_rai065') }}</div>
                        <span class="screen_t_02" v-if="screenSelect.length > 0">{{ screenSelect.length }}</span>
                    </div>
                </el-popover>
            </el-form-item>
            <el-form-item style="border: 1px solid #DCDFE6;border-radius: 4px;padding: 0 10px;">
                <div style="display: flex;align-items: center;">
                    <span style="color: #606266;">排序</span>
                    <div style="display: flex;padding-top: 2px;margin-left: 10px;box-sizing: border-box;margin-top: -1px;">
                        <el-form-item size="mini" style="margin-bottom: 0;line-height: 29px;">
                            <el-select v-model="query_type" clearable :placeholder="$t('sys_rai068')"
                                style="width: 160px;">
                                <el-option v-for="(item, idx) in dayOptions" :key="idx" :label="item" :value="idx"
                                    v-if="idx != 0" />
                            </el-select>
                        </el-form-item>
                        <el-form-item size="mini" style="margin-bottom: 0;line-height: 29px;">
                            <el-select v-model="sort_type" clearable :placeholder="$t('sys_rai069')"
                                style="width: 160px;">
                                <el-option v-for="(item, idx) in sortOptions" :key="idx" :label="item" :value="idx"
                                    v-if="idx != 0" />
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="refreshBtn">{{ $t('sys_c002') }}</el-button>
                <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
            </el-form-item>
            <div class="level_01_01" v-if="screenSelect.length > 0">
                <div class="level_01_02" v-for="(item, idx) in screenSelect" :key="idx" v-if="item.label" @click="delScreen(idx)">
                    <span v-if="item.label">【{{ screenOptions[item.label].name }}】</span>
                    <template v-if="!item.item">
                        <span>{{ $t('sys_g050') }}</span>
                        <span v-if="item.label == 1 || item.label == 2">【{{ item.reason }}】</span>
                        <span v-else>【{{ accountOptions[item.reason] }}】</span>
                    </template>
                    <i class="el-icon-error"></i>
                </div>
            </div>
            <el-form-item class="el-item-right" v-if="!message">
                <el-form-item>
                    <el-dropdown @command="(command)=>{exportCommand(command)}" trigger="click">
                        <el-button type="warning"> {{ $t('sys_mat050') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, idx) in exportOption" :key="idx" :command="{item,idx}" v-if="idx!=0">
                                {{ item }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-form-item>
                    <el-dropdown @command="(command)=>{handleCommand(command)}" trigger="click">
                        <el-button type="warning" :disabled="checkIdArry.length==0"> {{ $t('sys_g018') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, idx) in betchOption" :key="idx" :command="{item,idx}" v-if="idx!=0">
                                <i :class="'el-icon-' + item.icon"></i>
                                {{ item.label }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-button type="primary" @click="showDetailbtn(1)">{{ $t('sys_rai074') }}</el-button>
            </el-form-item>
        </el-form>
        <div class="tab_check_warp">
            <i slot="reference" class="el-icon-info"></i>
            <div> 已选 <span class="check_num">{{ checkIdArry.length || 0 }}</span> 项</div>
        </div>
        <el-table ref="serveTable" :data="detailDataList" border height="560" v-loading="loading"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)"
            style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange"
            @row-click="rowSelectChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="account" :label="$t('sys_rai053')" minWidth="130" />
            <el-table-column prop="staff_no" :label="$t('sys_l017')" minWidth="120" />
            <el-table-column prop="status" :label="$t('sys_mat065')" minWidth="120">
                <template slot-scope="scope">
                    <el-tag size="small" :type="handleTag(scope.row.status)"> {{ accountOptions[scope.row.status] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="distribute_status" :label="$t('sys_g099')" minWidth="120">
                <template slot-scope="scope">
                    <span :style="'color:' + (scope.row.distribute_status == 1 ? '#67c23a' : '#f56c6c')"
                        v-text="assianOptions[scope.row.distribute_status] || '-'"></span>
                </template>
            </el-table-column>
            <el-table-column prop="to_day_fan_new_num" :label="$t('sys_rai029')" minWidth="120" />
            <el-table-column prop="fan_new_num" :label="$t('sys_rai028')" minWidth="120" />
            <el-table-column prop="to_day_repeat_num" :label="$t('sys_rai070')" minWidth="140" />
            <el-table-column prop="repeat_num" :label="$t('sys_rai071')" minWidth="140" />
            <el-table-column prop="nick_name" :label="$t('sys_g022')" minWidth="120">
                <template slot-scope="scope">
                    {{ scope.row.nick_name||"-" }}
                </template>
            </el-table-column>
            <el-table-column prop="head" :label="$t('sys_g021')" width="80">
                <template slot-scope="scope">
                    <el-avatar :src="scope.row.head != '无头像'&&scope.row.head !='' ? scope.row.head : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                </template>
            </el-table-column>
            <el-table-column prop="itime" :label="$t('sys_rai072')" minWidth="148">
                <template slot-scope="scope">
                    {{ scope.row.offline_time > 0 ? $baseFun.resetTime(scope.row.offline_time * 1000) : "-" }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('sys_rai073')" width="120"  v-if="!message">
                <template slot-scope="scope">
                    <el-button :disabled="checkIdArry.length > 0" size="small" type="primary" @click.stop="showDetailbtn(scope.row)">{{ $t('sys_rai073') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="layui_page">
            <el-pagination background @size-change="sizeHandle" @current-change="pageHandle" :page-sizes="pageOption"
                :current-page.sync="page" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="区间粉丝导出" center :visible.sync="exportModel" :close-on-click-modal="false" width="450px">
            <el-form ref="portForm" size="small" :model="portForm" label-width="100px" :rules="portRules">
                <el-form-item :label="$t('sys_g117') + ':'" prop="export_time">
                    <el-date-picker v-model="portForm.export_time" type="daterange"  range-separator="至" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
                </el-form-item>
                <el-form-item label-width="0" style="text-align:center;margin-top: 40px;" class="el-item-bottom">
                    <el-button @click="exportModel = false">{{ $t('sys_c023') }}</el-button>
                    <el-button :loading="isLoading" type="primary" @click="submitBtn('portForm')">{{$t('sys_c024') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { successTips, resetPage,cutParam } from '@/utils/index'
import { getworkaccountlist, getworktask,dodistributeaccount,dooutworkaccount } from '@/api/counter'
export default {
    props: { 
        message:{
            type:Boolean,
            default:false
        },
        pwd_type:{
            type:Number,
            default:null
        }
     },
    data() {
        return {
            page: 1,
            limit: 10,
            total: 0,
            account_status: "",
            status: "",
            sort: "",
            user_pwd: "",
            user_uid: "",
            query_type: "",
            sort_type: "",
            link_type: 1,
            link_url: "",
            power_value: "",
            power_time: "",
            record_time: "",
            reset_time: "",
            zeroing_time: "",
            loading: false,
            isLoading: false,
            visible: false,
            workTimeTask:null,
            workTime:15000,
            exportModel: false,
            detailDataList: [],
            statisticsList: [],
            screenSelect: [],
            checkIdArry: [],
            pageOption: resetPage(),
            task_name: "",
            work_id: "",
            task_config: "",
            copayConent: "",
            sucess_num: "",
            read_rate: "",
            reply_rate: "",
            receive_msg_num: "",
            portForm:{
                export_time:""
            }
        }
    },
    computed: {
        portRules(){
            return {
                export_time:[
                    {type: 'array', required: true, message: '请选择时间', trigger: 'change'}
                ]
            }
        },
        fansSun(){
            let [ b, c ] = this.cardOption.filter((item,idx) =>{return idx==1||idx==3})
            return b.num+c.num
        },
        taskStatus() {
            return ["", this.$t('sys_g032'), this.$t('sys_g033')]
        },
        seatOption() {
            return ["", this.$t('sys_rai053'), this.$t('sys_rai054')]
        },
        exportOption() {
            return ["", this.$t('sys_g101'), this.$t('sys_g102'), this.$t('sys_g103')]
        },
        statusOptions() {
            return ["", this.$t('sys_l071'), this.$t('sys_l072'), this.$t('sys_g068'), this.$t('sys_g067'), this.$t('sys_mat047')]
        },
        powerOptions() {
            return ["", this.$t('sys_rai060'), this.$t('sys_rai061'), this.$t('sys_rai062'), this.$t('sys_rai063'), this.$t('sys_rai064')]
        },
        accountOptions() {
            return ["", this.$t('sys_g032'), this.$t('sys_g033'), this.$t('sys_g034'), this.$t('sys_g035'), this.$t('sys_g036')]
        },
        dayOptions() {
            return ["", this.$t('sys_rai029'), this.$t('sys_rai028'), this.$t('sys_rai066'), this.$t('sys_rai067')]
        },
        sortOptions() {
            return ["", this.$t('sys_g008'), this.$t('sys_g009')]
        },
        screenOptions() {
            return [
                {}, { name: this.$t('sys_rai053'), value: 1, check: false }, { name: this.$t('sys_l017'), value: 2, check: false },
                { name: this.$t('sys_g099'), value: 3, check: false }, { name: this.$t('sys_mat065'), value: 4, check: false }
            ]
            // return ["",this.$t('sys_g022'),this.$t('sys_g025'),this.$t('sys_l062'),this.$t('sys_g015'),this.$t('sys_g014'),this.$t('sys_g013')]
        },
        betchOption() {
            return [
                {},
                {
                    icon: "open",
                    label: this.$t('sys_rai076',{value:this.$t('sys_l102')})
                },
                {
                    icon: "turn-off",
                    label: this.$t('sys_rai076',{value:this.$t('sys_l103')})
                }
            ]
            // return ["",this.$t('sys_g022'),this.$t('sys_g025'),this.$t('sys_l062'),this.$t('sys_g015'),this.$t('sys_g014'),this.$t('sys_g013')]
        },
        assianOptions() {
            return ["", this.$t('sys_l106'), this.$t('sys_l096')]
        },
        termOptions() {
            return ["", this.$t('sys_g050')]
        },
        cardOption() {
            return [
                {
                    idx:"A",
                    label: this.$t('sys_rai028'),
                    num: 0,
                    b_g: "#fef4e9",
                    t_c: "#ff8400"
                },
                {
                    idx:"B",
                    label: this.$t('sys_rai029'),
                    num: 0,
                    b_g: "#eef6fe",
                    t_c: "#369aff"
                },
                {
                    idx:"C",
                    label: this.$t('sys_rai030'),
                    num: 0,
                    b_g: "#dbfff1",
                    t_c: "#02c97a"
                },
                {
                    idx:"D",
                    label: this.$t('sys_rai031'),
                    num: 0,
                    b_g: "#f9edff",
                    t_c: "#b357ff"
                }
            ]
        }
    },
    created() {
        let isWork = location.href.includes('/work-order-sharing');
        if (isWork) {
            let urlObj = cutParam(location.href);
            this.work_id = urlObj.workId;
            this.user_uid = urlObj.uid;
            this.user_pwd =  localStorage.getItem('check_pwd');
        }else{
            this.user_uid = getUserInfo().uid;
            this.work_id = this.$route.query.workId;
        }
        this.getStatistics(1);
        this.getDetailList();
        this.startWorkHeart();
    },
    methods: {
        restQuery() {
            this.page = 1;
            this.sort_type = "";
            this.query_type = "";
            this.addScreen(1);
        },
        refreshBtn(){
            this.getStatistics()
            this.getDetailList(1);
        },
        startWorkHeart() {
            // this.workTimeTask = null;
            this.workTimeTask = setInterval(() => {
                this.getStatistics()
            },this.workTime)
        },
        getStatistics(task) {
            let params = {
                is_check_pwd:1,
                id: this.work_id,
                uid:this.user_uid,
                password:this.user_pwd
            }
            this.pwd_type!=1?delete params.password:"";
            this.pwd_type!=1?delete params.is_check_pwd:"";
            this.isLoading = true;  
            getworktask(params).then(res => {
                this.isLoading = false;
                if(res.code != 0 && this.pwd_type==1){
                    clearInterval(this.workTimeTask);
                    this.$emit("showMasker",true)
                }
                let vita = res.data;
                this.reset_time = vita.reset_time || '~';
                this.zeroing_time = vita.zeroing_time || "00:00";
                if (vita == "") return;
                for (let k = 0; k < this.cardOption.length; k++) {
                    let item = this.cardOption[k];
                    if (k == 0) {
                        item.num = vita.fan_new_num || 0;
                    } else if (k == 1) {
                        item.num = vita.to_day_fan_new_num || 0;
                    } else if (k == 2) {
                        item.num = vita.remove_fan_num || 0;
                    } else if (k == 3) {
                        item.num = vita.to_day_remove_fan_num || 0;
                    }
                }
            })
        },
        getDetailList(num) {
            this.loading = true;
            this.detailDataList = [];
            this.page = num ? num : this.page;
            let params = {
                page: this.page,
                limit: this.limit,
                uid:this.user_uid,
                work_id: this.work_id,
            }
            let symbol = this.sort_type == 2 ? "-" : "";
            if (this.query_type == 1) {
                params.sort = symbol + 'fan_new_num';
            } else if (this.query_type == 2) {
                params.sort = symbol + 'to_day_fan_new_num';
            } else if (this.query_type == 3) {
                params.sort = symbol + 'repeat_num';
            } else if (this.query_type == 4) {
                params.sort = symbol + 'to_day_repeat_num';
            }
            for (let k = 0; k < this.screenSelect.length; k++) {
                if (this.screenSelect[k].label == 1) {
                    params.account = this.screenSelect[k].reason;
                }
                if (this.screenSelect[k].label == 2) {
                    params.staff_no = this.screenSelect[k].reason;
                }
                if (this.screenSelect[k].label == 3) {
                    params.distribute_status = this.screenSelect[k].reason;
                }
                if (this.screenSelect[k].label == 4 && this.screenSelect[k].reason) {
                    params.status = this.screenSelect[k].reason;
                }
            }
            getworkaccountlist(params).then(res => {
                this.loading = false;
                this.total = res.data.total;
                this.detailDataList = res.data.list || [];
            })
        },
        sizeHandle(val) {
            this.limit = val;
            this.getDetailList();
        },
        pageHandle(val) {
            this.page = val;
            this.getDetailList();
        },
        exportText(row) {
            // doouttaskrecordexcel({id:this.task_id}).then(res=>{
            //   if (res.code != 0) return;
            //     window.location.href = res.data.url
            // })
        },
        addScreen(type) {
            if (type == 1) {
                for (let x = 0; x < this.screenOptions.length; x++) {
                    this.screenOptions[x].check = false;
                }
                this.screenSelect = [];
                this.getDetailList(1);
                return;
            }
            let newObj = { label: "", blong: 1, reason: "", item: "" }
            this.screenSelect.push(newObj)
            for (let x = 0; x < this.screenOptions.length; x++) {
                for (let l = 0; l < this.screenSelect.length; l++) {
                    if (this.screenOptions[x].value == this.screenSelect[l].label) {
                        this.screenOptions[x].check = true;
                    }
                }
            }
        },
        delScreen(idx) {
            for (let k = 0; k < this.screenSelect.length; k++) {
                if (k === idx) {
                    this.screenSelect.splice(k, 1);
                    this.getDetailList(1);
                }
            }
        },
        handleSelectionChange(row) {
            this.checkIdArry = row.map(item => { return item.account })
        },
        rowSelectChange(row, column, event) {
            let refsElTable = this.$refs.serveTable;
            let findRow = this.checkIdArry.find(item => item == row.account);
            if (findRow) {
                refsElTable.toggleRowSelection(row, false);
                return;
            }
            refsElTable.toggleRowSelection(row, true);
        },
        handleTag(type) {
            let color;
            switch (type) {
                case 1:
                    color = "danger";
                    break;
                case 2:
                    color = "success";
                    break;
                case 3:
                    color = "warning";
                    break;
                case 4:
                    color = "danger";
                    break;
                case 5:
                    color = "warning";
                    break;
                default:
                    break;
            }
            return color;
        },
        showDetailbtn(row) {
            let params = {
                workId: row == 1 ? this.work_id : row.work_id
            }
            row != 1 ? params.account = row.account : "";
            this.$router.push({ path: "/fanDetails", query: params });
        },
        handleCommand(row){
            let that = this;
            that.$confirm(`确认${row.item.label}吗？`, that.$t('sys_l013'), {
                type: 'warning',
                confirmButtonText: that.$t('sys_c024'),
                cancelButtonText: that.$t('sys_c023'),
                beforeClose: function (action, instance, done) {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        dodistributeaccount({distribute_status:row.idx,accounts:that.checkIdArry}).then(res => {
                            instance.confirmButtonLoading = false;
                            if (res.code != 0) return;
                            that.getDetailList(1);
                            successTips(that)
                            done();
                        })
                    } else {
                        done();
                        instance.confirmButtonLoading = false;
                    }
                }
            }).catch(() => {
                that.$message({ type: 'info', message: that.$t('sys_c048') });
            })
        },
        exportCommand(row){
            if (row.idx == 2) {
                this.exportModel =true;
            }else{
                let params = {
                    ptype:row.idx,
                    work_id:this.work_id,
                    accounts:this.checkIdArry
                }
                this.checkIdArry.length==0? delete params.accounts:"";
                dooutworkaccount(params).then(res=>{
                    if (res.code != 0) return;
                    window.location.href = res.data.url
                })
            }
        },
        submitBtn(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        ptype:2,
                        work_id:this.work_id,
                        accounts:this.checkIdArry,
                        start_time:this.$baseFun.resetTime(this.portForm.export_time[0],1),
                        end_time:this.$baseFun.resetTime(this.portForm.export_time[0],2),
                    }
                    this.isLoading=true;
                    dooutworkaccount(params).then(res=>{
                        this.isLoading=false;
                        if (res.code != 0) return;
                        this.getDetailList(1);
                        this.exportModel = false;
                        window.location.href = res.data.url
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        }
    },
    destroyed() {
        clearInterval(this.workTimeTask);
        window.removeEventListener('beforeunload', e => this.startWorkHeart(e))
    }
}
</script>

<style lang="scss" scoped>
.title_01 {
    display: flex;
    font-size: 14px;
    margin: 0 0 10px 10px;
}

.detail_card {
    // width: 100%;
    width: 100%;
    min-height: 170px;
    display: flex;
    flex-wrap: wrap;
    padding: 13px;
    border-radius: 4px;
    box-sizing: border-box;
    justify-content: flex-start;
    border: 1px solid #ebeef5;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    .work_order {
        margin: 0 20px;
    }

    .card_warp {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .card_item {
            width: calc((100% - (4 - 1) * 40px) / 4);
            display: flex;
            font-size: 14px;
            cursor: pointer;
            align-items: center;
            border-radius: 10px;
            padding: 12px 20px;
            margin: 10px 0;
            margin-left: 40px;
            border-radius: 10px;
            justify-content: space-between;
            .card_text {
                width: 42px;
                height: 42px;
                display: flex;
                color: #fff;
                font-size: 22px;
                font-weight: 700;
                flex-shrink: 0;
                align-items: center;
                border-radius: 50%;
                text-align: center;
                justify-content: center;
                background: -webkit-gradient(linear, left top, left bottom, from(#ffaf59), to(#ffce99));
                background: linear-gradient(180deg, #ffaf59, #ffce99);
                margin-right: 15px
            }

            .card_num {
                font-weight: 600;
                font-size: 20px;
                text-decoration: underline;

                em {
                    font-style: normal;
                }
            }
        }

        .card_item:nth-of-type(4n + 1) {
            margin-left: 0;
        }
    }

    .foot_msg {
        padding-top: 5px;
        font-size: 14px;
        font-weight: 400;
        color: #666;

        span {
            color: #f56c6c;
            font-weight: bold;
        }
    }
}

.level_01 {
    display: flex;
    color: #C0C4CC;
    align-items: center;
    width: max-content;
    padding: 0 15px;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    border: 1px solid #DCDFE6;

    .level_01_1 {
        color: #606266;
        font-size: 13px;
        margin-left: 10px;
    }

    .screen_t_02 {
        width: 20px;
        height: 20px;
        color: #fff;
        display: flex;
        font-size: 12px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-left: 5px;
        background-color: #409eff;
    }

    .down_01 {
        width: 500px;
        height: 40px;
        position: absolute;
        top: 40px;
        left: 0;
        border-radius: 4px;
        border: solid 1px #dfe4ed;
        background-color: #FFFFFF;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .down_01_01 {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            top: -12px;
            left: 20%;
            transform: translateX(-50%);
            margin-right: 3px;
            border-bottom-width: 0;
            border-bottom-color: #e6ebf5;
            border-width: 6px;
            -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
            filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
        }

        .down_01_01::after {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
        }
    }
}

.level_01:hover {
    border-color: #C0C4CC;
}

.custom_popover {
    .screen_01 {
        color: #209cdf;
        display: flex;

        .screen_t_01 {
            display: flex;
            opacity: .7;
            align-items: center;
            cursor: pointer;

            i {
                margin-right: 5px;
            }
        }

        .screen_t_01:nth-child(1) {
            margin-right: 20px;
        }

        .screen_t_01:hover {
            opacity: 1;
        }
    }

    .select_02 {
        .el-icon-close {
            font-size: 14px;
            color: #f56c6c;
            font-weight: bold;
            cursor: pointer;
        }
    }
}

.level_01_01 {
    width: 100%;
    display: flex;
    font-size: 12px;
    margin-bottom: 10px;

    .level_01_02 {
        color: #409eff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 8px;
        border-radius: 4px;
        width: max-content;
        margin-right: 10px;
        background-color: #ecf5ff;

        .el-icon-error {
            color: #409eff;
            font-size: 17px;
            cursor: pointer;
            margin-left: 10px;
        }
    }
}
</style>