<template>
      <q-btn
      id="import-component-btn"
      color="secondary"
      label="Import Component"
      @click="importComponent"
    />
</template>

<script>
export default {
  methods: {
    importComponent() {
      ipcRenderer
        .invoke("openProject", {
          properties: ["openProject"],
          filters: [
            {
              name: "Vue Files",
              extensions: ["vue"],
            },
          ],
        })
        .then((res) => this.openVueFile(res.filePaths))
        .catch((err) => console.log(err));
    },

    openVueFile(data) {
      if (data === undefined) return;
      const importObj = {};
      let compName = data[0].slice(data[0].lastIndexOf('/')+1).replace(/[^a-z0-9-_.]/gi, '');
      let vueFile = fs.readFileSync(data[0], "utf8");
      importObj.componentName = compName;
      
      const htmlElementMap = { //OverVue state management only handles these HTML tags.
        div: ["<div>", "</div>"],
        button: ["<button>", "</button>"],
        form: ["<form>", "</form>"],
        img: ["<img>", ""],
        link: ['<a href="#"/>', ""],
        list: ["<li>", "</li>"],
        paragraph: ["<p>", "</p>"],
        "list-ol": ["<ol>", "</ol>"],
        "list-ul": ["<ul>", "</ul>"],
        input: ["<input />", ""],
        navbar: ["<nav>", "</nav>"],
      };

      let htmlList = [];
      let htmlString = vueFile.substring(vueFile.indexOf('<template >')+10, vueFile.indexOf('</template>'));
      let scriptString = vueFile.substring(vueFile.indexOf(`<script>`)+8, vueFile.indexOf(`/script>`)-1)
      htmlParser(htmlString);
      importObj.props = parsingStringToProps(scriptString);
      importObj.actions = parsingStringToAction(scriptString);
      importObj.state = parsingStringToState(scriptString);
      htmlList.pop(); htmlList.shift(); //OverVue adds a <div></div> wrapper to all components. remove this before importing.
      let groupings = findGroupings(htmlList);
      let groupingObj = objectGenerator(groupings);
      let groupingArray = [];
      for (const key in groupingObj){
        groupingArray.push(groupingObj[key])
      }
      importObj.htmlList = groupingArray;
      console.log(importObj)

      
      function htmlParser(htmlString){
        if (!htmlString){return}
        //remove new lines and tabs from HTML
        htmlString = htmlString.replaceAll('\n', '').replaceAll('\t', '');
        //find index for the first < and > in the string
        let openTag = htmlString.indexOf('<');
        let closeTag = htmlString.indexOf('>');

        //push the substring wrapped by < and > into the helper func
        buildList(htmlString.substring(openTag+1, closeTag))

        //recursively call htmlParser on the remainder of the string
        return htmlParser(htmlString.substring(closeTag+1))
      }

      function buildList(substring){
      for (const elem in htmlElementMap){
        for (let i = 0; i < htmlElementMap[elem].length; i++){
          //if the htmlElementMap[elem][index] matches the substring, push it into the output array
          if (substring === 'p'){
            htmlList.push(htmlElementMap.paragraph[0])
            return;
          } else if (substring === '/p') {
            htmlList.push(htmlElementMap.paragraph[1])
            return;
          }
          if (htmlElementMap[elem][i].indexOf(substring) !== -1){
            htmlList.push(htmlElementMap[elem][i])
            return;
          }
        }
      }
      }

      function findGroupings(array){
        let count = 0; //tracks where the parent ends
        let stopIndexes = []; //an array that will be used to slice out the parent/child relationships
        for (let i = 0; i < array.length; i++){
          if (array[i][1] !== '/'){
            if (array[i] === '<img>' || array[i] === '<a href="#"/>' || array[i] === '<input />'){
              if (count === 0){
                stopIndexes.push(i);
                continue;
              }
            } else {
            count++;
            }
          } else {
            count--;
          }
          if (count === 0){
            stopIndexes.push(i)
          }
        }
    
        let groupings = [];
        let startIndex = 0;
        for (let i = 0; i < stopIndexes.length; i++){
          groupings.push(array.slice(startIndex, stopIndexes[i]+1));
          startIndex = stopIndexes[i]+1;
        }
    
        return groupings;
      }

      function objectGenerator(array){
        let groupingObj = {};
        let idGen = Date.now()
        for (let i = 0; i < array.length; i++){
          for (const key in htmlElementMap){
            if (array[i][0] === htmlElementMap[key][0]){
              groupingObj[i] = {text: key, id: idGen}
            }
          }
          array[i].pop();
          array[i].shift();
          if (array[i].length > 0){
            const childGroupings = findGroupings(array[i]);
            const childrenObj = objectGenerator(childGroupings)
            const childrenArray = [];
            for (const key in childrenObj){
              childrenArray.push(childrenObj[key])
            }
            groupingObj[i].children = childrenArray;
          } else {
            groupingObj[i].children = [];
          }
        }
        return groupingObj;
      }
    }
  }
}

      //img, link, input do NOT need closing tags -- cannot have children either

      
      //for props, it's
      
      //Trying to target obj property without a key 
    //string.slice(indexof({),indexof(:))

      function parsingStringToProps (str){
        let props = [];
   
        let split = str.split(' ');
        
        for(let i = 0; i < split.length; i++){
          
          if(split[i].includes(':') && split[i] !== 'computed:' &&  split[i] !== 'methods:' &&  split[i] !== 'name:' && split[i] !=='components:'){
          
            let cleanStr = split[i].slice(0,split[i].indexOf(':'))

            props.push(cleanStr)

          }
        

        }
        console.log('props: ', props)
        return props
      }
// First slice from map actions until 
function parsingStringToAction (str){
  let action = [];

//indexOfMapActions = 
let trashedSlice = str.slice(str.lastIndexOf('...mapActions')+15);
let slice = trashedSlice.slice(0, trashedSlice.indexOf('])'));

let split = slice.split(' ')
        
for(let i = 0; i < split.length; i++){

if (split[i].includes(',')){
            
            

    let cleanStr = split[i].slice(split[i].indexOf('"')+1,split[i].lastIndexOf('"')) 

        action.push(cleanStr)
  }


}
console.log('actions', action)
return action
}


function parsingStringToState (str){
let state = [];

let trashedSlice = str.slice(str.lastIndexOf('...mapState')+15);
let slice = trashedSlice.slice(0, trashedSlice.indexOf('])'));

        
let split = slice.split(' ')
        
for(let i = 0; i < split.length; i++){

if (split[i].includes(',')){
    
   let cleanStr = split[i].slice(split[i].indexOf('"')+1,split[i].lastIndexOf('"'))  
    
    
    state.push(cleanStr)

  }


}
console.log('state', state)
return state
}
      
      
      /*
      //
      data () {
        return {
          
          TestPropForImport: "PLACEHOLDER FOR VALUE",
        }
      },
      
      */

      //for state it's
      /*

      computed: {
            ...mapState([
            "TestStateForImport",
            ]),
        },
      */
     

     //for actions it's
     /*

      methods: {
        ...mapActions([
          "TestActionForImport",
          "AnotherTestAction",
          "AThirdTestAction"
        ]),
      },

     */

  
    
</script>






