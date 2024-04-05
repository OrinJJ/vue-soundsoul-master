<template>
  <div class="toubu" id="toubu">
    <!-- <el-input v-model="input" placeholder="请输入内容" class="sousuo"></el-input> -->
    <!--slot="append"UI组件摆放位置append=>前面,preappend=>后面-->
    <el-input placeholder="请输入内容" v-model="input" class="sousuo">
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="toShouSuo"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "toubu",
  data() {
    return {
      input: ""
    };
  },

  methods: {
    toShouSuo() {
      if (this.input == "") {
        /* Element组件自带的弹出警示框 */
        this.$message.warning("请你输入内容呀~~~");
      } else {
        this.$router.push("/ShouSuo?q=" + this.input);
      }
    }
  }
};
</script>

<style scoped>
.toubu {
  position: relative;
  margin: 0 auto;
  height: 60px;
  background: #55b9f3;
}
.sousuo {
  position: absolute;
  right: 60px;
  top: 10px;
  width: 250px;
  height: 40px;
}
</style>
