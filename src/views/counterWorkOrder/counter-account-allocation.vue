<template>
    <div class="">
        <el-form size="small" :inline="true" style="margin-top: 10px;" label-width="0">
            <el-form-item>
                <el-button size="small" @click="$router.go(-1)">
                    <i class="el-icon-back"></i>
                    <span>{{$t('sys_q006')}}</span>
                </el-button>
            </el-form-item>
            <el-form-item class="select_body">
                <div style="display: flex;">
                    <el-select class="select_ele" v-model="seat_id" :placeholder="$t('sys_c052')">
                        <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-show="item!=''" />
                    </el-select>
                    <el-input clearable class="input_ele" :placeholder="$t('sys_mat021')" v-model="account" />
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getRecordList(1)">{{ $t('sys_c002') }}</el-button>
                <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="detailDataList" border height="660" v-loading="loading"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)"
            style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }">
            <el-table-column type="index" :label="$t('sys_g020')" width="60" />
            <el-table-column prop="account" :label="$t('sys_g027')" minWidth="140" />
            <el-table-column prop="status" :label="$t('sys_c005')" minWidth="120">
                <template slot-scope="scope">
                    {{ statusOption[scope.row.status] }}
                    <!-- <el-tag :type="scope.row.status==1?'warning':scope.row.status==2?'danger':'info'" size="small"> {{ statusOption[scope.row.status] }}</el-tag> -->
                </template>
            </el-table-column>
            <el-table-column prop="staff_no" :label="$t('sys_l017')" minWidth="120" />
            <el-table-column prop="desc" :label="$t('sys_l083')" minWidth="120" />
            <el-table-column prop="itime" :label="$t('sys_rai059')" minWidth="120">
                <template slot-scope="scope">
                    {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : 0 }}
                </template>
            </el-table-column>
        </el-table>
        <div class="layui_page">
            <el-pagination background @size-change="sizeHandle" @current-change="pageHandle" :page-sizes="pageOption"
                :current-page.sync="page" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import { successTips, resetPage } from '@/utils/index'
import { getworkrecordlist } from '@/api/counter'
export default {
    data() {
        return {
            page: 1,
            limit: 10,
            total: 0,
            seat_id:1,
            work_id:"",
            loading: false,
            isLoading: false,
            pageOption: resetPage(),
            account: "",
            ipCtime: "",
            detailDataList:[]
        }
    },
    computed: {
        updateOption() {
            return ["", this.$t('sys_rai014'), this.$t('sys_rai015'), this.$t('sys_rai016')]
        },
        statusOption() {
            return ["", this.$t('sys_rai051'), this.$t('sys_rai052')]
        },
        seatOption(){
            return ["", this.$t('sys_g027'), this.$t('sys_l017')]
        }
    },
    created() {
        this.work_id = this.$route.query.workId;
        this.getRecordList();
    },
    methods: {
        restQuery() {
            this.page = 1 ;
            this.account = "";
            this.getRecordList(1);
        },
        getRecordList(num) {
            this.loading = true;
            this.page = num ? num : this.page;
            let params = {
                page: this.page,
                limit: this.limit,
                work_id:this.work_id
            }
            if (this.account&&this.seat_id==1) {
                params.account = this.account;
            }else if (this.account&&this.seat_id==2){
                params.staff_no = this.account;
            }
            getworkrecordlist(params).then(res => {
                console.log(res);
                this.loading = false;
                this.total = res.data.total;
                this.detailDataList = res.data.list || [];
            })
        },
        sizeHandle(val) {
            this.limit = val;
            this.getRecordList();
        },
        pageHandle(val) {
            this.page = val;
            this.getRecordList();
        }
    }
}
</script>

<style lang="scss" scoped>
.title_01 {
    display: flex;
    font-size: 14px;
    margin: 0 0 10px 10px;
}

.select_body {
    .select_ele {
        width: 120px;

        ::v-deep .el-input__inner {
            border-right: transparent;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        // ::v-deep .el-input__inner:focus{
        //     border-right: 1px solid #1890ff;
        // }
    }

    .input_ele {
        width: 202px;

        ::v-deep .el-input__inner {
            border-left: transparent;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: 1px solid #DCDFE6;
        }

        ::v-deep .el-input__inner:focus {
            border-left: 1px solid #1890ff;
        }
    }
}
</style>