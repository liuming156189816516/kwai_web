<!-- 信用卡账号 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.user_id" clearable placeholder="请输入用户" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">新建账号</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary">批量操作
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in batchOption" v-show="item.label" :key="idx" :command="{item,idx}">
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
        use-virtual
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('sys_g020')" type="index" width="60" />
        <el-table-column label="用户" min-width="100" prop="user_id" show-overflow-tooltip />
        <el-table-column label="密码" min-width="150" prop="pwd">
          <template slot-scope="scope">
            {{ scope.row.pwd ? scope.row.pwd : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="授权" min-width="120" prop="auth" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.auth ? scope.row.auth : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="用户令牌" min-width="100" prop="token" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.token ? scope.row.token : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="卡位数量" min-width="100" prop="new_card_max_count" />
        <el-table-column label="总卡片数量" min-width="100" prop="card_count" />
        <el-table-column label="账户美元余额" min-width="100" prop="usd_balance" />
        <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" prop="operation" show-overflow-tooltip width="500">
          <template slot-scope="scope">
            <el-button class="btr" size="small" type="primary" @click.stop="loginCardFun(scope.row)">登录</el-button>
            <el-button class="btr" size="small" type="primary" @click.stop="syncCardFun(scope.row)">同步卡账户</el-button>
            <el-button class="btr" size="small" type="primary" @click.stop="batchCardFun(scope.row)">批量开卡</el-button>
            <el-button class="btr" size="small" type="primary" @click.stop="syncCardListFun(scope.row)">同步卡列表
            </el-button>
            <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
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
      :title="addModal.type==='add'?'新建账号':'编辑'"
      :visible.sync="addModal.show"
      center
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="用户" prop="user_id">
          <el-input v-model="addModal.formData.user_id" :disabled="addModal.type==='edit'" placeholder="请输入用户" @input="changeInput" />
        </el-form-item>
        <el-form-item label="密码:" prop="pwd">
          <el-input v-model="addModal.formData.pwd" placeholder="请输入密码" @input="changeInput" />
        </el-form-item>
        <el-form-item label="授权:" prop="auth">
          <el-input v-model="addModal.formData.auth" placeholder="请输入授权" @input="changeInput" />
        </el-form-item>
        <!--        <el-form-item v-if="addModal.type==='add'" label="所属用户:" prop="fuid">-->
        <!--          <el-select v-model="addModal.formData.fuid" clearable filterable placeholder="请选择所属用户">-->
        <!--            <el-option v-for="item in userData" :key="item.uid" :label="item.account" :value="item.uid" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 批量开卡/批量操作 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="batchCardModal.batchData.label"
      :visible.sync="batchCardModal.show"
      center
      width="500px"
      @close="closeBatchCardModal"
    >
      <el-form
        ref="refBatchCardModal"
        :model="batchCardModal.formData"
        :rules="batchCardModal.rules"
        label-width="150px"
        size="small"
      >
        <!--
        <el-form-item v-if="batchCardModal.batchData.type==='multiple'" label="所属用户:" prop="fuid">
          <el-select v-model="batchCardModal.formData.fuid" clearable filterable placeholder="请选择所属用户">
            <el-option v-for="item in userData" :key="item.uid" :label="item.account" :value="item.uid" />
          </el-select>
        </el-form-item>
        -->
        <el-form-item
          v-if="(batchCardModal.batchData.type==='multiple'&&batchCardModal.batchData.label==='批量开卡')||(batchCardModal.batchData.type==='odd')"
          label="开卡数量:"
          prop="open_count"
        >
          <el-input v-model="batchCardModal.formData.open_count" placeholder="请输入开卡数量" @input="changeInput" />
        </el-form-item>
        <el-form-item
          v-if="(batchCardModal.batchData.type==='multiple'&&batchCardModal.batchData.label==='批量开卡')||(batchCardModal.batchData.type==='odd')"
          label="单卡充值金额(美元):"
          prop="recharge_amount"
        >
          <el-input v-model="batchCardModal.formData.recharge_amount" placeholder="请输入单卡充值金额(美元)" @input="changeInput" />
        </el-form-item>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeBatchCardModal">取消</el-button>
          <el-button :loading="batchCardModal.isLoading" type="primary" @click="submitBatchCard">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  batchCardApi,
  batchCardDataApi,
  editDataApi,
  getDataApi,
  loginCardApi,
  syncCardApi,
  syncCardDataApi,
  syncCardListApi,
  syncCardListDataApi
} from './api';
import { deepClone, resetPage, successTips } from '@/utils';
import { formatTimestamp } from '@/filters'
import { adminuser } from '@/api/permission';

export default {
  name: 'GroupServer',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        user_id: '',
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          user_id: '',
          pwd: '',
          auth: '',
        },
        rules: {
          user_id: [{ required: true, message: '请输入用户！', trigger: 'change' }],
          pwd: [{ required: true, message: '请输入密码！', trigger: 'change' }],
          auth: [{ required: true, message: '请输入授权！', trigger: 'change' }],
          fuid: [{ required: true, message: '请选择所属用户！', trigger: 'change' }],
        }
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      userData: [], // 所属用户
      batchOption: [
        {
          icon: 'edit',
          type: 'multiple',
          label: '批量开卡'
        },
        {
          icon: 'refresh',
          type: 'multiple',
          label: '同步卡账号'
        },
        {
          icon: 'refresh',
          type: 'multiple',
          label: '同步卡列表'
        },
      ],
      loading: false,
      isLoading: false,
      batchCardModal: {
        show: false,
        title: '',
        cloneRow: {},
        batchData: {},
        formData: {
          // fuid: '',
          open_count: '',
          recharge_amount: '',
        },
        rules: {
          // fuid: [{ required: true, message: '请选择所属用户！', trigger: 'change' }],
          open_count: [{ required: true, message: '请输入开卡数量！', trigger: 'change' }],
          recharge_amount: [{ required: true, message: '请输入单卡充值金额(美元)！', trigger: 'change' }],
        }
      }
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.getAdminUserFun() // 所属用户
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
        user_id: this.queryData.user_id, // //服务器ip - 筛选项
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list || [];
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      })
    },
    // 新建
    addOpenFun() {
      this.addModal.type = 'add'
      this.addModal.show = true
    },
    editOpenFun(row) {
      console.log('row', row)
      this.addModal.show = true
      this.addModal.type = 'edit'
      this.addModal.formData = deepClone(row)
    },
    // 登录
    loginCardFun(row) {
      this.$confirm(`确认登录吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const params = {
              user_id: row.user_id,
              pwd: row.pwd,
              auth: row.auth,
            }
            loginCardApi(params).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 同步卡账户
    syncCardFun(row) {
      this.$confirm(`确认同步卡账户吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const params = {
              user_id: row.user_id,
            }
            syncCardApi(params).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 同步卡列表
    syncCardListFun(row) {
      this.$confirm(`确认同步卡列表吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const params = {
              user_id: row.user_id,
            }
            syncCardListApi(params).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 批量开卡
    batchCardFun(row) {
      this.batchCardModal.show = true
      this.batchCardModal.cloneRow = deepClone(row)
      this.batchCardModal.batchData = {
        type: 'odd',
        icon: 'edit',
        label: '批量开卡'
      }
    },
    // 提交批量开卡
    submitBatchCard() {
      this.$refs.refBatchCardModal.validate((v) => {
        if (v) {
          const label = this.batchCardModal.batchData.label
          const type = this.batchCardModal.batchData.type
          let params = {}
          const callback = () => {
            successTips(this)
            this.getDataListFun()
            this.closeBatchCardModal()
          }
          if (type === 'odd' && label === '批量开卡') {
            params = {
              user_id: this.batchCardModal.cloneRow.user_id,
              open_count: Number(this.batchCardModal.formData.open_count),
              recharge_amount: Number(this.batchCardModal.formData.recharge_amount),
            }
            batchCardApi(params).then(res => {
              if (res.msg === 'success') {
                callback()
              }
            })
          } else if (type === 'multiple') {
            switch (label) {
              case '批量开卡':
                params = {
                  // fuid: this.batchCardModal.formData.fuid,
                  open_count: Number(this.batchCardModal.formData.open_count),
                  recharge_amount: Number(this.batchCardModal.formData.recharge_amount),
                }
                batchCardDataApi(params).then(res => {
                  if (res.msg === 'success') {
                    callback()
                  }
                })
                break;
              case '同步卡账号':
                break;
              case '同步卡列表':
                break;
            }
          }
        }
      })
    },
    // 关闭批量开卡
    closeBatchCardModal() {
      this.batchCardModal.show = false
      // this.batchCardModal.formData.fuid = ''
      this.batchCardModal.formData.recharge_amount = ''
      this.batchCardModal.formData.recharge_amount = ''
      this.$refs.refBatchCardModal.resetFields();
    },
    // 新建保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = this.addModal.formData
          if (this.addModal.type === 'add') {
            formData.ptype = 1
          } else {
            formData.ptype = 2
          }
          editDataApi(formData).then(res => {
            if (res.msg === 'success') {
              this.closeModal()
              this.getDataListFun()
            }
          })
        }
      })
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
    // 删除
    delDataFun() {
      this.$confirm(`确认删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ptype: 3,
              del_id: this.selectIdData,// 要删除与的id集合
            }
            editDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 批量操作
    handleCommand(command) {
      console.log('command',command)
      this.batchCardModal.batchData = deepClone(command.item)
      if (command.item.label === '批量开卡') {
        this.batchCardModal.show = true // 打开弹窗
      }
      if (command.item.label === '同步卡账号') {
        this.$confirm(`确认同步卡账户吗？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              syncCardDataApi({}).then(res => {
                if (res.msg === 'success') {
                  successTips(this)
                  this.getDataListFun()
                  done();
                  instance.confirmButtonLoading = false;
                }
              })
            } else {
              done();
              instance.confirmButtonLoading = false;
            }
          }
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消' });
        })
      }
      if (command.item.label === '同步卡列表') {
        this.$confirm(`确认同步卡列表吗？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              syncCardListDataApi({}).then(res => {
                if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                  done();
                instance.confirmButtonLoading = false;
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
      }
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
      this.cliHeight = document.documentElement.clientHeight - 300;
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
      this.selectIdData = [];
      this.queryData.user_id = ''
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
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
    // 获取用户
    getAdminUserFun() {
      const params = {
        account_type: 2,
        page: 1,
        limit: 10000,
        status: -1,
      }
      adminuser(params).then(res => {
        if (res.msg === 'success') {
          this.userData = res.data.list
        }
      })
    },
    formatTimestamp

  }
}
</script>

<style lang="scss" scoped>
.btr {
  margin-right: 8px
}

</style>
