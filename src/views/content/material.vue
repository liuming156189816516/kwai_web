<!-- 素材管理 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.file_name" clearable placeholder="请输入视频名称" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.name" clearable placeholder="请输入标题" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.id" clearable placeholder="请输入ID" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.reason" clearable placeholder="请输入原因" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 上传素材 批量操作 上传任务 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">上传素材</el-button>
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
      <el-form-item>
        <el-button type="primary" @click="openTaskListFun">上传任务</el-button>
      </el-form-item>
    </el-form>
    <!-- 分组管理 -->
    <div class="continer_main">
      <div :class="[!showGroup?'group_mian_hide':'']">
        <div class="group_head_warp">
          <div class="group_head" @click="changeGroup(0, 'clear')">
            <i class="el-icon-d-arrow-left" @click="showGroup=false" />
            {{ $t('sys_g049') }} ({{ numGroupTotal }})
          </div>
          <div class="group_icon">
            <!-- 查询分组 -->
            <el-popover v-model="search_icon" placement="top" width="230">
              <p>
                <el-select
                  v-model="groupData.queryData.group_name"
                  :placeholder="$t('sys_c053')"
                  clearable
                  filterable
                  size="small"
                  style="width:100%;"
                >
                  <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="search_icon=false">{{ $t('sys_c023') }}</el-button>
                <el-button size="mini" type="primary" @click="getGroupListFun">{{ $t('sys_c024') }}</el-button>
              </div>
              <i slot="reference" class="el-icon-search" style="margin-right: 10px;" />
            </el-popover>
            <!-- 新建分组 -->
            <el-popover v-model="addVisible" placement="top" width="230">
              <p>
                <el-input
                  v-model="groupData.formData.group_name"
                  :placeholder="$t('sys_c112')"
                  maxlength="10"
                  show-word-limit
                  size="small"
                  @input="changeInput"
                />
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addVisible=false">{{ $t('sys_c023') }}</el-button>
                <el-button
                  :disabled="!groupData.formData.group_name"
                  :loading="ipLoading"
                  size="mini"
                  type="primary"
                  @click="editMaterialListFun"
                >{{ $t('sys_c024') }}
                </el-button>
              </div>
              <i slot="reference" class="el-icon-plus" @click.stop="editGroupOpen(null, 1)" />
            </el-popover>
          </div>
        </div>
        <el-button v-if="loadingGroup" :loading="true" class="loading_icon" type="primary" />
        <template v-else>
          <div :style="{height:(cliHeight-40)+'px'}" class="group_warp">
            <template v-if="numberGroupList.length>0">
              <transition-group name="fade">
                <div
                  v-for="(item, idx) in numberGroupList"
                  :key="idx"
                  :class="['group_item', groupData.queryData.group_id === item.id ? 'group_active' : '']"
                  :draggable="true"
                  @click="changeGroup(item, idx)"
                  @dragstart="dragStart(idx)"
                  @drop="handleMoveSort(idx)"
                  @dragover.prevent
                >
                  <div class="group_name">
                    <i
                      :class="['left_icon', groupData.queryData.group_id === item.id ? 'el-icon-folder-opened' : 'el-icon-folder']"
                      class="left_icon"
                    />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                  <div class="group_icon" style="position: relative">
                    <!--编辑分组-->
                    <el-popover ref="editPopover" :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input
                          v-model="groupData.formData.group_name"
                          :placeholder="$t('sys_c112')"
                          clearable
                          maxlength="10"
                          show-word-limit
                          size="small"
                          @input="changeInput"
                        />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{
                          $t('sys_c023')
                        }}
                        </el-button>
                        <el-button
                          :disabled="!groupData.formData.group_name"
                          :loading="ipLoading"
                          size="mini"
                          type="primary"
                          @click="editMaterialListFun"
                        >{{ $t('sys_c024') }}
                        </el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click.stop="editGroupOpen(item, 2,idx)" />
                    </el-popover>

                    <el-popconfirm
                      :cancel-button-text="$t('sys_c023')"
                      :confirm-button-text="$t('sys_c024')"
                      :title="$t('sys_c128')"
                      icon="el-icon-info"
                      @confirm="editMaterialListFun(item,3)"
                    >
                      <i slot="reference" class="el-icon-delete" @click.stop />
                    </el-popconfirm>
                  </div>
                </div>
              </transition-group>
            </template>
            <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
          </div>
        </template>
      </div>

      <div class="group_continer" style="margin-left: 20px;">
        <div class="tab_check_warp">
          <span v-if="!showGroup" style="margin-right: 8px;cursor: pointer; color:#409eff;" @click="showGroup=true">
            <el-tooltip content="展开分组" effect="dark" placement="top">
              <i class="el-icon-d-arrow-right" />
            </el-tooltip>
          </span>
          <i class="el-icon-info" />
          <div v-html="$t('sys_mat007',{value:selectIdData.length})" />
        </div>
        <el-table
          ref="serveTable"
          v-loading="loading"
          border
          :data="accountDataList"
          :height="cliHeight"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255,1)"
          row-key="id"
          show-body-overflow="title"
          style="width: 100%;"
          use-virtual
          @selection-change="handleSelectionChange"
          @row-click="rowSelectChange"
          @sort-change="handleSortChange"
        >

          <!-- <el-table-column type="index" :label="$t('sys_g020')" width="60" /> -->
          <el-table-column type="selection" width="55" />
          <el-table-column label="ID" min-width="100" prop="id" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="视频名称" min-width="120" prop="file_name">
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="视频" min-width="80" prop="content">
            <template slot-scope="scope">
              <i class="el-icon-video-camera-solid file_content" @click.stop="openFileFun(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="标题" min-width="80" prop="name" />
          <el-table-column label="描述" min-width="180" prop="desc" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="消耗量" min-width="100" prop="consumption_num" sortable="custom" />
          <el-table-column label="曝光量（千次展示）" min-width="180" prop="exposure_num" show-overflow-tooltip sortable="custom">
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : 0 }} （{{ scope.row.cpm }}u）
            </template>
          </el-table-column>
          <el-table-column label="点击量（点击率）" min-width="180" prop="click_num" show-overflow-tooltip sortable="custom">
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : 0 }}（{{ scope.row.ctr }}%）
            </template>
          </el-table-column>
          <el-table-column label="完播率" min-width="130" prop="watch_rate" show-overflow-tooltip sortable="custom">
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : 0 }}%
            </template>
          </el-table-column>
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
              <el-tag
                :type="getLabelByVal(scope.row.use_status, queryData.statusList,{label:'type',value:'value'})"
                size="small"
              >
                {{ getLabelByVal(scope.row.use_status, queryData.statusList) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="原因" min-width="180" prop="reason" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="TK账号" min-width="120" prop="tk_account">
            <template slot-scope="scope">
              <el-button v-if="scope.row[scope.column.property]" type="text" @click.stop="openTkAccountLinkFun(scope.row)">
                {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
              </el-button>
              <div v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属用户" min-width="120" prop="faccount">
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.itime) }}
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
    </div>

    <!-- 批量配置弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="setBatchData.title"
      :visible.sync="setBatchData.show"
      :width="setBatchData.type===7?'1000px':'550px'"
      center
      @close="closeBatchModal"
    >
      <el-form
        v-if="setBatchData.show"
        ref="setBatchForm"
        :model="setBatchData.formData"
        :rules="setBatchData.rules"
        label-width="100px"
        size="small"
      >
        <template v-if="setBatchData.type === 0">
          <el-form-item label="选择分组" label-width="140px" prop="group_id">
            <el-select
              v-model="setBatchData.formData.group_id"
              clearable
              filterable
              placeholder="选择分组"
              size="small"
              style="width:100%;"
            >
              <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="group_tips">一个账号只能存在于一个分组中！</div>
          </el-form-item>
        </template>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;margin-top: 40px;">
          <el-button v-if="setBatchData.type !== 7" @click="closeBatchModal">{{ $t('sys_c023') }}</el-button>
          <el-button
            :loading="isLoading"
            type="primary"
            @click="submitSetBtn('setBatchForm')"
          >{{ $t('sys_c024') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.type==='add'?'上传素材':'编辑'"
      :visible.sync="addModal.show"
      center
      width="600px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="90px" size="small">
        <el-form-item label="标题:" prop="name">
          <el-input v-model="addModal.formData.name" placeholder="请输入标题" @input="changeInput" />
        </el-form-item>
        <el-form-item label="视频:" prop="content">
          <!--
          <div v-if="addModal.fileData.file_name" class="file-content">
            <span class="fileName">{{ addModal.fileData.file_name }}</span>
            <span class="closeFile" @click.stop="closeFileFun">
              <i class="el-icon-delete" />
            </span>
          </div>
          <el-button v-else :loading="addModal.contentLoading" class="custom_file" style="margin-top: 0;">上传文件
            <input id="uploadFile" ref="refUploadFile" title=" " type="file" @change="uploadFileFun('content')">
          </el-button>
   -->
          <UploadFiles ref="refUploadFiles" @uploadSuccess="uploadSuccess" />

          <span class="fileTips">仅可上传mp4和zip格式文件</span>
        </el-form-item>
        <el-form-item label="描述:" prop="desc">
          <el-input v-model="addModal.formData.desc" placeholder="请输入描述" @input="changeInput" />
        </el-form-item>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 视频弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="videoModal.title"
      :visible.sync="videoModal.show"
      center
      style="border-radius: 20px"
      width="30%"
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

    <!-- 上传任务 -->
    <taskModal ref="refTaskModal" />

  </div>
</template>

<script>
import { successTips, resetPage, getLabelByVal } from '@/utils'
import {
  getDataApi,
  editDataApi,
  moveDataApi,
  getMaterialListApi,
  editMaterialListApi,
  editSortGroup,
  exportDataApi
} from './materialApi'
import { uploadFileApi } from '@/api/common.js'
import { getFileExtension } from '@/filters';
import { formatTimestamp } from '@/filters'

import VideoPlayer from '@/components/VideoPlayer'
import taskModal from './components/taskModal';
import UploadFiles from '@/components/UploadFiles/index'

export default {
  components: {
    VideoPlayer,
    taskModal,
    UploadFiles
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
        id: '',
        ip_category: '',
        use_status: '-1',
        reason: '',
        file_name: '',
        sort: '',
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
      formData: {},
      screenSelect: [],
      accountDataList: [],
      addModal: {
        show: false,
        type: 'add',
        contentLoading: false,
        formData: {
          name: '',
          content: '',
        },
        fileData: {},
        rules: {
          name: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          desc: [{ required: true, message: '请输入描述！', trigger: 'change' }],
        }
      },
      groupData: {
        queryData: {
          group_id: '',
          group_name: '',
        },
        type: 0,
        formData: {
          group_name: '',
          itemId: ''
        }
      }, // 分组数据
      numberGroupList: [], // 分组列表
      draggedItemIndex: 0, // 拖拽
      numGroupTotal: 0,
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      batchOption: [
        {
          icon: 'rank',
          label: '移至其他分组'
        },
        {
          icon: 'delete',
          label: '批量删除'
        },
        {
          icon: 'download',
          label: '批量导出'
        },
      ],
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        formData: {
          group_id: '',
        },
        rules: {
          group_id: [{ required: true, message: '请选择分组！', trigger: 'change' }],
        }
      },
      cliHeight: 0,
      loading: false,
      ipLoading: false,
      showGroup: true,
      search_icon: false,
      loadingGroup: false,
      pageOption: resetPage(),
      addVisible: false,
      isLoading: false,
      videoModal: {
        title: '',
        show: false,
        url: ''
      },
      taskModal: {
        show: false,
        title: '',
        type: '',
        queryData: {
          name: '',
          page: 1,
          limit: 10,
          total: 0,
        },
        data: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getGroupListFun(); // 分组列表
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
  },
  mounted() {
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
        name: this.queryData.name, // 标题
        id: this.queryData.id, // ID
        reason: this.queryData.reason, // 原因
        file_name: this.queryData.file_name, // 视频名称
        group_id: this.groupData.queryData.group_id, // 分组
        use_status: Number(this.queryData.use_status) || 0,
        sort: this.queryData.sort,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.accountDataList = res.data.list.map(item => {
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
      if (this.groupData.formData.id) {
        this.addModal.show = true
      } else {
        successTips(this, 'error', '请选择分组！')
      }
    },
    // 新建保存
    addSubmit() {
      if (!this.addModal.fileData.url) {
        successTips(this, 'error', '请上传视频文件！')
        return false
      }
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = this.addModal.formData
          formData.ptype = 1
          formData.group_id = this.groupData.queryData.group_id
          formData.file_id = this.addModal.fileData.file_id
          formData.file_name = this.addModal.fileData.file_name
          formData.content = this.addModal.fileData.url
          formData.file_md5 = this.addModal.fileData.file_md5
          editDataApi(formData).then(res => {
            if (res.msg === 'success') {
              this.closeModal()
              this.getDataListFun()
              this.getGroupListFun()
              this.$refs.refUploadFiles.resetFileFun()
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
        content: '',
      }
      this.addModal.fileData = {}
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
              group_id: this.groupData.queryData.group_id
            }
            editDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                this.getGroupListFun()
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
    },
    // 编辑分组 1-新增 2-编辑 3-删除
    editMaterialListFun(row, num) {
      const type = this.groupData.type || num
      const formData = {
        ptype: type,
        id: this.groupData.formData.id || '',
      }
      if (type === 1 || type === 2) {
        formData.name = this.groupData.formData.group_name
      }
      if (type === 3) {
        formData.del_id = [row.id]
      }
      this.ipLoading = true;
      editMaterialListApi(formData).then(res => {
        if (res.msg === 'success') {
          this.ipLoading = false;
          this.addVisible = false;
          this.getGroupListFun();
          successTips(this)
        }
      })
    },
    // 打开  TkAccountLink
    openTkAccountLinkFun(row) {
      window.open(row.tk_account_link,'_blank')
    },
    // 上传成功回调
    uploadSuccess(data) {
      this.addModal.fileData.file_id = data.file_id
      this.addModal.fileData.file_name = data.file_name
      this.addModal.fileData.url = data.url
      this.addModal.fileData.file_md5 = data.file_md5 || ''
    },
    // 上传文件
    uploadFileFun(key) {
      this.addModal.contentLoading = true
      const files = this.$refs.refUploadFile.files[0];
      const suffixArr = ['mp4', 'zip']
      const suffix = getFileExtension(files.name)
      if (suffixArr.includes(suffix)) {
        const formData = new FormData();
        formData.append('file', files);
        uploadFileApi(formData).then(res => {
          successTips(this, 'success', '上传成功！')
          if (res.msg === 'success') {
            this.addModal.fileData = res.data
            this.addModal.contentLoading = false
          }
        })
      } else {
        successTips(this, 'error', '仅可上传mp4和zip格式文件')
        this.addModal.contentLoading = false
      }
    },
    // 关闭文件
    closeFileFun() {
      this.addModal.fileData = {}
    },
    // 预览视频
    openFileFun(row) {
      const suffixArr = ['mp4']
      const suffix = getFileExtension(row.content)
      if (suffixArr.includes(suffix)) {
        this.videoModal.show = true
        this.videoModal.title = row.name
        this.videoModal.url = row.content
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
    // 获取分组列表
    getGroupListFun() {
      this.loadingGroup = true;
      const params = {
        name: this.groupData.queryData.group_name,
        page: 1,
        limit: 1000,
      }
      getMaterialListApi(params).then(res => {
        if (res.msg === 'success') {
          this.search_icon = false;
          this.loadingGroup = false;
          this.numGroupTotal = res.data.total;
          this.numberGroupList = res.data.list.map(item => {
            item.visible = false
            return item
          });
          this.groupData.type = 0
        }
      })
    },
    // 新建 编辑分组
    editGroupOpen(row, type) {
      this.groupData.type = type;
      this.groupData.formData.group_name = '';
      if (row) {
        this.groupData.formData.id = row.id;
        this.groupData.formData.group_name = row.name;
      }
    },
    // 点击分组查询列表
    changeGroup(row, idx) {
      this.groupData.formData = row;
      this.groupIdx = idx;
      this.groupData.queryData.group_id = idx === 'clear' ? '' : row.id;
      if (idx === 'clear') {
        this.getGroupListFun()
      }
      this.getDataListFun(1);
      this.$refs.serveTable.clearSelection();
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', this.$t('sys_c126'));
      }
      this.setBatchData.type = command.idx
      if (command.idx === 0) {
        this.setBatchData.show = true;
        this.setBatchData.title = command.item.label
        this.$nextTick(() => {
          this.$refs.setBatchForm.resetFields();
        })
      }
      if (command.idx === 1) {
        this.delDataFun()
      }
      if (command.idx === 2) {
        this.$confirm(`确认批量导出吗？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              const formData = { ids: this.selectIdData }
              exportDataApi(formData).then(res => {
                if (res.msg === 'success') {
                  window.location.href = res.data.url
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
    // 关闭批量操作弹窗
    closeBatchModal() {
      this.setBatchData.show = false
      this.$refs.setBatchForm.resetFields();
      this.setBatchData.type = -1
      this.setBatchData.formData.group_id = '';
    },
    // 批量保存功能
    submitSetBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            material_id: this.selectIdData,
            group_id: this.setBatchData.formData.group_id,
          }
          moveDataApi(params).then(res => {
            if (res.msg === 'success') {
              this.getDataListFun()
              this.getGroupListFun()
              this.closeBatchModal()
              this.$refs.serveTable.clearSelection();
              successTips(this)
            }
          })
        } else {
          return false;
        }
      });
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
      this.checkAccount = arr.map(item => {
        return item.account
      })
    },
    // 筛选项
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') { // 下降 倒序
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = '-' + prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = '-' + prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = '-' + prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = '-' + prop
            break;
        }
      } else if (order === 'ascending') { // 上升 = 正序
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = prop
            break;
        }
      } else {
        this.queryData.sort = ''
      }
      this.getDataListFun()
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 320;
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
      console.log('this.selectIdData',this.selectIdData)
    },
    // 行内筛选项
    handleRowQuery(val, key) {
      this.queryData[key] = val
      this.getDataListFun()
    },
    // 重置
    restQueryBtn() {
      this.groupData.queryData.group_id = '';
      this.selectIdData = [];
      this.checkAccount = [];
      this.screenSelect = [];
      this.queryData.name = ''
      this.queryData.id = ''
      this.queryData.reason = ''
      this.queryData.file_name = ''
      this.queryData.sort = ''
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
      this.$refs.serveTable.clearSort()
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

    dragStart(index) {
      this.draggedItemIndex = index;
    },
    async handleMoveSort(index) {
      const draggedItem = this.numberGroupList[this.draggedItemIndex];
      this.numberGroupList.splice(this.draggedItemIndex, 1);
      this.numberGroupList.splice(index, 0, draggedItem);
      this.draggedItemIndex = -1;
      const sortMap = this.numberGroupList.map(item => {
        return item.id
      });
      const res = await editSortGroup({ list: sortMap });
      if (res.code !== 0) return;
    },
    //  打开查看任务
    openTaskListFun() {
      this.$refs.refTaskModal.open()
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
::v-deep .el-card__body {
  width: 100%;
  height: 118px;
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  & > div {
    flex: 1;
  }

  .refsh_icon {
    cursor: pointer;
    color: #409eff;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .box_card_item {
    display: flex;
    cursor: pointer;
    padding: 6px;
    align-items: center;
    flex-direction: column;

    span {
      font-size: 16px;
    }

    .port_title {
      color: #409eff;
      font-size: 18px;
      margin-bottom: 20px;
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

::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-radio-group {
  margin-top: -2px;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}

.remark_ext {
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select_body {
  .select_ele {
    width: 130px;

    ::v-deep .el-input__inner {
      border-right: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .input_ele {
    width: 202px;

    ::v-deep .el-input__inner {
      border-left: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 1px solid #DCDFE6;
    }
  }
}

.continer_main {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .group_mian_hide {
    display: none;
  }

  .group_continer {
    width: 100%;
    overflow-x: auto;
  }
}

.group_tips {
  display: flex;
  color: #f56c6c;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}

.group_head_warp {
  display: flex;
  width: 220px;
  height: 40px;
  flex-shrink: 0;
  position: relative;
  font-size: 14px;
  color: #606266;
  align-items: center;
  padding: 0 8px 0 15px;
  box-sizing: border-box;
  justify-content: space-between;
  background: #f5f7fa;

  .group_head {
    cursor: pointer;
    display: flex;
    align-items: center;

    .el-icon-d-arrow-left {
      color: #409eff;
      font-size: 18px;
      margin-right: 10px;
    }
  }

  .custom_popover {
    position: absolute;
    top: 280px;
    // position: absolute;
    // top: -80px;
  }

  .el-icon-setting {
    margin-left: 10px;
  }

  .group_icon {
    display: flex;

    i {
      cursor: pointer;
    }
  }
}

::v-deep .editModal {
  position: absolute;
  top: -50px;
  width: 50px;
  height: 60px;
  background: #0a76a4;

}

.group_warp {
  width: 220px;
  // max-height: 550px;
  overflow-y: auto;
  flex-shrink: 0;
  flex-wrap: wrap;

  .group_item {
    display: flex;
    width: 100%;
    flex-shrink: 0;
    height: 36px;
    margin-top: 8px;
    cursor: pointer;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 12px;
    position: relative;

    .group_name {
      width: 80%;
      display: flex;
      align-items: center;

      .left_icon {
        margin-right: 6px;
      }

      .group_text {
        max-width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-icon-more,
    .el-icon-delete {
      margin-left: 10px;
      position: relative;

      .del_alert {
        //opacity: 0;
        width: 60px;
        padding: 10px;
        display: flex;
        position: absolute;
        top: 15px;
        left: -22px;
        z-index: 99999;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        // background-color: darkgreen;
        border: 1px solid #ebeef5;;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        .del_arrow {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          margin-right: 3px;
          border-bottom-width: 0;
          border-bottom-color: #ebeef5;
          border-width: 6px;
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
        }
      }
    }
  }

  .group_item:hover {
    background-color: #F5F8FA;
  }

  .group_active {
    background-color: #ebeef5;
  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}

.close_inherit, .add_inherit {
  display: flex;
  width: 100%;
  justify-content: center;

  .close_desc {
    display: flex;
    height: max-content;
    color: #606266;
    line-height: 1.4;
    font-size: 14px;
    padding: 10px;
    margin: 0 10px;
    border-radius: 10px;
    flex-direction: column;
    border: 1px solid #dcdcdc;
  }

  .footer_btn {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
}

.add_inherit {
  justify-content: space-between;

  .table_group {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .table_ele {
    width: 100%;
    height: 100%;
    // display: flex;
    flex-grow: 2;
    flex-direction: column;

    .tab_check_warp {
      margin: 12px 0 20px 10px;
    }
  }
}

.seat_class {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 10px;

  .seat_item {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 5px;
    color: #409eff;
    background: #ecf5ff;
    border-radius: 4px;
    border: 1px solid #b3d8ff;
  }
}

.loading_icon {
  margin-top: 10px;
}

::v-deep .el-form-item {
  margin-bottom: 24px;
}

.group_continer {
  .el-pagination {
    text-align: left !important;
  }
}

.file_content {
  cursor: pointer;
  color: #0a76a4;
  text-decoration: underline;
  font-size: 25px;
}

.video_content {
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.fileTips {
  font-size: 12px;
  color: #f9a505d9;
}

.file-content {
  display: flex;
  justify-content: space-between;

  .fileName {
    color: #00a8ff;
  }

  .closeFile {
    cursor: pointer;
    color: #000;

  }
}

</style>
