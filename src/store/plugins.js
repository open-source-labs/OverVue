module.exports = {
  install(Vue) {
    Vue.mixin({
      // Code goes here
      data() {
        return {
          // banana:[],
          doneAction:[],
          blankState:{}
        }
      },
      created(){
        // this.$store.subscribe(mutation => {
        //   console.log("What is this?",this)
        //   this.banana.push(mutation);
        // })

        this.$store.subscribeAction((action,state)=>{

          this.doneAction.push(action)
        })
      }
    });
  }
};