<!-- 自然投放 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <div class="headerBox">
      <div class="queryBox">
        <!-- 筛选条件 -->
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-input v-model="queryData.task_name" clearable placeholder="请输入任务名称" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
            <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">{{ $t('sys_c049') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!--  新建工具栏 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun('add')">新建任务</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
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
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <!--        :summary-method="getTableSumFun"-->
        <!--        show-summary-->

        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="任务名称" min-width="120" prop="task_name">
          <template slot-scope="scope">
            {{ scope.row.task_name ? scope.row.task_name : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="账号分组" min-width="120" prop="group_name">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="素材分组" min-width="120" prop="material_group_name">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="channel" min-width="120" prop="channel">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="campaignID" min-width="120" prop="campaign_id">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="曝光量" min-width="120" prop="exposure_num" />
        <el-table-column label="状态" min-width="100" prop="status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'status','table')">
              <span :class="[Number(queryData.status) >0?'dropdown_title':'']" style="color:#909399">
                状态  <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in statusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-tag :type="getLabelByVal(scope.row.status, statusList,{label:'type',value:'value'})" size="small">
              {{ getLabelByVal(scope.row.status, statusList) || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="原因" min-width="100" prop="reason">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="所属用户" min-width="120" prop="faccount">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          prop="operation"
          show-overflow-tooltip
          width="220"
        >
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.stop="openDetailListFun(scope.row,'任务详情')">任务详情</el-button>
            <el-button
              size="small"
              style="margin-left: 10px"
              type="primary"
              @click.stop="openDetailListFun(scope.row,'任务状态')"
            >
              任务状态
            </el-button>
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

    <!-- 添加 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.title"
      :visible.sync="addModal.show"
      center
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="addModal.formData.task_name" placeholder="请输入任务名称" @input="changeInput" />
        </el-form-item>
        <el-form-item label="账号分组:" prop="group_id">
          <el-select v-model="addModal.formData.group_id" clearable filterable placeholder="请选择账号分组">
            <el-option v-for="item in accountGroup" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="素材分组:" prop="material_group_id">
          <el-select v-model="addModal.formData.material_group_id" clearable filterable placeholder="请选择素材分组">
            <el-option v-for="item in materialGroupList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="channel:" prop="channel">
          <el-input v-model="addModal.formData.channel" placeholder="请输入channel" @input="changeInput" />
        </el-form-item>
        <el-form-item label="campaignID:" prop="campaign_id">
          <el-input v-model="addModal.formData.campaign_id" placeholder="请输入campaignID" @input="changeInput" />
        </el-form-item>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 详情列表 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="detailModal.title"
      :visible.sync="detailModal.show"
      :width="detailModal.width"
      center
      @close="closeDetailModal"
    >
      <template v-if="detailModal.title ==='任务详情'">
        <!-- 筛选条件 -->
        <el-form :inline="true" size="small" style="margin-top: 10px;">
          <el-form-item>
            <el-input v-model="detailModal.queryData.id" clearable placeholder="请输入ID" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="detailModal.queryData.tk_account" clearable placeholder="请输入TK账号" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="detailModal.queryData.reason" clearable placeholder="请输入原因" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="detailModal.queryData.material_id" clearable placeholder="请输入素材ID" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getDetailListFun(1)">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="restQueryBtn(2)">重置</el-button>
          </el-form-item>
        </el-form>
        <div v-if="false" style="margin-bottom: 10px">
          <el-dropdown trigger="click" @command="(command)=>{handleDetailCommand(command)}">
            <el-button type="primary"> {{ $t('sys_g018') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, idx) in detailModal.batchDetailOption"
                v-show="item.label"
                :key="idx"
                :command="{item,idx}"
              >
                <i :class="'el-icon-' + item.icon" />
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-table
          ref="detailTable"
          v-loading="detailModal.loading"
          :data="detailModal.data"
          :height="500"
          :row-class-name="tableModalRowClassName"
          border
          element-loading-spinner="el-icon-loading"
          row-key="id"
          show-body-overflow="title"
          style="width: 100%;"
          @selection-change="handleModalSelectionChange"
          @sort-change="handleSortChange"
          @row-click="rowModalSelectChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="ID" min-width="120" prop="id" show-overflow-tooltip />
          <el-table-column label="TK账号" min-width="120" prop="tk_account" show-overflow-tooltip />
          <el-table-column label="素材" min-width="100" prop="material_url" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.material_url">
                <i class="el-icon-video-camera-solid file_content" @click.stop="openFileFun(scope.row)" />
              </span>
              <span v-else>-</span>
              <!-- {{ scope.row.material_url ? scope.row.material_url : '-' }} -->
            </template>
          </el-table-column>
          <el-table-column label="视频ID" min-width="150" prop="video_id" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="曝光量"
            min-width="180"
            prop="exposure_num"
            show-overflow-tooltip
            sortable="custom"
          >
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : 0 }} （{{ scope.row.cpm }}u）
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'status','modal')">
                <span :class="[Number(detailModal.queryData.status) >0?'dropdown_title':'']" style="color:#909399">
                  状态  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in detailModal.statusList"
                    :key="index"
                    :class="{'dropdown_selected':item.value===detailModal.queryData.status}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              {{ getLabelByVal(scope.row.status, detailModal.statusList) || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="原因" min-width="150" prop="reason" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.itime) }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" min-width="100" prop="ptime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.ptime) }}
            </template>
          </el-table-column>

        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="detailModal.queryData.page"
            :page-size="detailModal.queryData.limit"
            :page-sizes="pageOption"
            :total="detailModal.queryData.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize($event,'modal')"
            @current-change="changePageCurrent($event,'modal')"
          />
        </div>
      </template>
      <template v-if="detailModal.title ==='任务状态'">
        <div class="refresh">
          <el-button
            :loading="detailModal.statusLoading"
            size="small"
            type="primary"
            @click="getDetailObjFun(detailModal.cloneRow)"
          >刷新
          </el-button>
        </div>

        <el-form ref="refStateModal" class="stateModal" label-width="120px" size="small">
          <el-form-item label="待上传视频：" prop="wait_upload_video_count">
            {{ detailModal.stateData.wait_upload_video_count }}
          </el-form-item>
          <el-form-item label="视频上传中：" prop="uploading_video_count">
            {{ detailModal.stateData.uploading_video_count }}
          </el-form-item>
          <el-form-item label="待检查视频：" prop="wait_check_video_count">
            {{ detailModal.stateData.wait_check_video_count }}
          </el-form-item>
          <el-form-item label="视频检查中：" prop="checking_video_count">
            {{ detailModal.stateData.checking_video_count }}
          </el-form-item>
          <el-form-item label="待绑定链接：" prop="wait_bind_link_count">
            {{ detailModal.stateData.wait_bind_link_count }}
          </el-form-item>
          <el-form-item label="绑定链接中：" prop="bind_link_count">
            {{ detailModal.stateData.bind_link_count }}
          </el-form-item>
          <el-form-item label="投放中：" prop="delivering_count">
            {{ detailModal.stateData.delivering_count }}
          </el-form-item>
          <el-form-item label="任务关闭：" prop="task_closed_count">
            {{ detailModal.stateData.task_closed_count }}
          </el-form-item>
        </el-form>

        <div style="text-align:center;">
          <el-button type="primary" @click="closeDetailModal">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 视频弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="videoModal.title"
      :visible.sync="videoModal.show"
      center
      style="border-radius: 20px"
      width="25%"
      @close="closeVideoModal"
    >
      <div class="video_content">
        <VideoPlayer
          ref="refVideoPlayer"
          :autoplay="false"
          :src="videoModal.url"
        />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getDetailListApi,
  getDataApi,
  addEditDataApi,
  getAccountGroupApi,
  getTaskListApi,
} from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp, getFileExtension, formatDecimal } from '@/filters'
import { getMaterialListApi } from '@/views/content/materialApi';
import VideoPlayer from '@/components/VideoPlayer'
import { getTaskConfigListApi } from '@/views/permission/taskConfig/api';
import { getUserInfo } from '@/utils/auth';

