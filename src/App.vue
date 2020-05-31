<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>

let redoMixin = {
  data() {
        return {
          // banana:[],
          doneAction:[],
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
        //  this.blankState = cloneDeep(this.$store)
      },

      mounted(){
        window.addEventListener("keyup", event => {
          if (event.key === "z") {
          
           this.undo()
          }
        });
      },

      methods: {
        undo: function() {
          this.doneAction.pop();
          this.$store.commit("EMPTY_STATE",this.$store)
          console.log(this.$store)
          this.doneAction.forEach(action => {
            console.log("In the loop",this.$store)
            //this.$store.commit(`${mutation.type}`, mutation.payload);
            this.$store.dispatch(action.type, action.payload);
            this.doneAction.pop();
          });
    
        }
      }
}


export default {
  name: 'App',
  mixins:[redoMixin]
}
</script>

<style>
</style>
