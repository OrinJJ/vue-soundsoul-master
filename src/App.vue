<template>
  <div id="app">
    <router-view />
    <div class="audio">
      <audio :src="dizhi" controls autoplay></audio>
    </div>
    <mouse></mouse>
  </div>
</template>

<script>
import mouse from "@/components/mouse";
export default {
  name: "App",
  components: {
    mouse: mouse
  },
  data() {
    return {
      dizhi: ""
    };
  },
  created() {
    this.bbtn();
  },
  methods: {
    bbtn() {
      eventBus.$on("dizhi", message => {
        //这里最好用箭头函数，不然this指向有问题
        this.dizhi = message;
        console.log("音乐传值=>音乐播放组件", this.dizhi);
      });
    }
  }
};
</script>

<style>
.audio {
  position: absolute;
  top: 720px;
}
</style>
