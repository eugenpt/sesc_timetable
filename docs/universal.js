const ALPHANUMERIC = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

function rand0Z () {
  return ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
}

//
function newID(start, checkfun, addfun=null, maxTries=1000) {
  let id = start || '';
  addfun = addfun || rand0Z;

  let nTries = 0;
  while (checkfun(id)) {
    id = id + addfun();
    nTries++;
    if (nTries > maxTries) {
      throw Error('newID: Maximum number of tries exceeded, check your checkfun!');
    }
  }
  return id;
}

const log = console.log;


function copy(x){
  if(Array.isArray(x)){
    return x.map(copy);
  }else if(x instanceof Object){
    var r = {};
    for(var j in x){
      r[j] = copy(x[j]);
    }
    return r;
  }else{
    return x;
  }
}

function now () {
  return new Date().getTime();
}

function int2strwz(i, length) {
  return (Array(10).join('0')+i).slice(-length);
}

function date2str(d) {
  return d.getFullYear() + ''
          + int2strwz(d.getMonth()+1,2) + ''
          + int2strwz(d.getDate(), 2) + '-'
          + int2strwz(d.getHours(), 2) + ''
          + int2strwz(d.getMinutes(), 2) + ''
          + int2strwz(d.getSeconds(), 2)
}

function arrayMapJ(a){
  const R = new Map();
  for (let j = 0 ; j < a.length ; j ++) {
    R.set(a[j], j);
  }
  return R;
}

function equalSetsOfItems(a1, a2){
  const s1 = [...arrayMapJ(a1).keys()].sort();
  const s2 = [...arrayMapJ(a2).keys()].sort();
  if( s1.length != s2.length ) {
    return false;
  }
  for( let j = 0 ; j < s1.length ; j++) {
    if (s1[j] != s2[j]) {
      return false;
    }
  }
  return true;
}

Array.prototype.contains = function(elt) {
  return this.indexOf(elt)>=0;
}

function Max() {
  var a = arguments.length==1 ? arguments[0] : arguments;
  return Math.max.apply(Math,a);
}

function Min() {
  var a = arguments.length==1 ? arguments[0] : arguments;
  return Math.min.apply(Math,a);
}

function listForEach(arr, fun){
  [].forEach.call(arr, fun);
}

function listMap(arr, fun) {
  return [].map.call(arr, fun);
}

// add map and forEach to some DOM-related array-like thingies
['map','forEach','filter'].forEach( (fun_name) => {
  [NodeList, HTMLCollection].forEach( (obj) => {
    obj.prototype[fun_name] = function(fun) { return [][fun_name].call(this, fun); };
  })
})

// if property is dot-separated (style.color for example)
//  take obj.style.color instead of just obj['style.color']
function dotProp(obj, prop){
  const propParts = prop.split('.');
  let h = obj;
  for(let propPart of propParts){
    if(!(propPart in h)){
      h[propPart] = {};
    }
    h = h[propPart];
  }
  return h;
}

function setDotProp(obj, prop, value){
  const propParts = prop.split('.');
  dotProp(obj, propParts.slice(0,-1).join('.'))[propParts[propParts.length-1]] = value;
}

// // This is fun but it's getting called by jQuery for some reason.
// Object.prototype.ep_get = function (prop) {
//   return dotProp(this, prop);
// }
// Object.prototype.ep_set = function (prop, value) {
//   return setDotProp(this, prop);
// }

function delete_defaults (obj, def) {
  const r = {};
  for (let p of Object.keys(obj)) {
    if ((def[p] === undefined) || (obj[p] !== def[p])) {
      r[p] = obj[p];
    }
  }
  return Object.keys(r).length > 0 ? r : undefined;
}

function isDotInBox(dotPos, boxPos){
  return (
    (dotPos[0] >= boxPos[0][0])
  &&(dotPos[0] <= boxPos[0][1])
  &&(dotPos[1] >= boxPos[1][0])
  &&(dotPos[1] <= boxPos[1][1])
  );
}

function min(a,b){
  return (a>b)?b:a;
}
function max(a,b){
  return (a<b)?b:a;
}

