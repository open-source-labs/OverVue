// Helper function that recursively iterates through the given html element's children and their children's children.
// also adds proper indentation to code snippet

export default {
  methods: {
    writeNested(childrenArray, indent) {
      if (!childrenArray.length) {
        return;
      }
      let indented = indent + "  ";
      let nestedString = "";
    
      childrenArray.forEach((child) => {
        nestedString += indented;
        if (!child.text) {
          nestedString += `<${child}/>\n`;
        } 
        else {
          nestedString += htmlElementMap[child.text][0];
          if (child.class !== "") {
            nestedString += " " + "class=" + `"${child.class}"`;
          }
          if (child.binding !== "") {
            if (child.text !== 'img' || child.text !== 'link') {
              nestedString += ` v-model="${child.binding}"`
    
            }
          }

          if (child.text === "img" || child.text === "input" || child.text === "link" || childComponents.includes(child.text)) {
            nestedString += "/>";
          } 
          else { nestedString += ">"; }
    
          if (child.children.length) {
            nestedString += "\n";
            nestedString += writeNested(child.children, indented);
            nestedString += indented + htmlElementMap[child.text][1];
            nestedString += "\n"
          } 
          else {
            nestedString += htmlElementMap[child.text][1] + "\n";
          }
        }
      });
      return nestedString;
    }
  }
}
