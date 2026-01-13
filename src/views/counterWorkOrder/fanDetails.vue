<template>
  <div class="">
    <el-form size="small" :inline="true" style="margin-top: 10px;">
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
            <div class="card_item" v-for="(item, idx) in cardOption" :style="{ background: `${item.b_g}` }"
              @click="refreshBtn">
              <div style="display: flex;align-items: center;">
                <span class="card_text">{{ item.idx }}</span> <span>{{ item.label }}:</span>
              </div>
              <span class="card_num" :style="{ color: `${item.t_c}` }"
                v-text="idx == 4 || idx == 5 ? (item.num * 100).toFixed(2) + '%' : item.num"></span>
            </div>
          </div>
          <div class="foot_msg">本工单建议在置零时间<span>（{{ zeroing_time }}）</span>前导出清单，双方确认售后数量，按
             <span>B + D = {{ fansSun }}</span>
            进行日结。如果过了当天重置时间，则需要导出清单进行统计
          </div>
        </div>
      </template>
    </div>
    <el-form size="small" :inline="true" style="margin-top: 20px;">
      <el-form-item class="select_body">
        <div style="display: flex;">
          <el-select class="select_ele" v-model="link_type" :placeholder="$t('sys_c052')" @change="link_url = ''">
            <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-if="item != ''" />
          </el-select>
          <el-input clearable class="input_ele" :placeholder="$t('sys_mat021')" v-model="link_url" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-select v-model="power_value" clearable :placeholder="$t('sys_rai057')">
          <el-option v-for="(item, idx) in powerOptions" :key="idx" :label="item" :value="idx" v-if="item != ''" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="power_time" type="datetimerange" range-separator="至" start-placeholder="进粉开始时间"
          end-placeholder="进粉结束时间" style="width: 360px;" />
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="record_time" type="datetimerange" range-separator="至" start-placeholder="进粉记录开始时间"
          end-placeholder="进粉记录结束时间" style="width: 360px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="refreshBtn">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
      </el-form-item>

      <el-form-item class="el-item-right">
        <el-button type="warning" @click="exportText">导出数据</el-button>
      </el-form-item>
    </el-form>

    <div class="tab_check_warp">
      <i slot="reference" class="el-icon-info"></i>
      <div> 已选 <span class="check_num">{{ checkIdArry.length || 0 }}</span> 项</div>
    </div>
    <el-table :data="detailDataList" border height="660" v-loading="loading" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;"
      :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }"
      ref="serveTable" @selection-change="handleSelectionChange" @row-click="rowSelectChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="account" :label="$t('sys_rai053')" minWidth="140" />
      <el-table-column prop="friend_account" :label="$t('sys_rai054')" minWidth="140" />
      <!-- <el-table-column prop="account" :label="$t('sys_c068')" minWidth="140" /> -->
      <el-table-column prop="in_time" :label="$t('sys_rai055')" minWidth="160">
        <template slot-scope="scope">
          {{ scope.row.in_time > 0 ? $baseFun.resetTime(scope.row.in_time * 1000) : "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="itime" :label="$t('sys_rai056')" minWidth="160">
        <template slot-scope="scope">
          {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="account" :label="$t('sys_rai057')" minWidth="140">
        <template slot-scope="scope">{{ powerOptions[scope.row.fans_condition] || '~' }}</template>
      </el-table-column>
      <!-- <el-table-column prop="account" :label="$t('sys_rai058')" minWidth="140" /> -->
    </el-table>
    <div class="layui_page">
      <el-pagination background @size-change="sizeHandle" @current-change="pageHandle" :page-sizes="pageOption"
        :current-page.sync="page" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { successTips, resetPage } from '@/utils/index'
import { getworkaccountfriendlist, getworktask,dooutworkfriend } from '@/api/counter'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      account_status: "",
      status: "",
      sort: "",
      link_type: 1,
      link_url: "",
      power_value: "",
      power_time: "",
      record_time: "",
      reset_time: "",
      zeroing_time: "",
      loading: false,
      isLoading: false,
      detailDataList: [],
      statisticsList: [],
      checkIdArry: [],
      fansArry: [],
      pageOption: resetPage(),
      task_name: "",
      work_id: "",
      task_config: "",
      copayConent: "",
      sucess_num: "",
      read_rate: "",
      reply_rate: "",
      receive_msg_num: "",
      workTimeTask:null,
      workTime:15000,
    }
  },
  computed: {
    taskStatus() {
      return ["", this.$t('sys_g032'), this.$t('sys_g033')]
    },
    seatOption() {
      return ["", this.$t('sys_rai053'), this.$t('sys_rai054')]
    },
    statusOptions() {
      return ["", this.$t('sys_l071'), this.$t('sys_l072'), this.$t('sys_g068'), this.$t('sys_g067'), this.$t('sys_mat047')]
    },
    powerOptions() {
      return ["", this.$t('sys_rai060'), this.$t('sys_rai061'), this.$t('sys_rai062'), this.$t('sys_rai063'), this.$t('sys_rai064')]
    },
    fansSun(){
      let [ b, c ] = this.cardOption.filter((item,idx) =>{return idx==1||idx==3})
      return b.num+c.num
    },
    cardOption() {
      return [
        {
          idx: "A",
          label: this.$t('sys_rai028'),
          num: 0,
          b_g: "#fef4e9",
          t_c: "#ff8400"
        },
        {
          idx: "B",
          label: this.$t('sys_rai029'),
          num: 0,
          b_g: "#eef6fe",
          t_c: "#369aff"
        },
        {
          idx: "C",
          label: this.$t('sys_rai030'),
          num: 0,
          b_g: "#dbfff1",
          t_c: "#02c97a"
        },
        {
          idx: "D",
          label: this.$t('sys_rai031'),
          num: 0,
          b_g: "#f9edff",
          t_c: "#b357ff"
        }
      ]
    }
  },
  created() {
    this.work_id = this.$route.query.workId;
    this.link_url = this.$route.query.account || "";
    this.getStatistics(1);
    this.getDetailList();
    this.startWorkHeart();
  },
  methods: {
    restQuery() {
      this.link_type = 1;
      this.link_url = "";
      this.power_time = "";
      this.record_time = "";
      this.power_value = "";
      this.getDetailList(1);
    },
    refreshBtn(){
      this.getStatistics()
      this.getDetailList(1);
    },
    startWorkHeart() {
      this.workTimeTask = setInterval(() => {
        this.getStatistics()
      },this.workTime)
    },
    getStatistics() {
      // if (task==1) {
        this.isLoading = true;
      // }
      getworktask({ id: this.work_id, uid: getUserInfo().uid }).then(res => {
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
        this.isLoading = false;
      })
    },
    getDetailList(num) {
      this.loading = true;
      this.detailDataList = [];
      this.page = num ? num : this.page;
      let params = {
        page: this.page,
        limit: this.limit,
        work_id: this.work_id,
        uid: getUserInfo().uid,
        fans_condition: this.power_value || -1,
        start_time: this.power_time ? this.$baseFun.resetTime(this.power_time[0], 1) : -1,
        in_end_time: this.power_time ? this.$baseFun.resetTime(this.power_time[1], 1) : -1,
        it_start_time: this.record_time ? this.$baseFun.resetTime(this.record_time[0], 1) : -1,
        it_end_time: this.record_time ? this.$baseFun.resetTime(this.record_time[1], 1) : -1
      }
      if (this.link_url && this.link_type == 1) {
        params.account = this.link_url;
      } else if (this.link_url && this.link_type == 2) {
        params.friend_account = this.link_url;
      }
      getworkaccountfriendlist(params).then(res => {
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
      let params = {
        work_id:this.work_id,
        fans_condition: this.power_value || -1,
        start_time: this.power_time ? this.$baseFun.resetTime(this.power_time[0],1):-1,
        in_end_time: this.power_time ? this.$baseFun.resetTime(this.power_time[1],1):-1,
        it_start_time: this.record_time ? this.$baseFun.resetTime(this.record_time[0],1):-1,
        it_end_time: this.record_time ? this.$baseFun.resetTime(this.record_time[1],1):-1
      }
      if (this.link_url && this.link_type == 1) {
        params.account = this.link_url;
      } else if (this.link_url && this.link_type == 2) {
        params.friend_account = this.link_url;
      }
      dooutworkfriend(params).then(res=>{
        if (res.code != 0) return;
          window.location.href = res.data.url
      })
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => { return item.account })
      this.fansArry = row.map(item => { return item.friend_account })
    },
    rowSelectChange(row, column, event) {
      let refsElTable = this.$refs.serveTable;
      let findRow = this.checkIdArry.find(item => item == row.account);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
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