function isInBox (xMin, xMax, yMin, yMax, bxMin, bxMax, byMin, byMax) {
  if(yMin==undefined){
    const p1 = xMin;
    const p2 = xMax;
    return isInBox(
      p1[0][0],p1[1][0],p1[0][1],p1[1][1],
      p2[0][0],p2[1][0],p2[0][1],p2[1][1]
    )
  } else
  return (
     (min(xMin,xMax) <= max(bxMin,bxMax))
  && (min(yMin,yMax) <= max(byMin,byMax))
  && (max(xMin,xMax) >= min(bxMin,bxMax))
  && (max(yMin,yMax) >= min(byMin,byMax))
  );
}

__isin = (q, s) => s.indexOf(q) >= 0
__isin_all = (q, s) => q.split(' ').every(jq => __isin(jq, s))

function toStr (a) {
  return (typeof (a) === 'number')
    ? a.toExponential(2)
    : (Array.isArray(a)
        ? ('[' + a.map(toStr).join(', ') + ']')
        : ((typeof (a) === 'object')
            ? '{' + Object.keys(a).map(k => k + ':' + toStr(a[k])).join(', ') + '}'
            : a)
      );
}

function isString(obj){
  return typeof(obj) === 'string';
}

// :::::::::   ::::::::  ::::    ::::  
// :+:    :+: :+:    :+: +:+:+: :+:+:+ 
// +:+    +:+ +:+    +:+ +:+ +:+:+ +:+ 
// +#+    +:+ +#+    +:+ +#+  +:+  +#+ 
// +#+    +#+ +#+    +#+ +#+       +#+ 
// #+#    #+# #+#    #+# #+#       #+# 
// #########   ########  ###       ### 

function isDom(obj){
  return 'click' in obj
}

function ep_matchAll(r,s){
  /*
      MS Edge ..
  */
  R = [];
  t = r.exec(s);

  while(t){
      R.push(t);
      t = r.exec(s);
  }

  return R;
}

function _(s){
  var r = [document];
  var selectors = ep_matchAll(/( |[\.\#]?[^ \.\#]+)/g , s).map( (x) => x[0] )
  
  var last_space=true;
  
  for(var cur_sel of selectors){
    var sel_key = cur_sel.slice(1);
    if(cur_sel == ' '){
      last_space = true;
    }else{
      if (last_space) {
        var f =  e => e.getElementsByTagName(cur_sel) 
        if(cur_sel[0]=='.'){
          f = e => e.getElementsByClassName(sel_key);
        }else if(cur_sel[0]=='#'){
          f = e => [ e.getElementById(sel_key) ];
        } 
        r = r.map(e => [...f(e)]).flat(Infinity);
      }else{
        f =  e => e.tagName.toLowerCase() == cur_sel.toLowerCase();
        if(cur_sel[0]=='.'){
          f = e => e.classList.contains(sel_key);
        }else if(cur_sel[0]=='#'){
          f = e => e.id == sel_key;
        } else {
          // this is not really possible, right?
        }
        r = r.filter(f);
      }
      last_space = false;
    }
  }
  return ((s[0]=='#')&&(selectors.length==1)&&(r.length==1))?r[0]:r;
}


Array.prototype.last = function(){
  return this[this.length-1];
}



// create element
function _ce (tag, plopName='className', plopVal='class') {
  const elt = document.createElement(tag);
  for (let j = 1; j < arguments.length; j += 2) {
    if (arguments[j] in elt){
      elt[arguments[j]] = arguments[j + 1];
    }else{
      setDotProp(elt, arguments[j], arguments[j + 1]);
    }
  }
  return elt;
}


const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  el.style.opacity = 0;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

// https://gist.github.com/simondahla/0c324ba8e6ed36055787
function addOnContentChange (elt, fun) {
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  // Options for the observer (which mutations to observe)
  const config = {
    // attributes: true,
    childList: true,
    subtree: true
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(fun);

  // Start observing the target node for configured mutations
  observer.observe(elt, config);
  return observer;
}

function download (filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
