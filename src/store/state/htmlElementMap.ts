import { HtmlElementMap } from '../../../types';

const htmlElementMap :HtmlElementMap= {
  div: ['<div>', '</div>'],
  button: ['<button>', '</button>'],
  form: ['<form>', '</form>'],
  img: ['<img>', ''],
  link: ['<a href="#"/>', ''],
  list: ['<li>', '</li>'],
  paragraph: ['<p>', '</p>'],
  'list-ol': ['<ol>', '</ol>'],
  'list-ul': ['<ul>', '</ul>'],
  input: ['<input />', ''],
  navbar: ['<nav>', '</nav>'],
  header:['<header>', '</header>'],
  footer:['<footer>', '</footer>'],
  meta: ['<meta>', '</meta>'],
  h1:['<h1>', '</h1>'],
  h2:['<h2>', '</h2>'],
  h3:['<h3>', '</h3>'],
  h4:['<h4>', '</h4>'],
  h5:['<h5>', '</h5>'],
  h6:['<h6>', '</h6>'],
  'e-button':["<el-button", "</el-button>"],
  'e-input':["<el-input", "</el-input>"],
  'e-link': [`<el-link type="primary">primary</el-link>
  <el-link type="success">success</el-link>
  <el-link type="info">info</el-link>
  <el-link type="warning">warning</el-link>
  <el-link type="danger"`, `danger</el-link>`],
  'e-form': ["<el-form", "</el-form>"],
  'e-checkbox': ["<el-checkbox", "</el-checkbox>"],
  'e-checkbox-button': ["<el-checkbox-button", "</el-checkbox-button>"],
  'e-date-picker': ["<el-date-picker", "</el-date-picker>"],
  'e-slider': ["<el-slider", "</el-slider>"],
  'e-card': ["<el-card", "</el-card>"],
  'e-alert': [`<el-alert title="success alert" type="success"></el-alert>
  <el-alert title="info alert" type="info"></el-alert>
  <el-alert title="warning alert" type="warning"></el-alert>
  <el-alert title="danger alert" type="danger"`, `</el-alert>`],
  'e-dropdown': [ `<el-dropdown split-button type="primary" @click="handleClick">
  Dropdown List
  <template #dropdown>
   <el-dropdown-menu>
    <el-dropdown-item>
    Action 1
  </el-dropdown-item>
  <el-dropdown-item>
  Action 2
</el-dropdown-item>
  </el-dropdown-menu>
  </template`, `
  </el-dropdown>`],
  'e-tag': [`<el-tag>Tag 1</el-tag>
<el-tag class="ml-2" type="success">Tag 2</el-tag>
<el-tag class="ml-2" type="info">Tag 3</el-tag>
<el-tag class="ml-2" type="warning">Tag 4</el-tag>
<el-tag class="ml-2" type="danger"`, `Tag 5</el-tag>`],

'e-badge': [`<el-badge :value="12" class="item">
<el-button>comments</el-button>
</el-badge>
<el-badge :value="3" class="item">
<el-button>replies</el-button>
</el-badge>
<el-badge :value="1" class="item" type="primary">
<el-button>comments</el-button>
</el-badge>
<el-badge :value="2" class="item" type="warning">
<el-button>replies</el-button`,
`
</el-badge>`],
};

const openHtmlElementMap :HtmlElementMap= {
  div: ['<div', '</div>'],
  button: ['<button', '</button>'],
  form: ['<form', '</form>'],
  img: ['<img', ''],
  link: ['<a href="#"/>', ''],
  list: ['<li>', '</li>'],
  paragraph: ['<p>', '</p>'],
  'list-ol': ['<ol>', '</ol>'],
  'list-ul': ['<ul>', '</ul>'],
  input: ['<input />', ''],
  navbar: ['<nav>', '</nav>'],
  header:['<header>', '</header>'],
  footer:['<footer>', '</footer>'],
  meta: ['<meta>', '</meta>'],
  h1:['<h1>', '</h1>'],
  h2:['<h2>', '</h2>'],
  h3:['<h3>', '</h3>'],
  h4:['<h4>', '</h4>'],
  h5:['<h5>', '</h5>'],
  h6:['<h6>', '</h6>'],
  'e-button':["<el-button", "</el-button>"],
  'e-input':["<el-input", "</el-input>"],
  'e-link':["<el-link", "</el-link>"],
  'e-form': ["<el-form", "</el-form>"],
  'e-checkbox': ["<el-checkbox", "</el-checkbox>"],
  'e-checkbox-button': ["<el-checkbox-button", "</el-checkbox-button>"],
  'e-date-picker': ["<el-date-picker", "</el-date-picker>"],
  'e-slider': ["<el-slider", "</el-slider>"],
  'e-card': ["<el-card", "</el-card>"],
};
export {htmlElementMap as default, openHtmlElementMap};
