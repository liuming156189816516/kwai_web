<template>
    <div class="">
        <el-form size="small" :inline="true" style="margin-top: 10px;" label-width="0">
            <el-form-item>
                <el-button size="small" @click="$router.go(-1)">
                    <i class="el-icon-back"></i>
                    <span>{{$t('sys_q006')}}</span>
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-input clearable v-model="account" placeholder="请输入账号搜索" />
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="ipCtime" type="daterange" range-separator="至" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
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
            <el-table-column prop="itime" :label="$t('sys_rai011')" minWidth="120">
                <template slot-scope="scope">
                    {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : 0 }}
                </template>
            </el-table-column>
            <el-table-column prop="up_type" :label="$t('sys_rai012')" minWidth="120">
                <template slot-scope="scope">{{ updateOption[scope.row.up_type] }}</template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('sys_rai013')" minWidth="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status==1?'warning':scope.row.status==2?'danger':'info'" size="small"> {{ statusOption[scope.row.status] }}</el-tag>
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
import { getaccountupinfologlist } from '@/api/storeroom'
export default {
    data() {
        return {
            page: 1,
            limit: 10,
            total: 0,
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
            return ["", this.$t('sys_mat049'), this.$t('sys_mat048'), this.$t('sys_rai017')]
        }
    },
    created() {
        this.getRecordList();
    },
    methods: {
        restQuery() {
            this.page = 1 ;
            this.account = "";
            this.ipCtime = "";
            this.getRecordList(1);
        },
        getRecordList(num) {
            this.loading = true;
            this.page = num ? num : this.page;
            const sTime = this.ipCtime;
            let params = {
                page: this.page,
                limit: this.limit,
                account: this.account,
                start_time: sTime ? this.$baseFun.resetTime(sTime[0], 1) : -1,
                end_time: sTime ? this.$baseFun.resetTime(sTime[1], 1) : -1
            }
            getaccountupinfologlist(params).then(res => {
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