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
      let vueFile = fs.readFileSync(data[0], "utf8");
      const importObj = {
        htmlList: []
      };

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
      createHTMLList(htmlList);

      function htmlParser(htmlString){
        if (!htmlString){return}
        //remove new lines and tabs from HTML
        htmlString = htmlString.replaceAll('\n', '').replaceAll('\t', '') 
        //find index for the first < and > in the string
        let openTag = htmlString.indexOf('<')
        let closeTag = htmlString.indexOf('>')

        //push the substring wrapped by < and > into the helper func
        pushElement(htmlString.substring(openTag+1, closeTag))

        //recursively call htmlParser on the remainder of the string
        return htmlParser(htmlString.substring(closeTag+1))
      }

      function pushElement(substring){
      for (const elem in htmlElementMap){
        for (let i = 0; i < htmlElementMap[elem].length; i++){
          //if the htmlElementMap[elem][index] matches the substring, push it into the output array
          if (htmlElementMap[elem][i].indexOf(substring) !== -1){
            htmlList.push(htmlElementMap[elem][i])
            break; //exit, or else div will match with /div, for example.
          }
        }
      }
      }

      function createHTMLList (htmlList){
        let currentOpen = null;
        for (let i = 0; i < htmlList.length; i++){
          const elemText = htmlList[i].substring(1,htmlList[i].length-1);
          
        }
      }

      console.log(importObj)


}
}
}

      //img, link, input do NOT need closing tags -- cannot have children either

      
      //for props, it's
      
      //Trying to target obj property without a key 
    //string.slice(indexof({),indexof(:))

      function parsingStringToProps (str){

        //Split the strings into an array
        //look for the last '{' in the string
        //look for the first ':' after the last '{'
         //save the string in between as a first prop
        
        //if after ':' there's a ',' look for ':'
         // save the string in between as a second prop

        //if after ':' there's a ',' invoke the second function in search for the third prop, etc..
         // save the string in between as third prop  
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
        ]),
      },

     */

  
    
</script>






