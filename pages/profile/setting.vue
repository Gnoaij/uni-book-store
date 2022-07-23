<template>
  <view class="profile-setting">
    <u-cell-group>
      <u-cell-item
        icon="grid"
        title="列表布局"
        :value="layoutOptions[layoutIndex].label"
        @click="isShowLayoutOptions = true"
      ></u-cell-item>
    </u-cell-group>
    <u-select
      v-model="isShowLayoutOptions"
      :list="layoutOptions"
      :default-value="[layoutIndex]"
      @confirm="handleLayoutConfirm"
    ></u-select>
  </view>
</template>

<script>
export default {
  name: 'ProfileSetting',
  data() {
    return {
      layoutOptions: [
        {
          label: '单列',
          value: 1
        },
        {
          label: '双列',
          value: 2
        }
      ],
      isShowLayoutOptions: false
    }
  },
  computed: {
    layoutIndex() {
      return this.layoutOptions.findIndex(item => item.value === this.vuex_listLayout)
    }
  },
  methods: {
    handleLayoutConfirm(event) {
      this.vuex('vuex_listLayout', event[0].value)
    }
  }
}
</script>

<style scoped lang="scss"></style>
