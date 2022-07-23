<template>
  <view class="profile-info">
    <template v-if="!vuex_token">
      <u-empty class="u-p-80" mode="permission" color="#82848a" text="登录之后才能查看个人信息">
        <template #bottom>
          <u-button class="u-m-t-20" size="medium" @click="handleLoginClick">登录</u-button>
        </template>
      </u-empty>
    </template>
    <template v-else>
      <view class="u-p-l-20 u-p-r-20">
        <u-form>
          <u-form-item label="昵称">
            <view class="u-flex-1" @click="handleNameClick">{{ vuex_userInfo.name }}</view>
          </u-form-item>
          <u-form-item label="头像">
            <view class="u-flex">
              <u-upload
                width="140"
                height="140"
                :max-count="1"
                :multiple="false"
                :action="action"
                :form-data="formData"
                :before-upload="handleBeforeUpload"
                @on-success="handleUploadSuccess"
                @on-error="handleUploadFail"
                @on-remove="handleUploadFail"
              ></u-upload>
              <u-button
                class="u-m-l-15"
                size="mini"
                :disabled="!allowSave"
                @click="isShowAvatarModal = true"
              >
                保存
              </u-button>
            </view>
          </u-form-item>
        </u-form>
      </view>
      <!-- inpute modal -->
      <u-modal
        v-model="isShowInputModal"
        :title="inputModalTitle"
        :show-confirm-button="isShowInputModalConfirm"
        show-cancel-button
        async-close
        @confirm="handleInputModalConfirm"
        ref="inputModalRef"
      >
        <view class="u-p-t-20 u-p-b-20 u-p-l-40 u-p-r-40">
          <u-input
            v-model="inputModalValue"
            :placeholder="placeholder"
            :clearable="false"
            input-align="center"
          />
        </view>
      </u-modal>
      <!-- avatar modal -->
      <u-modal
        v-model="isShowAvatarModal"
        content="确定要保存头像吗？"
        show-cancel-button
        @confirm="handleAvatarModalConfirm"
      ></u-modal>
    </template>
  </view>
</template>

<script>
export default {
  name: 'ProfileInfo',
  data() {
    return {
      isShowInputModal: false,
      isShowAvatarModal: false,
      inputModalTitle: '',
      inputModalValue: '',
      placeholder: '',
      updateField: '',
      action: '',
      formData: {},
      filename: '',
      uploaded: false,
      handleBeforeUpload: null
    }
  },
  computed: {
    isShowInputModalConfirm() {
      return !!this.inputModalValue
    },
    allowSave() {
      return this.filename && this.uploaded
    }
  },
  methods: {
    async getUserInfo() {
      const userInfo = await this.$_api.user.getInfo(undefined, {
        loading: { title: '获取用户信息中' }
      })
      this.vuex('vuex_userInfo', userInfo)
    },
    handleNameClick() {
      this.updateField = 'name'
      this.placeholder = '请输入昵称'
      this.inputModalTitle = '修改昵称'
      this.inputModalValue = this.vuex_userInfo.name
      this.isShowInputModal = true
    },
    async handleInputModalConfirm() {
      try {
        await this.$_api.user.updateInfo(
          {
            [this.updateField]: this.inputModalValue
          },
          {
            loading: { title: '更新用户信息中', mask: true },
            toast: { title: '更新用户信息成功' }
          }
        )
        this.isShowInputModal = false
        // this.getUserInfo()
        this.vuex(`vuex_userInfo.${this.updateField}`, this.inputModalValue)
      } catch (e) {
        this.$refs.inputModalRef.clearLoading()
      }
    },
    async handleAvatarModalConfirm() {
      if (this.allowSave) {
        await this.$_api.user.updateAvatar(
          {
            avatar: this.filename
          },
          {
            loading: { title: '更新用户头像中', mask: true },
            toast: { title: '更新用户头像成功' }
          }
        )
        // this.getUserInfo()
        const originAvatar = this.vuex_userInfo.avatar
        const originAvatarUrl = this.vuex_userInfo.avatar_url
        if (originAvatar && originAvatarUrl) {
          this.vuex('vuex_userInfo.avatar', this.filename)
          this.vuex(
            'vuex_userInfo.avatar_url',
            originAvatarUrl.replace(originAvatar, this.filename)
          )
        }
      }
    },
    handleUploadSuccess() {
      this.uploaded = true
    },
    handleUploadFail() {
      this.filename = ''
      this.uploaded = false
    },
    handleLoginClick() {
      this.$_router.navigateTo({
        url: '/pages/auth/login'
      })
    }
  },
  onLoad() {
    // 小程序端this指向绑定
    async function _handleBeforeUpload(index, list) {
      this.filename = ''
      this.uploaded = false

      const file = list[index].file

      // H5端取name字段
      // #ifdef H5
      const temp = file.name
      //  #endif
      // 非H5端取path字段
      // #ifndef H5
      const temp = file.path
      //  #endif

      const suffix = temp.substring(temp.lastIndexOf('.'))

      this.filename = Date.now() + suffix

      const ossToken = await this.$_api.auth.getOssToken()

      this.action = ossToken.host
      this.formData = {
        key: this.filename,
        policy: ossToken.policy,
        OSSAccessKeyId: ossToken.accessid,
        success_action_status: 200,
        signature: ossToken.signature
      }

      return true
    }
    this.handleBeforeUpload = _handleBeforeUpload.bind(this)
  },
  onShow() {
    if (this.vuex_token) {
      this.getUserInfo()
    }
  }
}
</script>

<style scoped lang="scss"></style>