export default {
  name: 'GroupServer',
  components: {
    VideoPlayer,
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        task_name: '',
        status: '0',
        switch: '',
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      showSumNum: [6, 7, 8, 12, 13],
      cliHeight: null,
      addModal: {
        show: false,
        title: '',
        type: 'add',
        formData: {
          material_group_id: '',
          material_group_name: '',
          link: '',
          group_id: '',
          channel: '',
          campaign_id: '',
        },
        cloneRow: {},
        rules: {
          task_name: [{ required: true, message: '请输入任务名称！', trigger: 'change' }],
          material_group_id: [{ required: true, message: '请选择素材分组！', trigger: 'change' }],
          group_id: [{ required: true, message: '请选择账号分组！', trigger: 'change' }],
          link: [{ required: true, message: '请输入投放链接！', trigger: 'change' }],
          channel: [{ required: true, message: '请输入channel！', trigger: 'change' }],
          campaign_id: [{ required: true, message: '请输入campaign_id！', trigger: 'change' }],

        }
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      total: 0,
      isLoading: false,
      statusList: [
        { label: '全部', value: '0', type: '', },
        { label: '初始化', value: '1', type: '', },
        { label: '执行中', value: '2', type: '', },
        { label: '投放中', value: '3', type: '', },
        { label: '已结束', value: '4', type: 'success', },
      ],
      materialGroupList: [],
      detailModal: {
        show: false,
        loading: false,
        title: '',
        width: '',
        cloneRow: {},
        queryData: {
          page: 1,
          limit: 10,
          total: 0,
          tk_account: '',
          status: '0',
          id: '',
          sort: '',
        },
        data: [],
        statusList: [
          { label: '全部', value: '0', },
          { label: '待上传视频', value: '3', },
          { label: '视频上传中', value: '4', },
          { label: '待检查视频', value: '5', },
          { label: '视频检查中', value: '6', },
          { label: '待绑定链接', value: '7', },
          { label: '绑定链接中', value: '8', },
          { label: '投放中', value: '9', },
          { label: '任务关闭', value: '10', },
        ],
        selectData: [],
        selectIdData: [],
        stateData: {},
        batchDetailOption: [
        ],
        launchStatusList: [
          { label: '全部', value: '0', },
          { label: '正常', value: '1', },
          { label: '异常', value: '2', },
          // { label: '待关闭', value: '3', },
          // { label: '已关闭', value: '4', },
        ],
        isCloseList: [
          { label: '全部', value: '0', },
          { label: '否', value: '1', },
          { label: '是', value: '2', },
        ],
        statusLoading: false
      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
      },
      batchOption: [
        { icon: 'delete', label: '批量删除' },
      ],
      videoModal: {
        title: '',
        show: false,
        url: ''
      },
      taskConfigList: [],
      userInfo: getUserInfo(),
      accountGroup: []
    }
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
    this.getDataListFun(1); // 获取列表
    this.getGroupListFun(); // 分组列表
    this.getTaskConfigFun(); // 任务配置
    this.getAccountGroupListFun() // 获取账号分组
  },
  updated() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.$refs.serveTable.doLayout();
      });
    }, 150)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表
    getDataListFun(num) {
      this.loading = true;
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        task_name: this.queryData.task_name,
        status: Number(this.queryData.status) || -1,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.status = item.status ? String(item.status) : ''
            item.gender = item.gender ? String(item.gender) : ''
            return item
          });
          this.selectData = []
          this.selectIdData = []
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      })
    },
    // 新建
    addOpenFun(type) {
      this.addModal.title = '新建任务'
      this.addModal.type = type
      this.addModal.show = true
    },
    // 详情
    openDetailListFun(row, title) {
      this.detailModal.show = true
      this.detailModal.title = title
      this.detailModal.cloneRow = deepClone(row)
      if (title === '任务详情') {
        this.detailModal.width = '85%'
        this.getDetailListFun(1)
      }
      if (title === '任务状态') {
        this.detailModal.width = '50%'
        this.getDetailObjFun(row)
      }
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      setTimeout(() => {
        this.addModal.formData = {
          material_group_id: '',
          material_group_name: '',
          link: '',
          task_config_i: ''
          // age: [],
          // gender: '1',
        }
        this.$refs.refAddModal.resetFields();
      }, 500);
    },
    // 新建保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = deepClone(this.addModal.formData)
          if (this.addModal.type === 'add') {
            formData.ptype = 1
          } else {
            formData.ptype = 2
          }
          addEditDataApi(formData).then(res => {
            if (res.msg === 'success') {
              successTips(this)
              this.closeModal()
              this.getDataListFun()
            }
          })
        }
      })
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
            addEditDataApi(formData).then(res => {
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
    // 任务详情列表
    getDetailListFun(num) {
      this.detailModal.loading = true
      const params = {
        task_id: this.detailModal.cloneRow.id,
        page: num || this.detailModal.queryData.page,
        limit: this.detailModal.queryData.limit,
        id: this.detailModal.queryData.id,
        status: Number(this.detailModal.queryData.status) || -1,
        tk_account: this.detailModal.queryData.tk_account,
        reason: this.detailModal.queryData.reason,
        sort: this.detailModal.queryData.sort,
        material_id: this.detailModal.queryData.material_id,
      }
      getDetailListApi(params).then(res => {
        if (res.msg === 'success') {
          this.detailModal.loading = false
          this.detailModal.data = res.data.list.map((item, index) => {
            item.status = item.status ? String(item.status) : ''
            return item
          })
          this.detailModal.queryData.total = res.data.total
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.detailTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      });
    },
    // 关闭任务详情列表
    closeDetailModal() {
      this.detailModal.show = false
      this.detailModal.queryData.id = ''
      this.detailModal.queryData.tk_account = ''
      this.detailModal.queryData.reason = ''
      this.detailModal.queryData.status = '0'
      this.detailModal.queryData.page = 1
      this.detailModal.title = ''
      if (this.$refs.detailTable) {
        this.$refs.detailTable.clearSort()
      }
    },
    // 任务状态
    getDetailObjFun(row) {
      this.detailModal.statusLoading = true
      const params = {
        task_id: row.id
      }
      getTaskListApi(params).then(res => {
        if (res.msg === 'success') {
          this.detailModal.stateData = res.data
          this.detailModal.statusLoading = false
        }
      })
    },

    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.item.label === '批量删除') {
        this.delDataFun()
      }
    },
    // 任务详情 批量关闭
    handleDetailCommand(command) {
      if (!this.detailModal.selectData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      // if (command.item.label === '') {}
    },
    // 预览视频
    openFileFun(row) {
      const suffixArr = ['mp4']
      const suffix = getFileExtension(row.material_url)
      if (suffixArr.includes(suffix)) {
        this.videoModal.show = true
        this.videoModal.title = row.material_name
        this.videoModal.url = row.material_url
      } else {
        successTips(this, 'error', '仅支持查看 .mp4 格式的视频')
      }
    },
    // 关闭视频弹窗
    closeVideoModal() {
      this.videoModal.show = false
      this.videoModal.title = ''
      this.videoModal.url = ''
      this.$refs.refVideoPlayer.closePausePlay()
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 单行 点击勾选
    rowSelectChange(row, column, event) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 合计
    getTableSumFun(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (index === 0) {
          sums[index] = '总价';
          return;
        } else if (this.showSumNum.includes(index)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev + curr);
            } else {
              return prev;
            }
          }, 0);
          sums[index] = formatDecimal(sums[index])
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    // 行内筛选项
    handleRowQuery(val, key, type) {
      if (type === 'table') {
        this.queryData[key] = val
        this.getDataListFun()
      } else if (type === 'modal') {
        this.detailModal.queryData[key] = val
        this.getDetailListFun();
      }
    },
    // 重置
    restQueryBtn(type) {
      switch (type) {
        case 1:
          this.queryData.task_name = ''
          this.queryData.status = -1
          this.getDataListFun(1)
          break;
        case 2:
          this.detailModal.queryData.id = ''
          this.detailModal.queryData.tk_account = ''
          this.detailModal.queryData.reason = ''
          this.detailModal.queryData.sort = ''
          this.detailModal.queryData.material_id = ''
          this.detailModal.queryData.status = ''
          this.getDetailListFun(1)
          this.$refs.detailTable.clearSort()
          break;
      }
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.limit = val;
        this.getDetailListFun();
      }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.page = val;
        this.getDetailListFun();
      }
    },
    // 筛选项
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') { // 下降 倒序
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.detailModal.queryData.sort = '-' + prop
            break;
          case 'exposure_num': // 曝光量
            this.detailModal.queryData.sort = '-' + prop
            break;
          case 'click_num': // 点击量
            this.detailModal.queryData.sort = '-' + prop
            break;
          case 'watch_rate': // 完播率
            this.detailModal.queryData.sort = '-' + prop
            break;
        }
      } else if (order === 'ascending') { // 上升 = 正序
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.detailModal.queryData.sort = prop
            break;
          case 'exposure_num': // 曝光量
            this.detailModal.queryData.sort = prop
            break;
          case 'click_num': // 点击量
            this.detailModal.queryData.sort = prop
            break;
          case 'watch_rate': // 完播率
            this.detailModal.queryData.sort = prop
            break;
        }
      } else {
        this.detailModal.queryData.sort = ''
      }
      this.getDetailListFun()
    },
    // 详情列 选择
    handleModalSelectionChange(arr) {
      this.detailModal.selectData = arr
      this.detailModal.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 详情行 异常
    tableModalRowClassName({ row, rowIndex }) {
      if (row.launch_status === '2') {
        return 'danger-row';
      }
      return '';
    },
    // 详情 单行 点击勾选
    rowModalSelectChange(row, column, event) {
      const tableCell = this.$refs.detailTable;
      if (this.detailModal.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 获取分组列表
    getGroupListFun() {
      const params = {
        page: 1,
        limit: 10000,
      }
      getMaterialListApi(params).then(res => {
        if (res.msg === 'success') {
          this.materialGroupList = []
          res.data.list.forEach(item => {
            const val = {
              id: item.id,
              name: item.name + '(' + item.count + ')'
            }
            if (item.count) {
              this.materialGroupList.push(val)
            }
          });
        }
      })
    },
    // 获取任务配置列表
    getTaskConfigFun() {
      const params = {
        page: 1,
        limit: 10000,
      }
      getTaskConfigListApi(params).then(res => {
        if (res.msg === 'success') {
          this.taskConfigList = res.data.list.map(item => {
            return {
              id: item.id,
              name: item.plan_name
            }
          });
        }
      })
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    // 获取账号分组
    getAccountGroupListFun() {
      getAccountGroupApi({}).then(res => {
        if (res.msg === 'success') {
          this.accountGroup = []
          console.log('res.data',res)
          if (res.data.list && res.data.list.length) {
            res.data.list.forEach(item => {
              this.accountGroup.push({ name: item.name + `(${item.count})`,value: item.id })
            })
          }
        }
      })
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

.file_content {
  cursor: pointer;
  color: #0a76a4;
  text-decoration: underline;
  font-size: 25px;
}

.headerBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 18px;

  height: 35px;

  .queryBox {
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }

  .tools {

  }
}

.stateModal {
  display: flex;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;

  .el-form-item {
    width: calc(100% / 3);
    margin: 10px 0;
  }

}

::v-deep .el-table .danger-row {
  background: rgba(245, 108, 108, 0.5);
}
.is_close_red{
  color: rgba(255, 0, 0, 0.5);
}
</style>
