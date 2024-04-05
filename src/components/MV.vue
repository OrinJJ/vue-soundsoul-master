<template>
  <div class="mv" id="mv">
    <div class="mv1">
      <!-- <div class="xu"></div> -->
      <div class="liebiao">
        <span>地区：</span>
        <span :class="{ bianse: diqu == '全部' }" @click="diqu = '全部'"
          >全部</span
        >
        <span :class="{ bianse: diqu == '内地' }" @click="diqu = '内地'"
          >内地</span
        >
        <span :class="{ bianse: diqu == '港台' }" @click="diqu = '港台'"
          >港台</span
        >
        <span :class="{ bianse: diqu == '欧美' }" @click="diqu = '欧美'"
          >欧美</span
        >
        <span :class="{ bianse: diqu == '日本' }" @click="diqu = '日本'"
          >日本</span
        >
        <span :class="{ bianse: diqu == '韩国' }" @click="diqu = '韩国'"
          >韩国</span
        >
      </div>
      <div class="liebiao" style="top:40px">
        <span>类型：</span>
        <span :class="{ bianse: leixing == '全部' }" @click="leixing = '全部'"
          >全部</span
        >
        <span
          :class="{ bianse: leixing == '官方版' }"
          @click="leixing = '官方版'"
          >官方版</span
        >
        <span :class="{ bianse: leixing == '原声' }" @click="leixing = '原声'"
          >原声</span
        >
        <span
          :class="{ bianse: leixing == '现场版' }"
          @click="leixing = '现场版'"
          >现场版</span
        >
        <span
          :class="{ bianse: leixing == '网易出品' }"
          @click="leixing = '网易出品'"
          >网易出品</span
        >
      </div>
      <div class="liebiao" style="top:70px">
        <span>排序：</span>
        <span
          :class="{ bianse: paixu == '上升最快' }"
          @click="paixu = '上升最快'"
          >上升最快</span
        >
        <span :class="{ bianse: paixu == '最热' }" @click="paixu = '最热'"
          >最热</span
        >
        <span :class="{ bianse: paixu == '最新' }" @click="paixu = '最新'"
          >最新</span
        >
      </div>
      <div class="xu2"></div>
      <div class="zhuyao">
        <div
          v-for="(item, index) in list"
          :key="index"
          @click="mvbofang(item.id)"
        >
          <img :src="item.cover" alt />
          <i>{{ item.playCount }}</i>
          <span>{{ item.name }}</span>
          <span>{{ item.artistName }}</span>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="20"
        class="fenye"
        @current-change="huanye"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "mv",
  data() {
    return {
      diqu: "全部",
      leixing: "全部",
      paixu: "上升最快",
      total: 1200,
      page: 1,
      limit: 20,
      list: []
    };
  },

  created() {
    this.qiehuan();
  },
  watch: {
    diqu() {
      this.page = 1;
      this.qiehuan();
    },
    leixing() {
      this.page = 1;
      this.qiehuan();
    },
    paixu() {
      this.page = 1;
      this.qiehuan();
    }
  },
  methods: {
    qiehuan() {
      axios({
        url: "https://autumnfish.cn/mv/all",
        method: "get",
        params: {
          area: this.diqu,
          type: this.leixing,
          order: this.paixu,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then(res => {
        this.list = res.data.data;

        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].playCount > 10000) {
            this.list[i].playCount =
              parseInt(this.list[i].playCount / 10000) + "万";
          }
        }
        // 保存总条数
        // 接口问题 有count 就赋值
        if (res.data.count) {
          this.total = res.data.count;
        }
      });
    },
    huanye(val) {
      this.page = val;
      this.qiehuan();
    },
    mvbofang(id) {
      this.$router.push(`/MVBF?q=${id}`);
    }
  }
};
</script>

<style scoped>
.mv {
  float: left;
  position: relative;
  width: 1600px;
  height: auto;
  overflow: hidden;
}
.mv1 {
  float: left;
  width: 1500px;
  height: auto;
  overflow: auto;
}
.xu {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 10px;
  z-index: 5;
}
.xu2 {
  position: absolute;
  top: 100px;
  left: 0px;
  width: 100%;
  height: 10px;
  z-index: 5;
}
.liebiao {
  position: absolute;
  top: 10px;
  left: 0px;
  padding-left: 100px;
  height: 30px;
  width: 100%;
  font-size: 16px;
  line-height: 30px;
  z-index: 5;
}
.liebiao span {
  float: left;
  height: 30px;
  padding-left: 10px;
  padding-right: 20px;
  cursor: pointer;
}
.liebiao span:first-of-type {
  padding-left: 0;
  padding-right: 0;
  border: none;
}
.liebiao div {
  float: left;
  margin-top: 5px;
  margin-left: 15px;
  margin-right: 15px;
  height: 20px;
  width: 1.5px;
}
.zhuyao {
  margin: 0 auto;
  margin-top: 130px;
  width: 1600px;
  height: 850px;
}
.zhuyao div {
  float: left;
  position: relative;
  margin-left: 50px;
  margin-bottom: 100px;
  width: 225px;
  height: 120px;
  border-radius: 10px;
  background-color: rgb(139, 32, 32);
  cursor: pointer;
}
.zhuyao div::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0px;
  height: 0px;
  background-position: 50% 50%;
  transition: all 0.3s;
}
.zhuyao div:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 225px;
  height: 120px;
  border-radius: 10px;
  box-shadow: 3px 3px 3px rgba(20, 20, 20, 0.7);
  background-color: rgba(80, 80, 80, 0.6);
  background-image: url("../assets/bofang.png");
  background-repeat: no-repeat;
  background-size: 16% 30%;
  background-position: 50% 50%;
}
.zhuyao img {
  float: left;
  width: 100%;
  border-radius: 8px;
  height: 100%;
}
.zhuyao span {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.zhuyao span:first-of-type {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 225px;
  height: 30px;
  font-size: 17px;
  line-height: 30px;
}
.zhuyao span:last-of-type {
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 225px;
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  color: rgb(102, 98, 98);
}
.zhuyao i {
  position: absolute;
  right: 10px;
  top: 2px;
  height: 16px;
  color: rgb(235, 8, 8);
  font-style: normal;
  font-size: 15px;
  line-height: 16px;
  z-index: 2;
}
.fenye {
  position: absolute;
  left: 500px;
  top: 960px;
  text-align: center;
  font-size: 20px;
}
.liebiao span:hover {
  color: rgb(160, 30, 30);
}
.liebiao span:first-of-type:hover {
  color: #000;
  border-bottom: none;
}
.bianse {
  color: rgb(165, 26, 26);
}
</style>
