<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('sys_m001') }}</span>
            <el-button style="float:right;padding:0" type="text" @click="newMenuBtn">{{ $t('sys_m002') }}</el-button>
          </div>
          <el-button v-if="loadingMenu" class="loading_icon" type="primary" :loading="true"></el-button>
          <el-tree v-else :data="menuList" accordion @node-click="changeNode" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('sys_m003') }}</span>
          </div>
          <div>
            <el-form ref="menuForm" size="small" :model="menuForm" label-width="90px" :rules="menuRules">
              <el-form-item :label="$t('sys_m004') + ':'" prop="menuName">
                <el-input v-model="menuForm.menuName" clearable :placeholder="$t('sys_m003')" />
              </el-form-item>
              <el-form-item :label="$t('sys_m006') + ':'" prop="router">
                <el-input v-model="menuForm.router" clearable :placeholder="$t('sys_m007')" />
              </el-form-item>
              <el-form-item :label="$t('sys_m008') + ':'">
                <el-select v-model="menuForm.parentId" clearable :placeholder="$t('sys_m009')">
                  <el-option v-for="item in treeMenu" :key="item.menu_id" :label="item.name" :value="item.menu_id">
                    {{ item.list_name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('sys_m010') + ':'">
                <el-input v-model="menuForm.menuIcon" clearable :placeholder="$t('sys_m011')" @focus="iconModel = true" />
              </el-form-item>
              <el-form-item :label="$t('sys_m012') + ':'">
                <el-input v-model="menuForm.menuSout" :placeholder="$t('sys_m013')" />
              </el-form-item>
              <el-form-item label-width="0" style="text-align:right;" class="el-item-bottom">
                <el-button type="primary" :loading="isLoading" @click="submitBtn('menuForm')">{{ $t('sys_c024') }}</el-button>
                <el-button type="danger" :disabled="menuForm.type == 0" @click="delmenu">{{ $t('sys_c028') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增-->
    <el-dialog title="菜单图标" center :visible.sync="iconModel" :close-on-click-modal="false" width="550px">
      <el-form size="small" :inline="true" :model="iconForm">
        <!-- <el-form-item label="图标名称:">
            <el-input v-model="iconForm.iconName" placeholder="请输入图标名称"></el-input>
          </el-form-item> -->
        <el-form-item label-width="0">
          <div class="icon_warp">
            <div v-for="(icon, idx) in iconOption" :key="idx" class="menu_icon" @click="changeIcon(icon)">
              <i :class="'el-icon-' + icon" />
              <p>{{ icon }}</p>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { iconJson, successTips } from '@/utils/index'
import { allmenu, domenu } from '@/api/permission'
export default {
  data() {
    return {
      menuForm: {
        type: 0,
        menu_id: '',
        menuName: '',
        router: '',
        parentId: '',
        menuIcon: '',
        menuSout: 0,
      },
      loadingMenu: false,
      isLoading: false,
      iconOption: iconJson(),
      iconModel: false,
      roleOption: [
        {
          name: ''
        }
      ],
      iconForm: {
        iconName: '',
        icon_id: '',
      },
      treeMenu: [],
      menuList: [],
    }
  },
  computed: {
    menuRules() {
      return {
        menuName: [{ required: true, message: this.$t('sys_m005'), trigger: 'blur' }],
        router: [{ required: true, message: this.$t('sys_m007'), trigger: 'change' }],
        parentId: [{ required: true, message: this.$t('sys_m009'), trigger: 'blur' }],
        menuIcon: [{ required: true, message: this.$t('sys_m011'), trigger: 'blur' }],
        menuSout: [{ required: true, message: this.$t('sys_m013'), trigger: 'blur' }],
      }
    }
  },
  created() {
    this.initMenuList();
  },
  methods: {
    setPageSize() {
    },
    switchPage() {

    },
    changeNode(row) {
      this.menuForm.type = 1;
      this.menuForm.router = row.path;
      this.menuForm.menu_id = row.menu_id;
      this.menuForm.menuIcon = row.icon;
      this.menuForm.menuName = row.mate.title;
      this.menuForm.menuSout = row.sort;
      this.menuForm.parentId = row.pid == 0 ? '' : row.pid;
    },
    async initMenuList() {
      const newMenu = [];
      this.loadingMenu = true;
      const { data } = await allmenu({});
      const menuTree = data.memu?.sort((a, b) => (a.sort - b.sort)) || [];
      console.log(menuTree);
      for (let m = 0; m < menuTree.length; m++) {
        menuTree[m].label = menuTree[m].mate.title;
        newMenu.push({ name: menuTree[m].mate.title,list_name: menuTree[m].mate.title,menu_id: menuTree[m].menu_id })
        if (menuTree[m].children) {
          menuTree[m].children.sort((a, b) => (a.sort - b.sort))
          for (let c = 0; c < menuTree[m].children.length; c++) {
            menuTree[m].children[c].label = menuTree[m].children[c].mate.title;
            newMenu.push({
              menu_id: menuTree[m].children[c].menu_id,
              name: menuTree[m].children[c].mate.title,
              list_name: `　　└╌ ${menuTree[m].children[c].mate.title}`
            })
          }
        }
      }
      this.loadingMenu = false;
      this.menuList = menuTree;
      this.treeMenu = newMenu;
    },
    newMenuBtn() {
      this.$nextTick(() => {
        this.menuForm.router = "";
        this.menuForm.menu_id = "";
        this.menuForm.menuIcon = "";
        this.menuForm.menuName = "";
        this.menuForm.menuSout = 0;
        this.menuForm.type = 0;
        this.$refs.menuForm.resetFields();
      })
    },
    submitBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true;
          const params = {
            type: 0,
            status: 0,
            ptype: this.menuForm.type,
            url: this.menuForm.router,
            icon: this.menuForm.menuIcon,
            pid: Number(this.menuForm.parentId),
            title: this.menuForm.menuName,
            sort: Number(this.menuForm.menuSout)
          }
          this.menuForm.type==1?params.menu_id=this.menuForm.menu_id:"";
          domenu(params).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            this.initMenuList();
            successTips(this)
            this.newMenuBtn();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    delmenu() {
      domenu({ ptype: 2, menu_id: this.menuForm.menu_id }).then(res => {
        this.isLoading = false;
        if (res.code != 0) return;
        for (let m = 0; m < this.menuList.length; m++) {
          if (this.menuForm.menu_id && this.menuList[m].children) {
            for (let c = 0; c < this.menuList[m].children.length; c++) {
              if (this.menuList[m].children[c].menu_id == this.menuForm.menu_id) {
                this.menuList[m].children.splice(c,1)
              }
            }
            if (this.menuList[m].menu_id == this.menuForm.menu_id) {
              this.menuList.splice(m,1)
            }
          }
        }
        successTips(this)
        this.newMenuBtn();
      })
    },
    changeIcon(icon) {
      this.menuForm.menuIcon = 'el-icon-' + icon;
      this.iconModel = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.icon_warp {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 5px;

  .menu_icon {
    width: (100%/6);
    display: flex;
    flex-shrink: 0;
    cursor: pointer;
    align-items: center;
    flex-direction: column;
    ::v-deep i {
      font-size: 26px;
      margin: 5px;
      margin: 0;
    }
    p {
      line-height: 0;
      font-size: 12px;
    }
  }
  .menu_icon:hover {
    color: #1989fa;
  }
}
</style>
