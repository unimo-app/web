(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[943],{3262:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/android",function(){return n(4104)}])},4104:function(e,t,n){"use strict";n.r(t),n.d(t,{crypto:function(){return r},default:function(){return u}});var o,i=n(5893),l=n(9743),d=n(9153),a=n(7294),c=n(8743),s=n.n(c);let r=null===(o=n.g.window)||void 0===o?void 0:o.crypto;function u(){let e,t;let o=(0,l.wI)({data:[]}),c=(0,l.ms)(o);if(!r)try{r=n(2474).webcrypto}catch(e){logger.error("Failed to load webcrypto",e)}let u=!1,p=!1,w=null,m=!1,f=(e,n)=>{let i=Date.now();o.data.push({type:e,content:n,timestamp:i,deviceId:t})},y=()=>{o.data.splice(0,o.data.length)},g=async()=>{m||(m=!0,window.addEntry=f,window.wipe=y,console.log=e=>{let t=document.createElement("li"),n=document.createTextNode(e);t.appendChild(n),document.getElementById("myList").appendChild(t)},console.error=e=>{let t=document.createElement("li"),n=document.createTextNode(e);t.appendChild(n),t.style.color="red",document.getElementById("myList").appendChild(t)},console.log("login: "+u),console.log("token: "+p),e=new d.XM(c,w,{type:"alias",alias:"#test_public_plain:synapse.nas.s4fu.com"}),await e.initialize(),t=w.getDeviceId(),console.log("dump:"+JSON.stringify(o.data.toJSON(),null,2)),c.on("update",e=>{console.log("update"),console.log("dump:"+JSON.stringify(o.data.toJSON(),null,2))}))};return(0,a.useEffect)(()=>{let e=new URLSearchParams(window.location.search);u=e.get("login"),p=e.get("token"),u&&p&&(w=s().createClient({baseUrl:"https://synapse.nas.s4fu.com",deviceId:"android-webview_"+u,accessToken:p,userId:"@"+u+":synapse.nas.s4fu.com",isVoipWithNoMediaAllowed:!1}),g().catch(console.error))},[]),(0,i.jsxs)("div",{children:["Android",(0,i.jsx)("ul",{id:"myList"})]})}},2361:function(){},4616:function(){}},function(e){e.O(0,[440,708,714,189,662,479,17,882,774,888,179],function(){return e(e.s=3262)}),_N_E=e.O()}]);