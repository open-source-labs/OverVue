const cloneDeep = require('lodash.clonedeep')
// import * as types from './types'


module.exports = {
  install(Vue) {
    Vue.mixin({
      // Code goes here
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
        let array = [[2]]
        let clonedArray = cloneDeep(array)
      },

      mounted(){
        window.addEventListener("keyup", event => {
          if (event.key === "z") {
            // console.log('this', this)
           this.undo()
          }
        });
      },

      methods: {
        undo: function() {
          this.doneAction.pop();
          this.$store.commit("EMPTY_STATE",this)
          // this.doneAction.forEach(action => {
          //   //this.$store.commit(`${mutation.type}`, mutation.payload);
          //   this.$store.dispatch({type: action.type, payload: action.payload});
          //   this.doneAction.pop();
          // });
    
        }
      }
    });
  }
};