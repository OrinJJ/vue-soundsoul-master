<template>
  <div class="yinyue" id="yinyue">
    <div class="yinyue1">
      <div class="biaoqian">
        <!-- 行内元素无宽与高 -->
        <span :class="{ bianse: tag == '0' }" @click="tag = '0'">全部</span>
        <span :class="{ bianse: tag == '7' }" @click="tag = '7'">华语</span>
        <span :class="{ bianse: tag == '96' }" @click="tag = '96'">欧美</span>
        <span :class="{ bianse: tag == '8' }" @click="tag = '8'">日本</span>
        <span :class="{ bianse: tag == '16' }" @click="tag = '16'">韩国</span>
      </div>

      <div class="zhu">
        <span style="width:470px; text-align:center">音乐标题</span>
        <span style="width:150px; text-align:center">歌手</span>
        <span style="width:400px; text-align:center">专辑</span>
        <span style="width:425px; text-align:center">时长</span>
      </div>

      <table>
        <tbody>
          <tr v-for="(item, index) in lists" :key="index">
            <td style="width:280px;padding-left: 20px;">
              <span style="padding-right: 10px;">{{ index + 1 }}</span>
              <!-- 点击播放 -->
              <div class="touxiang" @click="palyMusic(item.id)">
                <el-image :src="item.album.picUrl" alt="-" class="touxiang" />
              </div>
              <span>{{ item.name }}</span>
            </td>
            <td style="width:150px">{{ item.album.artists["0"].name }}</td>
            <td style="width:250px">
              <span style=" float:left; width:240px ">{{
                item.album.name
              }}</span>
            </td>
            <td style="width:210px">{{ item.duration }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "yinyue",
  data() {
    return {
      tag: "0",
      lists: []
    };
  },
  watch: {
    tag() {
      this.qiehuan();
    }
  },
  created() {
    this.qiehuan();
  },
  methods: {
    qiehuan() {
      axios({
        url: "https://autumnfish.cn/top/song",
        method: "get",
        params: {
          type: this.tag
        }
      }).then(res => {
        this.lists = res.data.data;
        /* 毫秒转化为分秒 */
        for (let i = 0; i < this.lists.length; i++) {
          let duration = this.lists[i].duration;
          let min = parseInt(duration / 1000 / 60);
          if (min < 10) {
            min = "0" + min;
          }
          let miao = parseInt((duration / 1000) % 60);
          if (miao < 10) {
            miao = "0" + miao;
          }
          this.lists[i].duration = `${min}:${miao}`;
        }
      });
    },
    palyMusic(id) {
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id: id
        }
      }).then(res => {
        let url = res.data.data[0].url;
        // this.$parent.src = url;
        console.log("url:", url);
        // console.log('传输的dizhi:',this.$parent.src);
        eventBus.$emit("dizhi", url);
      });
    }
  }
};
</script>

<style scoped>
.yinyue {
  float: left;
  width: auto;
  height: auto;
  overflow: hidden;
}

.biaoqian {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 1500px;
  height: 30px;
  text-align: right;
  z-index: 10;
  background-color: rgba(185, 224, 230, 0.6);
}
.biaoqian span {
  /*padding-right: 10px;*/
  font-size: 15px;
  line-height: 30px;
  color: rgb(77, 69, 33);
  display: inline-block;
  cursor: pointer;
  padding-right: 30px;
}
.biaoqian .bianse {
  color: rgb(238, 43, 9);
}
.biaoqian span:hover {
  color: rgb(218, 145, 9);
}

.zhu {
  position: absolute;
  top: 30px;
  left: 0px;
  width: 1500px;
  height: 50px;
  background-color: rgba(185, 224, 230, 0.6);
  z-index: 10;
}
.zhu > span {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 700;
}

table {
  margin: 0 auto;
  margin-top: 100px;
  width: 1600px;
}

tr {
  height: 100px;
  line-height: 90px;
  font-size: 15px;
  vertical-align: center;
  cursor: pointer;
}
td span:first-of-type {
  float: left;
  width: 30px;
}
td span:last-of-type {
  float: left;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.touxiang {
  float: left;
  position: relative;
  margin-right: 45px;
  width: 90px;
  height: 90px;
  border-radius: 5px;
}
.touxiang img {
  width: 100%;
  height: 100%;
}
tr:hover {
  color: rgb(255, 30, 0);
}
.touxiang::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 0px;
  width: 0px;
  background-position: 50% 50%;
  transition: all 0.3s;
}
.touxiang:hover:after {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  height: 90px;
  width: 90px;
  border-radius: 5px;
  background-color: rgba(32, 31, 31, 0.8);
  background-image: url("../assets/bofang.png");
  background-repeat: no-repeat;
  background-size: 30% 33%;
  background-position: 50% 50%;
}
</style>
