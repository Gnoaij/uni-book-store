<template>
  <view class="goods-list">
    <u-row class="u-skeleton">
      <template v-if="!goodsList.length">
        <u-col :span="span" v-for="item in 4" :key="item"><goods-card></goods-card></u-col>
      </template>
      <template v-else>
        <u-col :span="span" v-for="(item, index) in goodsList" :key="index">
          <goods-card :goods-info="item"></goods-card>
        </u-col>
      </template>
    </u-row>
    <u-skeleton :loading="loading" :animation="true" bg-color="#fff"></u-skeleton>
  </view>
</template>

<script>
export default {
  name: 'GoodsList',
  props: {
    goodsList: {
      default: Array,
      default: () => []
    },
    loading: {
      default: Boolean,
      default: false
    }
  },
  computed: {
    span() {
      return 12 / this.vuex_listLayout
    }
  }
}
</script>

<style scoped lang="scss"></style>
