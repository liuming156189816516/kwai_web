<!-- 信用卡列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.user_id" clearable placeholder="请输入信用卡账号" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.number" clearable placeholder="请输入卡号" @input="changeInput" />
      </el-form-item>
      <!--
      <el-form-item>
        <el-select v-model="queryData.use_status" clearable filterable placeholder="请输入使用状态" style="width:100%;">
          <el-option v-for="item in queryData.statusList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      -->
      <el-form-item>
        <el-input v-model="queryData.tk_account" clearable placeholder="请输入TK账号" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="tableContent">

      <el-table
        ref="serveTable"
        v-loading="loading"
        :data="tableData"
        :height="cliHeight"
        border
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="卡序列号" min-width="140" show-overflow-tooltip prop="card_id" />
        <el-table-column label="卡段" min-width="150" prop="card_range">
          <template slot-scope="scope">
            {{ scope.row.card_range ? scope.row.card_range : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="卡号" min-width="120" show-overflow-tooltip prop="number">
          <template slot-scope="scope">
            {{ scope.row.number ? scope.row.number : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="持卡人" min-width="120" show-overflow-tooltip prop="holder_name">
          <template slot-scope="scope">
            {{ scope.row.holder_name ? scope.row.holder_name : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="卡片余额($)" min-width="120" prop="balance">
          <template slot-scope="scope">
            <div>{{ scope.row.balance }}</div>
            <el-button icon="el-icon-refresh" size="mini" type="primary" @click.stop="synchronousBalance(scope)">同步
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="累计消费" min-width="120" prop="consume" />
        <el-table-column label="卡片状态" min-width="100" prop="status">
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row.status, statusList) }}
          </template>
        </el-table-column>
        <el-table-column label="信用卡账号" min-width="100" prop="user_id" show-overflow-tooltip />
        <el-table-column label="使用状态" min-width="100" prop="use_status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'use_status')">
              <span :class="[Number(queryData.use_status) >-1?'dropdown_title':'']" style="color:#909399">
                使用状态 <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in queryData.statusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.use_status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-tag :type="getLabelByVal(scope.row.use_status, queryData.statusList,{label:'type',value:'value'})" size="small">
              {{ getLabelByVal(scope.row.use_status, queryData.statusList) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="TK账号" min-width="100" prop="tk_account" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.tk_account ? scope.row.tk_account : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="原因" min-width="100" prop="reason" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.reason ? scope.row.reason : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="开卡时间" min-width="100" prop="open_date" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.open_date,true) }}
          </template>
        </el-table-column>
        <el-table-column label="冻结时间" min-width="100" prop="freeze_time" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.freeze_time,true) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="240">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.stop="operateSumFun(scope.row,'充值')">充值</el-button>
            <el-button size="small" type="primary" @click.stop="operateSumFun(scope.row,'提取')">提取</el-button>
            <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="layui_page">
        <el-pagination
          :current-page.sync="queryData.page"
          :page-size="queryData.limit"
          :page-sizes="pageOption"
          :total="queryData.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize($event,'table')"
          @current-change="changePageCurrent($event,'table')"
        />
      </div>
    </div>
    <!-- 添加 编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.title"
      :visible.sync="addModal.show"
      center
      class="addModalName"
      width="800px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="卡序列号:" prop="card_id">
          <span>{{ addModal.formData.card_id }}</span>
        </el-form-item>
        <el-form-item label="卡号:" prop="number">
          <span>{{ addModal.formData.number }}</span>
        </el-form-item>
        <el-form-item label="卡号后四位:" prop="last_four">
          <span>{{ addModal.formData.last_four }}</span>
        </el-form-item>
        <el-form-item label="首名称:" prop="first_name">
          <span>{{ addModal.formData.first_name }}</span>
        </el-form-item>
        <el-form-item label="最后名称:" prop="last_name">
          <span>{{ addModal.formData.last_name }}</span>
        </el-form-item>
        <el-form-item label="持卡人:" prop="holder_name">
          <span>{{ addModal.formData.holder_name }}</span>
        </el-form-item>
        <el-form-item label="卡序列号:" prop="card_seq_no">
          <span>{{ addModal.formData.card_seq_no }}</span>
        </el-form-item>
        <el-form-item label="卡段:" prop="card_range">
          <span>{{ addModal.formData.card_range }}</span>
        </el-form-item>
        <el-form-item label="CVV码:" prop="cvc">
          <span>{{ addModal.formData.cvc }}</span>
        </el-form-item>
        <el-form-item label="过期年:" prop="exp_year">
          <span>{{ addModal.formData.exp_year }}</span>
        </el-form-item>
        <el-form-item label="过期月:" prop="exp_month">
          <span>{{ addModal.formData.exp_month }}</span>
        </el-form-item>
        <el-form-item label="邮编:" prop="zip_code">
          <span>{{ addModal.formData.zip_code }}</span>
        </el-form-item>
        <el-form-item label="城市:" prop="city">
          <span>{{ addModal.formData.city }}</span>
        </el-form-item>
        <el-form-item label="街道地址:" prop="street">
          <span>{{ addModal.formData.street }}</span>
        </el-form-item>
        <el-form-item label="州:" prop="state">
          <span>{{ addModal.formData.state }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 充值 提取 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="operateSumModal.title"
      :visible.sync="operateSumModal.show"
      center
      width="400px"
      @close="closeSumModal"
    >
      <el-form
        ref="refOperateSumModal"
        :model="operateSumModal.formData"
        :rules="operateSumModal.rules"
        label-width="80px"
        size="small"
      >
        <el-form-item label="金额:" prop="amount">
          <el-input
            v-model="operateSumModal.formData.amount"
            placeholder="请输入金额"
            style="width: 80%;display: inline-block;margin-right: 5px"
            @input="changeInput"
          />
          <span style="font-size: 16px"> $ </span>
        </el-form-item>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeSumModal">取消</el-button>
          <el-button :loading="operateSumModal.isLoading" type="primary" @click="submitOperateSum">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { detailDataApi, getCardBalanceApi, getDataApi, rechargeCardApi, reduceCardApi, } from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'GroupServer',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        user_id: '',
        number: '',
        use_status: '-1',
        tk_account: '',
        statusList: [
          {
            label: '全部',
            value: '-1',
            type: '',
          },
          {
            label: '未使用',
            value: '0',
            type: '',
          },
          {
            label: '使用中',
            value: '1',
            type: 'success',
          },
          {
            label: '不可用',
            value: '2',
            type: 'danger',
          },
        ]
      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        formData: {},
        rules: {}
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          card_id: '',
          number: '',
          last_four: '',
          first_name: '',
          last_name: '',
          holder_name: '',
          card_seq_no: '',
          card_range: '',
          api_key: '',
          cvc: '',
          exp_year: '',
          exp_month: '',
          zip_code: '',
          city: '',
          street: '',
          state: '',
        },
        rules: {}
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      batchOption: [
        {
          icon: 'delete',
          label: '批量删除'
        },
      ],
      loading: false,
      isLoading: false,
      statusList: [
        {
          label: '全部',
          value: '-1',
          type: '',
        },
        {
          label: '已激活',
          value: '1',
        },
        {
          label: '已删卡',
          value: '3',
        },
        {
          label: '已冻结',
          value: '5',
        },
        {
          label: '系统删卡',
          value: '6',
        },
        {
          label: '风控删卡',
          value: '7',
        },
      ],
      operateSumModal: {
        show: false,
        isLoading: false,
        title: '充值',
        cloneRow: {},
        formData: {
          amount: '',
        },
        rules: {
          amount: [{ required: true, message: '请输入金额！', trigger: 'change' }],
        }
      },
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表
    getDataListFun(num) {
      this.loading = true;
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        user_id: this.queryData.user_id,
        number: this.queryData.number,
        tk_account: this.queryData.tk_account,
        use_status: Number(this.queryData.use_status) || 0,

      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.use_status = item.use_status ? String(item.use_status) : '0'
            return item
          });
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      })
    },
    // 新建
    addOpenFun() {
      this.addModal.title = '详情'
      this.addModal.show = true
    },
    // 详情
    editOpenFun(row) {
      this.addModal.show = true
      this.addModal.title = '详情'
      const params = {
        user_id: row.user_id,
        card_id: row.card_id,
      }
      detailDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.addModal.formData = deepClone(res.data)
        }
      })
    },
    // 同步
    synchronousBalance({ $index, row }) {
      const params = {
        user_id: row.user_id,
        card_id: row.card_id,
      }
      getCardBalanceApi(params).then(res => {
        if (res.msg === 'success') {
          this.tableData[$index].balance = res.data.balance
        }
      })
    },
    // 打开充值 / 提取
    operateSumFun(row, title) {
      this.operateSumModal.show = true
      this.operateSumModal.cloneRow = deepClone(row)
      this.operateSumModal.title = title
      if (title === '提取') {
        this.operateSumModal.formData.amount = row.balance
      }
    },
    // 提交 金额
    submitOperateSum() {
      this.$refs.refOperateSumModal.validate((v) => {
        if (v) {
          const formData = {
            user_id: this.operateSumModal.cloneRow.user_id,
            card_id: this.operateSumModal.cloneRow.card_id,
            amount: Number(this.operateSumModal.formData.amount),
          }
          if (this.operateSumModal.title === '提取') {
            reduceCardApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.closeSumModal()
                this.getDataListFun()
              }
            })
          } else {
            rechargeCardApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.closeSumModal()
                this.getDataListFun()
              }
            })
          }
        }
      })
    },
    closeSumModal() {
      this.operateSumModal.formData.amount = ''
      this.operateSumModal.show = false
      this.$refs.refOperateSumModal.resetFields();
    },
    // 行内筛选项
    handleRowQuery(val,key) {
      this.queryData[key] = val
        this.getDataListFun()
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      this.addModal.formData = {
        name: '',
        host: '',
        database_name: '',
        port: '',
        database_user: '',
        database_pwd: '',
        api_key: '',
      }
      this.$refs.refAddModal.resetFields();
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 240;
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 重置
    restQueryBtn() {
      this.queryData.user_id = ''
      this.queryData.number = ''
      this.queryData.tk_account = ''
      this.queryData.use_status = -1
      this.getDataListFun(1)
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp,
    getLabelByVal

  }
}
</script>

<style lang="scss" scoped>
.addModalName {
  ::v-deep .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

  }

  ::v-deep .el-form-item {
    width: 48%;
  }
}

.tableContent{
  width: 100%;
  overflow-x: auto;
}
</style>
