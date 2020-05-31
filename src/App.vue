<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { SET_ACTIVE_COMPONENT } from './store/types'
const deepEqual = require('lodash.isequal')


let redoMixin = {
  data() {
        return {
          // banana:[],
          doneAction:[],
          undoneAction:[],
          isTimetraveling: false
        }
      },
      
      created(){
        // this.$store.subscribe(mutation => {
        //   console.log("What is this?",this)
        //   this.banana.push(mutation);
        // })

        this.$store.subscribeAction((action,state)=>{
          this.doneAction.push(action)
          // console.log('this is the action we are logging',action)
          // console.log('this is in our redo queue', this.undoneAction[this.undoneAction.length-1])
          // console.log("Are these equal to each other?", action == this.undoneAction[this.undoneAction.length-1])
          if(!this.isTimetraveling){
            if (this.undoneAction[this.undoneAction.length-1]){
              if(action.type == this.undoneAction[this.undoneAction.length-1].type && deepEqual(action.payload,this.undoneAction[this.undoneAction.length-1].payload)){
                this.undoneAction.pop()
              }
              else{
                this.undoneAction = []
              }
            }
          }
        })
        //  this.blankState = cloneDeep(this.$store)
      },

      mounted(){
        window.addEventListener("keyup", event => {
          if (event.key === "z") {
          
           this.undo()
          }
        });
          window.addEventListener("keyup", event => {
          if (event.key === "y") {
           this.redo()
          }
        });
      },

      methods: {
        undo: function() {
          // do {
            // console.log("How far back?")
            let undone = this.doneAction.pop()
            this.isTimetraveling = true;
            if(undone !== undefined){
              this.undoneAction.push(undone)
            }
          // } while (this.doneAction[this.doneAction.length-1] &&
          //   (this.doneAction[this.doneAction.length - 1].type === "setActiveComponent" ||
          //    this.doneAction[this.doneAction.length - 1].type === "updateComponentPosition" ))
          this.$store.commit("EMPTY_STATE",this.$store)
          console.log(this.$store)
          this.doneAction.forEach(action => {
            console.log("In the loop",this.$store)
            //this.$store.commit(`${mutation.type}`, mutation.payload);
            this.$store.dispatch(action.type, action.payload);
            this.doneAction.pop();
          });
          this.isTimetraveling = false;
    
        },
          redo: function() {
            
              let action = this.undoneAction.pop()
              this.isTimetraveling = true;
              if(action){
              this.$store.dispatch(action.type, action.payload)
              }
            this.isTimetraveling = false;
            //  if(action && (action.type === "setActiveComponent" || action.type === "updateStartingPosition")){
            //   console.log("WE GOTTA DO MORE")
            //   this.redo();
            // }
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
