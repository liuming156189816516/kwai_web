<template>
  <div class="">
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <!-- <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_g123') }}</el-button> -->
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
      <!-- <el-form-item>
          <el-input clearable v-model="task_name" :placeholder="$t('sys_l006')"></el-input>
        </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDetailList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQuery">{{ $t('sys_c049') }}</el-button>
      </el-form-item>

      <el-form-item class="el-item-right">
        <el-button type="danger" @click="exportText">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table @sort-change="sorthandle" :data="detailDataList" border height="660" v-loading="loading"
      element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;"
      :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
      <el-table-column type="index" :label="$t('sys_g020')" width="60" />
      <el-table-column prop="account" :label="$t('sys_l080')" minWidth="140" />
      <el-table-column prop="status" :label="$t('sys_l077')" minWidth="100" />
      <el-table-column prop="sucess_num" :label="$t('sys_g091')" minWidth="120">
        <template slot="header">
          <el-dropdown trigger="click" size="medium" @command="(command) => handleNewwork(command, 1)">
            <span style="color:#909399" :class="[account_status ? 'dropdown_title' : '']"> {{ $t('sys_g091') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :class="{ 'dropdown_selected': idx == account_status }" v-for="(item, idx) in taskStatus"
                :key="idx" :command="idx">{{ item == '' ? $t('sys_l053') : item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.account_status == 2 ? 'success' : 'danger'"> {{taskStatus[scope.row.account_status] || "-" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('sys_c005')" minWidth="100">
        <template slot="header">
          <el-dropdown trigger="click" size="medium" @command="(command) => handleNewwork(command, 1)">
            <span style="color:#909399" :class="[account_status ? 'dropdown_title' : '']"> {{ $t('sys_c005') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :class="{ 'dropdown_selected': idx == account_status }" v-for="(item, idx) in taskStatus"
                :key="idx" :command="idx">{{ item == '' ? $t('sys_l053') : item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.account_status == 2 ? 'success' : 'danger'"> {{taskStatus[scope.row.account_status] || "-" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="read_rate" :label="$t('sys_g092')" minWidth="100">
        <template slot-scope="scope">
          {{ scope.row.read_rate * 100 || 0 }}%
        </template>
      </el-table-column>
      <el-table-column prop="reply_rate" :label="$t('sys_l062')" minWidth="100">
        <template slot-scope="scope">
          {{ (scope.row.reply_rate * 100).toFixed(2) || 0 }}%
        </template>
      </el-table-column>
      <el-table-column prop="receive_msg_num" :label="$t('sys_c008')" minWidth="160" />
      <el-table-column prop="receive_msg_num" :label="$t('sys_c070')" minWidth="160" />
      <el-table-column fixed="right" :label="$t('sys_c010')" width="120">
          <template slot-scope="scope">
              <el-button :disabled="checkIdArry.length>0" type="text" size="small" @click.stop="goChatroom(scope.row)">
                  <el-tag size="small" type="success" >{{ $t('sys_mat088') }}</el-tag>
              </el-button>
              <el-button :disabled="checkIdArry.length>0" type="text" size="small" @click.stop>
                  <el-dropdown @command="(command)=>{handleCommand(scope.row,command)}" trigger="click">
                      <span class="el-dropdown-link">
                          <el-tag size="small" type="info" >
                              <i class="el-icon-more"></i>
                          </el-tag>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :disabled="checkIdArry.length>0" v-for="(item,idx) in moreOption" :key="idx" :command="{item,idx}">
                              {{ item }}
                          </el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
              </el-button>
          </template>
      </el-table-column>
    </el-table>
    <div class="layui_page">
      <el-pagination background @size-change="sizeHandle" @current-change="pageHandle" :page-sizes="pageOption"
        :current-page.sync="page" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="任务配置详情" center :visible.sync="taskCongifModel" :close-on-click-modal="false" width="560px">
      <el-form size="small" label-width="100px">
        <el-form-item label="账号来源：" prop="name">
          <span>{{ task_config.data_type == 1 ? 'WS账号列表' : '' }}</span>
        </el-form-item>
        <el-form-item label="群发模式：" prop="name">
          <span>{{ task_config.send_type == 1 ? '默认模式' : '' }}</span>
        </el-form-item>
        <el-form-item label="群发规则：" prop="name">
          <div>每个账号群发{{ task_config.send_num }}条数据</div>
          <!-- <div>每个账号群发15条数据休息20分分钟</div> -->
          <div>群发间隔为{{ task_config.min_time }}~{{ task_config.max_time }}秒</div>
        </el-form-item>
        <el-form-item label="话术设置：" prop="name">
          <span>{{ task_config.speech_skill_type == 1 ? '自主设置' : '' }}</span>
        </el-form-item>
        <el-form-item label="话术数量：" prop="name">
          <span>{{ task_config.material_num }}条</span>
        </el-form-item>
        <el-form-item label="补发话术：" prop="name">
          <span>{{ task_config.replenish == 1 ? '未设置' : '' }}</span>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center;">
          <el-button @click="copayTask" id="taskConfig" :data-clipboard-text="copayConent">复制</el-button>
          <el-button type="primary" @click="taskCongifModel=false">{{ $t('sys_c024') }}</el-button>
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
      account_status: "",
      status: "",
      sort: "",
      link_type: 1,
      link_url: "",
      loading: false,
      isLoading: false,
      taskCongifModel: false,
      detailDataList: [],
      statisticsList: [],
      pageOption: resetPage(),
      task_name: "",
      task_id: "",
      task_config: "",
      copayConent: ""
    }
  },
  computed: {
    taskStatus() {
      return ["", this.$t('sys_g032'), this.$t('sys_g033')]
    },
    seatOption() {
      return ["", this.$t('sys_l080'), this.$t('sys_l077')]
    },
    statusOptions() {
      return ["", this.$t('sys_l071'), this.$t('sys_l072'), this.$t('sys_g068'), this.$t('sys_g067'), this.$t('sys_mat047')]
    },
    cardOption() {
      return [
        {
          label: "账号总数",
          num: 0,
          b_g: "#fef4e9",
          t_c: "#ff8400"
        },
        {
          label: "已完成账号",
          num: 0,
          b_g: "#eef6fe",
          t_c: "#369aff"
        },
        {
          label: "目标粉丝数",
          num: 0,
          b_g: "#dbfff1",
          t_c: "#02c97a"
        },
        {
          label: "成功推送粉丝",
          num: 0,
          b_g: "#f9edff",
          t_c: "#b357ff"
        },
        {
          label: "已读率",
          num: 0,
          b_g: "#ffebeb",
          t_c: "#ff0f0"
        },
        {
          label: "回复率",
          num: 0,
          b_g: "#fffee6",
          t_c: "#f2bb16"
        },
        {
          label: "接受消息总数",
          num: 0,
          b_g: "#dbfeff",
          t_c: "#1dcfdb"
        }
      ]
    }
  },
  created() {
    this.task_id = this.$route.query.task_id;
    const query = this.$route.query.params;
    this.task_config = query.config_str ? JSON.parse(query.config_str) : "";
    this.copayConent = `账号来源： WS账号列表 群发模式： 默认模式 群发规则： 每个账号群发${this.task_config.send_num}条数据 群发间隔为${this.task_config.min_time}~${this.task_config.max_time}秒 话术设置： 自主设置 话术数量： ${this.task_config.material_num}条 补发话术： 未设置`
    this.getStatistics();
    this.getDetailList();
  },
  methods: {
    restQuery() {
      this.account_status = "";
      this.status = "";
      this.sort = "";
      this.task_name = "";
      this.getDetailList(1);
    },
    getStatistics() {
      this.isLoading = true;
      getdatasum({ id: this.task_id }).then(res => {
        let vita = res.data;
        for (let k = 0; k < this.cardOption.length; k++) {
          let item = this.cardOption[k];
          if (k == 0) {
            item.num = vita.account_num || 0;
          } else if (k == 1) {
            item.num = vita.account_sucess_num || 0;
          } else if (k == 2) {
            item.num = vita.target_num || 0;
          } else if (k == 3) {
            item.num = vita.push_num || 0;
          } else if (k == 4) {
            item.num = vita.read_rate || 0;
          } else if (k == 5) {
            item.num = vita.reply_rate || 0;
          } else if (k == 6) {
            item.num = vita.receive_msg_num || 0;
          }
        }
        this.isLoading = false;
      })
    },
    getDetailList(num) {
      this.loading = true;
      this.page = num ? num : this.page;
      let params = {
        page: this.page,
        limit: this.limit,
        account: this.task_name,
        task_id: this.task_id,
        account_status: this.account_status || -1,
        status: this.status || -1,
        sort: this.sort
      }
      getsendmsginfolist(params).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.detailDataList = res.data.list || [];
      })
    },
    handleNewwork(row, idx) {
      if (idx == 1) {
        this.account_status = row;
      } else if (idx == 2) {
        this.status = row;
      }
      this.getDetailList();
    },
    sorthandle(row) {
      this.sort = "";
      if (row.order) {
        if (row.prop == 'sucess_num') {
          this.sort = row.order == 'ascending' ? row.prop : '-' + row.prop;
        }
        if (row.prop == 'read_rate') {
          this.sort = row.order == 'ascending' ? row.prop : '-' + row.prop;
        }
        if (row.prop == 'reply_rate ') {
          this.sort = row.order == 'ascending' ? row.prop : '-' + row.prop;
        }
        if (row.prop == 'receive_msg_num ') {
          this.sort = row.order == 'ascending' ? row.prop : '-' + row.prop;
        }
      }
      this.getDetailList();
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
      this.taskCongifModel = true;
    },
    copayTask() {
      const clipboard = new Clipboard('#taskConfig');
      clipboard.on('success', (e) => {
        successTips(this, "",this.$t('sys_rai121'))
        // e.clearSelection(); // 清除选中文本
      });
    },
    exportText(row) {
      doouttaskrecordexcel({ id: this.task_id }).then(res => {
        if (res.code != 0) return;
        // this.getDetailList();
        window.location.href = res.data.url
      })
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
