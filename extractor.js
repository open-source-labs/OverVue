// This file defines extractor functionality that targets the files of an imported component library, generates an array of file paths to each vue component, and parses each component to generate an import object compatible with createComponent

// parsing implementation in progress 


// importing parseComponent from npm package
const { parseComponent } = require("vue-sfc-parser");
// https://www.npmjs.com/package/vue-sfc-parser
const fs = require("fs");
const path = require("path");

// generate an array of file objects that are either files or directories (folders) with files
// input: root directory of component library, empty result arr
// output: arr of objects (tree data structure)

const getFullDirectory = function(dir, result = []) {
  // list files in component library directory and loop through
  fs.readdirSync(dir).forEach((file) => {
    // builds full path of file
    const fPath = path.resolve(dir, file);

    // prepare stats obj
    const fileStats = { file, path: fPath };

    // is the file a directory ?
    // if yes, traverse it also, if no just add it to the result
    if (fs.statSync(fPath).isDirectory()) {
      fileStats.type = "dir";
      fileStats.files = [];
      result.push(fileStats);
      return getFullDirectory(fPath, fileStats.files);
    }

    fileStats.type = "file";
    result.push(fileStats);
  });
  // returns an array of file objects that are either files, or directories with files inside
  return result;
};


// collect all file paths nested in full directory tree that end with extension .vue

// const extractFilePaths = ({ dirArray = [], collection = [], target = ".vue" }) => {
//   for (let i = 0; i < dirArray.length; i++) {
//     if (dirArray[i].type === "dir") {
//       extractFilePaths({ dirArray: dirArray[i].files, collection, target });
//     } else if (dirArray[i].file.endsWith(target)) {
//       collection.push(dirArray[i].path);
//     }
//   }
//   return collection;
// }

const getFilePathsByExtension = (dirArray, collection = [], extension = ".vue") => {
  for (let i = 0; i < dirArray.length; i++) {
    if (dirArray[i].type === "dir") {
      getFilePathsByExtension(dirArray[i].files, collection, extension);
    } else if (dirArray[i].file.endsWith(extension)) {
      collection.push(dirArray[i].path);
    }
  }

  //return arr of strings representing file path names
  return collection;
};

// returns [ 'users/emma/yadda/yadda/button.vue', 'users/emma/yadda/yadda/button.vue' ]

// parseVueFile => parse the view file
// generateImportObj => call parseVueFile on every string in collection
// NOTE: if want to expand logic here to allow for other libraries, change package name to name of that libary; look at for stretch goal

const getVueFiles = (package = "iview") => {
  const rootDir = path.join(__dirname, "node_modules", package);
  //invoke getFullDirectory with root directory of package
  const fullDirectory = getFullDirectory(rootDir);
  //invoke getFilePathsByExtension with fullDirectory
  const vueFilePathList = getFilePathsByExtension(fullDirectory);
  return vueFilePathList;
};

console.log(getVueFiles());

//work with documentation for parse vue to work out how to use this
function parseVueFile(path) {
  const fileContents = fs.readFileSync(path).toString();
  const parsedFile = parseComponent(fileContents);
  return parsedFile
}

console.log(parseVueFile(getVueFiles()[0]))

function generateImportObjs(pathList) { // or something
  // iterate through paths
  // parse each file
  // extract necessary html / js stuff for importObj
    //necessary info:
      // component name
      // boilerplate properties for each component upon creation
    // const component = {
    //   x: 0,
    //   y: 20,
    //   z: 0,
    //   w: 200,
    //   h: 200,
    //   htmlList: this.selectedElementList, //htmlList ask Alex
    //   noteList: [],
    //   children: [],
    //   actions: [],
    //   props: [],
    //   state: [],
    //   parent: {},
    //   isActive: false,
    //   idDrag: '',
    //   idDrop: '',
    //   color: "#ffffff85",
    //   htmlAttributes: {
    //     class: "",
    //     id: ""
    //   }
    // };
  // return an array of importObjs with default settings, names, etc
}

// might need to shift away from component name to unique id

// call parseVueFile on every file
// const html = parseHTML(parsedFile);
// const js = parseJS(parsedFile);

// return vueFilePathList;
