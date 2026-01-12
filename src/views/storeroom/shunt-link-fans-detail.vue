<template>
    <div class="">
      <el-alert style="margin-bottom: 10px;line-height: 1.8;" title="分流链接信息" type="success"
        description="链接名称：ceshi001分配类型：WhatsApp创建时间：2024-02-02 14:04:39链接工单：TK4b9abc6a6" />
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
          <el-button size="small" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
            <span>{{$t('sys_q006')}}</span>
          </el-button>
        </el-form-item>
        <el-form-item class="select_body">
          <div style="display: flex;">
            <el-select class="select_ele" v-model="link_type" :placeholder="$t('sys_c052')">
              <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-show="item != ''" />
            </el-select>
            <el-input clearable class="input_ele" :placeholder="$t('sys_mat021')" v-model="link_url" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDetailList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
          <el-button type="warning">导出</el-button>
          <el-button @click.stop type="text" size="small" style="padding: 0;">
            <el-dropdown @command="(command) => { handleNewwork(command) }" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="success" plain size="small">
                  {{ $t('sys_c080') }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, idx) in moreOption" :key="idx" :command="idx" v-if="idx != 0">{{ item }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="detailDataList" border height="660" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;"
        :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" ref="serveTable" @selection-change="handleSelectionChange" @row-click="rowSelectChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" :label="$t('sys_g020')" width="60" />
        <el-table-column prop="account" :label="$t('sys_g098')" minWidth="140" />
        <el-table-column prop="sucess_num" :label="$t('sys_g099')" minWidth="120">
          <template slot="header">
            <el-dropdown trigger="click" size="medium" @command="(command) => handlestatus(command)">
              <span style="color:#909399" :class="[account_status ? 'dropdown_title' : '']"> {{ $t('sys_g099') }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :class="{ 'dropdown_selected': idx == account_status }"
                  v-for="(item, idx) in taskStatus" :key="idx" :command="idx">{{ item == '' ? $t('sys_l053') : item }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.account_status == 2 ? 'success' : 'danger'">
              {{ taskStatus[scope.row.account_status] || "-" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receive_msg_num" :label="$t('sys_l082')" minWidth="160" />
        <el-table-column prop="receive_msg_num" :label="$t('sys_g100')" minWidth="160" />
      </el-table>
      <div class="layui_page">
        <el-pagination background @size-change="sizeHandle" @current-change="pageHandle" :page-sizes="pageOption"
          :current-page.sync="page" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-dialog title="添加网址" center :visible.sync="taskCongifModel" :close-on-click-modal="false" width="500px">
        <el-form ref="shuntForm" size="small" label-width="90px">
          <el-form-item :label="$t('sys_l100') + '：'">
            <div class="website_list">
              <div class="website_item" v-for="(item, idx) in websiteOption" :key="idx">
                <el-input v-model="item.url" clearable :placeholder="$t('sys_mat061', { value: $t('sys_l101') })" />
                <i class="el-icon-circle-plus-outline" v-if="idx == 0" @click="addWebsite" />
                <i class="el-icon-circle-close" v-else @click="delWebsite(idx)" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label-width="0" style="text-align: center;">
            <el-button id="taskConfig" @click="taskCongifModel = false">{{ $t('sys_c024') }}</el-button>
            <el-button type="primary" @click="taskCongifModel = false">{{ $t('sys_c024') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>

  <script>
  import Clipboard from 'clipboard';
  import { successTips, resetPage } from '@/utils/index'
  import { getsendmsginfolist, getdatasum, doouttaskrecordexcel } from '@/api/task'
  export default {
    data() {
      return {
        page: 1,
        limit: 10,
        total: 0,
        link_url: "",
        task_id: "",
        link_type: 1,
        loading: false,
        checkIdArry:[""],
        account_status: "",
        taskCongifModel: false,
        detailDataList: [],
        pageOption: resetPage(),
        websiteOption: [{ url: "" }]
      }
    },
    computed: {
      taskStatus() {
        return ["", this.$t('sys_g032'), this.$t('sys_g033')]
      },
      moreOption() {
        return ["", this.$t('sys_g101'), this.$t('sys_g102'), this.$t('sys_g103')]
      },
      seatOption() {
        return ["", this.$t('sys_g027'), this.$t('sys_g022'), this.$t('sys_l062'), this.$t('sys_g098'), this.$t('sys_mat062')]
      }
    },
    created() {
      this.task_id = this.$route.query.task_id;
      const query = this.$route.query.params;
    },
    methods: {
      restQuery() {
        this.account_status = "";
        this.getDetailList(1);
      },
      sizeHandle(val) {
        this.limit = val;
        this.getDetailList();
      },
      pageHandle(val) {
        this.page = val;
        this.getDetailList();
      },
      showTaskConfig() {
        this.$router.push({ path: '/shunt-allocation-details' });
      },
      handlestatus() {

      },
      handleNewwork(idx) {
        console.log(idx);
        if (idx == 3) {
          this.taskCongifModel = true;
        }
      },
      addWebsite() {
        this.websiteOption.push({ url: "" })
      },
      delWebsite(idx) {
        for (let k = 0; k < this.websiteOption.length; k++) {
          if (k == idx) {
            this.websiteOption.splice(k, 1)
          }
        }
      },
      handleSelectionChange(row) {
        this.checkIdArry = row.map(item => { return item.id })
      },
      rowSelectChange(row, column, event) {
        let refsElTable = this.$refs.serveTable;
        let findRow = this.checkIdArry.find(item => item == row.id);
        if (findRow) {
          refsElTable.toggleRowSelection(row, false);
          return;
        }
        refsElTable.toggleRowSelection(row, true);
      },
      handleNewwork(idx) {
            if (idx == 3) {
                this.taskCongifModel = true;
            }
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
