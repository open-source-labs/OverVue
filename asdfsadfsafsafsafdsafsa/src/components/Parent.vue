<template>
  <div id = "idName" class = "ClassName">
    <div class = "divClass"></div>
    <button class = "btnClass"></button>
    <form></form>
    <p></p>
  </div>
</template>

<script>
import App from '@/components/App.vue';
import HomeView from '@/components/HomeView.vue';
import Parent from '@/components/Parent.vue';

export default {
  name: 'Parent',
  components: {
    App,
    HomeView,
    Parent,
  },
  data () {
    return {
    }
  },
};
</script>

<style scoped>
.ClassName {
background-color: #68905485;
width: 863px;
height: 799px;
z-index: 0;
}
.divClass {
height: 54%;
width: 17%;
top: 41%;
left: 63%;
z-index: 0;
}
.btnClass {
height: 32%;
width: 4%;
top: 32%;
left: 32%;
z-index: 0;
}
</style >