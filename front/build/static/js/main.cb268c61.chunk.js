(this.webpackJsonpfront=this.webpackJsonpfront||[]).push([[0],{53:function(e,t,n){e.exports=n(89)},58:function(e,t,n){},59:function(e,t,n){},89:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(47),o=n.n(c),i=(n(58),n(4)),l=n(50);n(59),n(60);function s(){return r.a.createElement("nav",{className:"navbar is-primary",role:"navigation","aria-label":"main navigation"},r.a.createElement("div",{className:"navbar-brand"},r.a.createElement("a",{className:"navbar-item",href:"/#"},"Cycle-hunter 9000")))}var h=n(48),m=n(16),u=n.n(m);function g(e){return e.data}var d={automaticRearrangeAfterDropNode:!0,collapsible:!0,directed:!0,focusAnimationDuration:0,focusZoom:1,height:800,highlightDegree:2,highlightOpacity:1,linkHighlightBehavior:!0,maxZoom:8,minZoom:.1,nodeHighlightBehavior:!0,panAndZoom:!1,staticGraph:!1,staticGraphWithDragAndDrop:!1,width:1500,d3:{alphaTarget:.05,gravity:-200,linkLength:300,linkStrength:1,disableLinkForce:!1},node:{color:"grey",fontColor:"black",fontSize:15,fontWeight:"normal",highlightColor:"orange",highlightFontSize:8,highlightFontWeight:"normal",highlightStrokeColor:"SAME",highlightStrokeWidth:"SAME",labelProperty:"id",mouseCursor:"pointer",opacity:1,renderLabel:!0,size:100,strokeColor:"none",strokeWidth:1.5,svg:"",symbolType:"circle"},link:{color:"#d3d3d3",fontColor:"black",fontSize:8,fontWeight:"normal",highlightColor:"black",highlightFontSize:8,highlightFontWeight:"normal",labelProperty:"label",mouseCursor:"pointer",opacity:1,renderLabel:!1,semanticStrokeWidth:!1,strokeWidth:2,markerHeight:3,markerWidth:3}};var f=function(){var e=Object(a.useState)({cycles:[],graphData:{nodes:[],links:[]},description:[],show_only_new_cycles:!1}),t=Object(l.a)(e,2),n=t[0],c=t[1];Object(a.useEffect)((function(){u.a.get("/cycles").then(g).then((function(e){return c((function(t){return Object(i.a)(Object(i.a)({},t),{},{cycles:e})}))}))}),[]);var o,m,f=function(e){return{nodes:e.map((function(e){return{id:e.name}})),links:e.flatMap((function(e){return e.uses.map((function(t){return{source:e.name,target:t}}))}))}},p=function(e){var t;(t=e,u.a.get("/cycle/".concat(t)).then(g)).then(f).then((function(e){return c(Object(i.a)(Object(i.a)({},n),{},{graphData:e}))}))},b=function(){u.a.get("/graph").then(g).then(f).then((function(e){return c(Object(i.a)(Object(i.a)({},n),{},{graphData:e}))}))};return r.a.createElement("div",{className:"App"},r.a.createElement(s,null),r.a.createElement("div",{className:""},r.a.createElement("div",{className:"columns is-marginless"},r.a.createElement("div",{className:"column is-one-fifth"},r.a.createElement("div",{className:"field"},r.a.createElement("input",{type:"checkbox",checked:n.show_only_new_cycles,onChange:function(e){c((function(e){return Object(i.a)(Object(i.a)({},e),{},{show_only_new_cycles:!e.show_only_new_cycles})}))}}),r.a.createElement("label",null,"Show only new cycles")),r.a.createElement("div",{className:"list"},r.a.createElement("a",{key:"complete-graph",href:"/#",className:"list-item",onClick:function(e){return b()}},"Complete dependency graph"),(o=n.cycles,m=n.show_only_new_cycles,o.filter((function(e){return!m||e.new_cycle})).map((function(e){return r.a.createElement("a",{key:e.id,href:"/#",className:"list-item",onClick:function(t){return p(e.id)}},e.packages.length," item cycle")}))))),r.a.createElement("div",{className:"column"},0===n.graphData.nodes.length?void 0:r.a.createElement("div",{style:{border:"black",borderWidth:1,borderStyle:"dashed"}},r.a.createElement(h.Graph,{id:"cycle-graph",data:n.graphData,config:d,onClickLink:function(e,t){var a=(void 0===n.graphData.links.find((function(n){return n.source===t&&n.target===e}))?[[e,t]]:[[t,e],[e,t]]).map((function(e){return t=e[0],n=e[1],u.a.get("/imports/".concat(t,"/").concat(n)).then(g);var t,n}));Promise.all(a).then((function(e){return c(Object(i.a)(Object(i.a)({},n),{},{description:e.map((function(e){return{from:e.from,to:e.to,imports:e.imports}}))}))}))}})))),r.a.createElement("div",{className:"columns",style:{marginLeft:"auto"}},n.description.map((function(e){return r.a.createElement("div",{className:"column"},r.a.createElement("table",{className:"table"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{className:"has-text-centered"},"".concat(e.to," imports in ").concat(e.from)))),r.a.createElement("tbody",null,e.imports.map((function(e){return r.a.createElement("tr",{className:"has-text-left"},e)})))))})))))};o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(f,null)),document.getElementById("root"))}},[[53,1,2]]]);
//# sourceMappingURL=main.cb268c61.chunk.js.map