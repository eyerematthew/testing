exports.id=5827,exports.ids=[5827],exports.modules={1147:(t,e,i)=>{"use strict";let r=i(57225),o=i(51745);e.read=function(t,e){return r(t,e||{})},e.write=function(t,e){return o(t,e)}},5487:(t,e,i)=>{let r=i(7266);function o(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}o.prototype.initialize=function(t){this.degree=t,this.genPoly=r.generateECPolynomial(this.degree)},o.prototype.encode=function(t){if(!this.genPoly)throw Error("Encoder not initialized");let e=new Uint8Array(t.length+this.degree);e.set(t);let i=r.mod(e,this.genPoly),o=this.degree-i.length;if(o>0){let t=new Uint8Array(this.degree);return t.set(i,o),t}return i},t.exports=o},7266:(t,e,i)=>{let r=i(55176);e.mul=function(t,e){let i=new Uint8Array(t.length+e.length-1);for(let o=0;o<t.length;o++)for(let n=0;n<e.length;n++)i[o+n]^=r.mul(t[o],e[n]);return i},e.mod=function(t,e){let i=new Uint8Array(t);for(;i.length-e.length>=0;){let t=i[0];for(let o=0;o<e.length;o++)i[o]^=r.mul(e[o],t);let o=0;for(;o<i.length&&0===i[o];)o++;i=i.slice(o)}return i},e.generateECPolynomial=function(t){let i=new Uint8Array([1]);for(let o=0;o<t;o++)i=e.mul(i,new Uint8Array([1,r.exp(o)]));return i}},9066:t=>{"use strict";let e=[];!function(){for(let t=0;t<256;t++){let i=t;for(let t=0;t<8;t++)1&i?i=0xedb88320^i>>>1:i>>>=1;e[t]=i}}();let i=t.exports=function(){this._crc=-1};i.prototype.write=function(t){for(let i=0;i<t.length;i++)this._crc=e[(this._crc^t[i])&255]^this._crc>>>8;return!0},i.prototype.crc32=function(){return -1^this._crc},i.crc32=function(t){let i=-1;for(let r=0;r<t.length;r++)i=e[(i^t[r])&255]^i>>>8;return -1^i}},9184:(t,e,i)=>{"use strict";t.exports=i(73805)},9378:(t,e,i)=>{let r=i(74887),o=i(82951);function n(t){this.mode=r.KANJI,this.data=t}n.getBitsLength=function(t){return 13*t},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(t){let e;for(e=0;e<this.data.length;e++){let i=o.toSJIS(this.data[e]);if(i>=33088&&i<=40956)i-=33088;else if(i>=57408&&i<=60351)i-=49472;else throw Error("Invalid SJIS character: "+this.data[e]+"\nMake sure your charset is UTF-8");i=(i>>>8&255)*192+(255&i),t.put(i,13)}},t.exports=n},10656:(t,e,i)=>{"use strict";let r=i(28354),o=i(74075),n=i(29449),a=i(23711),s=i(99705),l=i(32825),c=i(35978),u=t.exports=function(t){n.call(this),this._parser=new s(t,{read:this.read.bind(this),error:this._handleError.bind(this),metadata:this._handleMetaData.bind(this),gamma:this.emit.bind(this,"gamma"),palette:this._handlePalette.bind(this),transColor:this._handleTransColor.bind(this),finished:this._finished.bind(this),inflateData:this._inflateData.bind(this),simpleTransparency:this._simpleTransparency.bind(this),headersFinished:this._headersFinished.bind(this)}),this._options=t,this.writable=!0,this._parser.start()};r.inherits(u,n),u.prototype._handleError=function(t){this.emit("error",t),this.writable=!1,this.destroy(),this._inflate&&this._inflate.destroy&&this._inflate.destroy(),this._filter&&(this._filter.destroy(),this._filter.on("error",function(){})),this.errord=!0},u.prototype._inflateData=function(t){if(!this._inflate)if(this._bitmapInfo.interlace)this._inflate=o.createInflate(),this._inflate.on("error",this.emit.bind(this,"error")),this._filter.on("complete",this._complete.bind(this)),this._inflate.pipe(this._filter);else{let t=((this._bitmapInfo.width*this._bitmapInfo.bpp*this._bitmapInfo.depth+7>>3)+1)*this._bitmapInfo.height,e=Math.max(t,o.Z_MIN_CHUNK);this._inflate=o.createInflate({chunkSize:e});let i=t,r=this.emit.bind(this,"error");this._inflate.on("error",function(t){i&&r(t)}),this._filter.on("complete",this._complete.bind(this));let n=this._filter.write.bind(this._filter);this._inflate.on("data",function(t){i&&(t.length>i&&(t=t.slice(0,i)),i-=t.length,n(t))}),this._inflate.on("end",this._filter.end.bind(this._filter))}this._inflate.write(t)},u.prototype._handleMetaData=function(t){this._metaData=t,this._bitmapInfo=Object.create(t),this._filter=new a(this._bitmapInfo)},u.prototype._handleTransColor=function(t){this._bitmapInfo.transColor=t},u.prototype._handlePalette=function(t){this._bitmapInfo.palette=t},u.prototype._simpleTransparency=function(){this._metaData.alpha=!0},u.prototype._headersFinished=function(){this.emit("metadata",this._metaData)},u.prototype._finished=function(){this.errord||(this._inflate?this._inflate.end():this.emit("error","No Inflate block"))},u.prototype._complete=function(t){let e;if(!this.errord){try{let i=l.dataToBitMap(t,this._bitmapInfo);e=c(i,this._bitmapInfo),i=null}catch(t){this._handleError(t);return}this.emit("parsed",e)}}},10849:(t,e,i)=>{let r=i(22943);function o(t,e){let i=t.a/255,r=e+'="'+t.hex+'"';return i<1?r+" "+e+'-opacity="'+i.toFixed(2).slice(1)+'"':r}function n(t,e,i){let r=t+e;return void 0!==i&&(r+=" "+i),r}e.render=function(t,e,i){let a=r.getOptions(e),s=t.modules.size,l=t.modules.data,c=s+2*a.margin,u=a.color.light.a?"<path "+o(a.color.light,"fill")+' d="M0 0h'+c+"v"+c+'H0z"/>':"",d="<path "+o(a.color.dark,"stroke")+' d="'+function(t,e,i){let r="",o=0,a=!1,s=0;for(let l=0;l<t.length;l++){let c=Math.floor(l%e),u=Math.floor(l/e);c||a||(a=!0),t[l]?(s++,l>0&&c>0&&t[l-1]||(r+=a?n("M",c+i,.5+u+i):n("m",o,0),o=0,a=!1),c+1<e&&t[l+1]||(r+=n("h",s),s=0)):o++}return r}(l,s,a.margin)+'"/>',h='<svg xmlns="http://www.w3.org/2000/svg" '+(a.width?'width="'+a.width+'" height="'+a.width+'" ':"")+('viewBox="0 0 '+c+" ")+c+'" shape-rendering="crispEdges">'+u+d+"</svg>\n";return"function"==typeof i&&i(null,h),h}},13657:(t,e)=>{"use strict";let i=[{x:[0],y:[0]},{x:[4],y:[0]},{x:[0,4],y:[4]},{x:[2,6],y:[0,4]},{x:[0,2,4,6],y:[2,6]},{x:[1,3,5,7],y:[0,2,4,6]},{x:[0,1,2,3,4,5,6,7],y:[1,3,5,7]}];e.getImagePasses=function(t,e){let r=[],o=t%8,n=e%8,a=(t-o)/8,s=(e-n)/8;for(let t=0;t<i.length;t++){let e=i[t],l=a*e.x.length,c=s*e.y.length;for(let t=0;t<e.x.length;t++)if(e.x[t]<o)l++;else break;for(let t=0;t<e.y.length;t++)if(e.y[t]<n)c++;else break;l>0&&c>0&&r.push({width:l,height:c,index:t})}return r},e.getInterlaceIterator=function(t){return function(e,r,o){let n=e%i[o].x.length,a=(e-n)/i[o].x.length*8+i[o].x[n],s=r%i[o].y.length;return 4*a+((r-s)/i[o].y.length*8+i[o].y[s])*t*4}}},14268:(t,e,i)=>{let r=i(22943);e.render=function(t,e,i){var o;let n=i,a=e;void 0!==n||e&&e.getContext||(n=e,e=void 0),e||(a=function(){try{return document.createElement("canvas")}catch(t){throw Error("You need to specify a canvas element")}}()),n=r.getOptions(n);let s=r.getImageWidth(t.modules.size,n),l=a.getContext("2d"),c=l.createImageData(s,s);return r.qrToImageData(c.data,t,n),o=a,l.clearRect(0,0,o.width,o.height),o.style||(o.style={}),o.height=s,o.width=s,o.style.height=s+"px",o.style.width=s+"px",l.putImageData(c,0,0),a},e.renderToDataURL=function(t,i,r){let o=r;void 0!==o||i&&i.getContext||(o=i,i=void 0),o||(o={});let n=e.render(t,i,o),a=o.type||"image/png",s=o.rendererOpts||{};return n.toDataURL(a,s.quality)}},15204:(t,e,i)=>{e.render=i(10849).render,e.renderToFile=function(t,r,o,n){void 0===n&&(n=o,o=void 0);let a=i(29021),s=e.render(r,o);a.writeFile(t,'<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'+s,n)}},16708:(t,e,i)=>{let r=i(94710),o=i(90678),n=i(14268),a=i(10849);function s(t,e,i,n,a){let s=[].slice.call(arguments,1),l=s.length,c="function"==typeof s[l-1];if(!c&&!r())throw Error("Callback required as last argument");if(c){if(l<2)throw Error("Too few arguments provided");2===l?(a=i,i=e,e=n=void 0):3===l&&(e.getContext&&void 0===a?(a=n,n=void 0):(a=n,n=i,i=e,e=void 0))}else{if(l<1)throw Error("Too few arguments provided");return 1===l?(i=e,e=n=void 0):2!==l||e.getContext||(n=i,i=e,e=void 0),new Promise(function(r,a){try{let a=o.create(i,n);r(t(a,e,n))}catch(t){a(t)}})}try{let r=o.create(i,n);a(null,t(r,e,n))}catch(t){a(t)}}o.create,e.toCanvas=s.bind(null,n.render),s.bind(null,n.renderToDataURL),s.bind(null,function(t,e,i){return a.render(t,i)})},22943:(t,e)=>{function i(t){if("number"==typeof t&&(t=t.toString()),"string"!=typeof t)throw Error("Color should be defined as hex string");let e=t.slice().replace("#","").split("");if(e.length<3||5===e.length||e.length>8)throw Error("Invalid hex color: "+t);(3===e.length||4===e.length)&&(e=Array.prototype.concat.apply([],e.map(function(t){return[t,t]}))),6===e.length&&e.push("F","F");let i=parseInt(e.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:255&i,hex:"#"+e.slice(0,6).join("")}}e.getOptions=function(t){t||(t={}),t.color||(t.color={});let e=void 0===t.margin||null===t.margin||t.margin<0?4:t.margin,r=t.width&&t.width>=21?t.width:void 0,o=t.scale||4;return{width:r,scale:r?4:o,margin:e,color:{dark:i(t.color.dark||"#000000ff"),light:i(t.color.light||"#ffffffff")},type:t.type,rendererOpts:t.rendererOpts||{}}},e.getScale=function(t,e){return e.width&&e.width>=t+2*e.margin?e.width/(t+2*e.margin):e.scale},e.getImageWidth=function(t,i){let r=e.getScale(t,i);return Math.floor((t+2*i.margin)*r)},e.qrToImageData=function(t,i,r){let o=i.modules.size,n=i.modules.data,a=e.getScale(o,r),s=Math.floor((o+2*r.margin)*a),l=r.margin*a,c=[r.color.light,r.color.dark];for(let e=0;e<s;e++)for(let i=0;i<s;i++){let u=(e*s+i)*4,d=r.color.light;e>=l&&i>=l&&e<s-l&&i<s-l&&(d=c[+!!n[Math.floor((e-l)/a)*o+Math.floor((i-l)/a)]]),t[u++]=d.r,t[u++]=d.g,t[u++]=d.b,t[u]=d.a}}},22948:(t,e,i)=>{let r=i(82951),o=r.getBCHDigit(1335);e.getEncodedBits=function(t,e){let i=t.bit<<3|e,n=i<<10;for(;r.getBCHDigit(n)-o>=0;)n^=1335<<r.getBCHDigit(n)-o;return(i<<10|n)^21522}},23711:(t,e,i)=>{"use strict";let r=i(28354),o=i(29449),n=i(38578),a=t.exports=function(t){o.call(this);let e=[],i=this;this._filter=new n(t,{read:this.read.bind(this),write:function(t){e.push(t)},complete:function(){i.emit("complete",Buffer.concat(e))}}),this._filter.start()};r.inherits(a,o)},24539:(t,e)=>{e.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}},25579:(t,e,i)=>{let r=i(87134),o=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],n=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];e.getBlocksCount=function(t,e){switch(e){case r.L:return o[(t-1)*4+0];case r.M:return o[(t-1)*4+1];case r.Q:return o[(t-1)*4+2];case r.H:return o[(t-1)*4+3];default:return}},e.getTotalCodewordsCount=function(t,e){switch(e){case r.L:return n[(t-1)*4+0];case r.M:return n[(t-1)*4+1];case r.Q:return n[(t-1)*4+2];case r.H:return n[(t-1)*4+3];default:return}}},27237:t=>{"use strict";let e=t.exports=function(t){this._buffer=t,this._reads=[]};e.prototype.read=function(t,e){this._reads.push({length:Math.abs(t),allowLess:t<0,func:e})},e.prototype.process=function(){for(;this._reads.length>0&&this._buffer.length;){let t=this._reads[0];if(this._buffer.length&&(this._buffer.length>=t.length||t.allowLess)){this._reads.shift();let e=this._buffer;this._buffer=e.slice(t.length),t.func.call(this,e.slice(0,t.length))}else break}return this._reads.length>0?Error("There are some read requests waitng on finished stream"):this._buffer.length>0?Error("unrecognised content at end of stream"):void 0}},27620:t=>{function e(){this.buffer=[],this.length=0}e.prototype={get:function(t){let e=Math.floor(t/8);return(this.buffer[e]>>>7-t%8&1)==1},put:function(t,e){for(let i=0;i<e;i++)this.putBit((t>>>e-i-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(t){let e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},t.exports=e},29449:(t,e,i)=>{"use strict";let r=i(28354),o=i(27910),n=t.exports=function(){o.call(this),this._buffers=[],this._buffered=0,this._reads=[],this._paused=!1,this._encoding="utf8",this.writable=!0};r.inherits(n,o),n.prototype.read=function(t,e){this._reads.push({length:Math.abs(t),allowLess:t<0,func:e}),process.nextTick((function(){this._process(),this._paused&&this._reads&&this._reads.length>0&&(this._paused=!1,this.emit("drain"))}).bind(this))},n.prototype.write=function(t,e){let i;return this.writable?(i=Buffer.isBuffer(t)?t:Buffer.from(t,e||this._encoding),this._buffers.push(i),this._buffered+=i.length,this._process(),this._reads&&0===this._reads.length&&(this._paused=!0),this.writable&&!this._paused):(this.emit("error",Error("Stream not writable")),!1)},n.prototype.end=function(t,e){t&&this.write(t,e),this.writable=!1,this._buffers&&(0===this._buffers.length?this._end():(this._buffers.push(null),this._process()))},n.prototype.destroySoon=n.prototype.end,n.prototype._end=function(){this._reads.length>0&&this.emit("error",Error("Unexpected end of input")),this.destroy()},n.prototype.destroy=function(){this._buffers&&(this.writable=!1,this._reads=null,this._buffers=null,this.emit("close"))},n.prototype._processReadAllowingLess=function(t){this._reads.shift();let e=this._buffers[0];e.length>t.length?(this._buffered-=t.length,this._buffers[0]=e.slice(t.length),t.func.call(this,e.slice(0,t.length))):(this._buffered-=e.length,this._buffers.shift(),t.func.call(this,e))},n.prototype._processRead=function(t){this._reads.shift();let e=0,i=0,r=Buffer.alloc(t.length);for(;e<t.length;){let o=this._buffers[i++],n=Math.min(o.length,t.length-e);o.copy(r,e,0,n),e+=n,n!==o.length&&(this._buffers[--i]=o.slice(n))}i>0&&this._buffers.splice(0,i),this._buffered-=t.length,t.func.call(this,r)},n.prototype._process=function(){try{for(;this._buffered>0&&this._reads&&this._reads.length>0;){let t=this._reads[0];if(t.allowLess)this._processReadAllowingLess(t);else if(this._buffered>=t.length)this._processRead(t);else break}this._buffers&&!this.writable&&this._end()}catch(t){this.emit("error",t)}}},29636:(t,e,i)=>{let r=i(74887),o=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function n(t){this.mode=r.ALPHANUMERIC,this.data=t}n.getBitsLength=function(t){return 11*Math.floor(t/2)+t%2*6},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let i=45*o.indexOf(this.data[e]);i+=o.indexOf(this.data[e+1]),t.put(i,11)}this.data.length%2&&t.put(o.indexOf(this.data[e]),6)},t.exports=n},29913:t=>{"use strict";var e={single_source_shortest_paths:function(t,i,r){var o,n,a,s,l,c,u,d={},h={};h[i]=0;var p=e.PriorityQueue.make();for(p.push(i,0);!p.empty();)for(a in n=(o=p.pop()).value,s=o.cost,l=t[n]||{})l.hasOwnProperty(a)&&(c=s+l[a],u=h[a],(void 0===h[a]||u>c)&&(h[a]=c,p.push(a,c),d[a]=n));if(void 0!==r&&void 0===h[r])throw Error(["Could not find a path from ",i," to ",r,"."].join(""));return d},extract_shortest_path_from_predecessor_list:function(t,e){for(var i=[],r=e;r;)i.push(r),t[r],r=t[r];return i.reverse(),i},find_path:function(t,i,r){var o=e.single_source_shortest_paths(t,i,r);return e.extract_shortest_path_from_predecessor_list(o,r)},PriorityQueue:{make:function(t){var i,r=e.PriorityQueue,o={};for(i in t=t||{},r)r.hasOwnProperty(i)&&(o[i]=r[i]);return o.queue=[],o.sorter=t.sorter||r.default_sorter,o},default_sorter:function(t,e){return t.cost-e.cost},push:function(t,e){this.queue.push({value:t,cost:e}),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return 0===this.queue.length}}};t.exports=e},31047:(t,e,i)=>{let r=i(75043),o=i(74887);function n(t){this.mode=o.BYTE,"string"==typeof t&&(t=r(t)),this.data=new Uint8Array(t)}n.getBitsLength=function(t){return 8*t},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(t){for(let e=0,i=this.data.length;e<i;e++)t.put(this.data[e],8)},t.exports=n},32825:(t,e,i)=>{"use strict";let r=i(13657),o=[function(){},function(t,e,i,r){if(r===e.length)throw Error("Ran out of data");let o=e[r];t[i]=o,t[i+1]=o,t[i+2]=o,t[i+3]=255},function(t,e,i,r){if(r+1>=e.length)throw Error("Ran out of data");let o=e[r];t[i]=o,t[i+1]=o,t[i+2]=o,t[i+3]=e[r+1]},function(t,e,i,r){if(r+2>=e.length)throw Error("Ran out of data");t[i]=e[r],t[i+1]=e[r+1],t[i+2]=e[r+2],t[i+3]=255},function(t,e,i,r){if(r+3>=e.length)throw Error("Ran out of data");t[i]=e[r],t[i+1]=e[r+1],t[i+2]=e[r+2],t[i+3]=e[r+3]}],n=[function(){},function(t,e,i,r){let o=e[0];t[i]=o,t[i+1]=o,t[i+2]=o,t[i+3]=r},function(t,e,i){let r=e[0];t[i]=r,t[i+1]=r,t[i+2]=r,t[i+3]=e[1]},function(t,e,i,r){t[i]=e[0],t[i+1]=e[1],t[i+2]=e[2],t[i+3]=r},function(t,e,i){t[i]=e[0],t[i+1]=e[1],t[i+2]=e[2],t[i+3]=e[3]}];e.dataToBitMap=function(t,e){let i,a,s,l,c=e.width,u=e.height,d=e.depth,h=e.bpp,p=e.interlace;if(8!==d){let e,r;e=[],r=0,i={get:function(i){for(;e.length<i;)!function(){let i,o,n,a;if(r===t.length)throw Error("Ran out of data");let s=t[r];switch(r++,d){default:throw Error("unrecognised depth");case 16:n=t[r],r++,e.push((s<<8)+n);break;case 4:n=15&s,a=s>>4,e.push(a,n);break;case 2:i=3&s,o=s>>2&3,n=s>>4&3,a=s>>6&3,e.push(a,n,o,i);break;case 1:i=s>>4&1,o=s>>5&1,n=s>>6&1,a=s>>7&1,e.push(a,n,o,i,s>>3&1,s>>2&1,s>>1&1,1&s)}}();let o=e.slice(0,i);return e=e.slice(i),o},resetAfterLine:function(){e.length=0},end:function(){if(r!==t.length)throw Error("extra data found")}}}a=d<=8?Buffer.alloc(c*u*4):new Uint16Array(c*u*4);let f=Math.pow(2,d)-1,g=0;if(p)s=r.getImagePasses(c,u),l=r.getInterlaceIterator(c,u);else{let t=0;l=function(){let e=t;return t+=4,e},s=[{width:c,height:u}]}for(let e=0;e<s.length;e++)8===d?g=function(t,e,i,r,n,a){let s=t.width,l=t.height,c=t.index;for(let t=0;t<l;t++)for(let l=0;l<s;l++){let s=i(l,t,c);o[r](e,n,s,a),a+=r}return a}(s[e],a,l,h,t,g):function(t,e,i,r,o,a){let s=t.width,l=t.height,c=t.index;for(let t=0;t<l;t++){for(let l=0;l<s;l++){let s=o.get(r),u=i(l,t,c);n[r](e,s,u,a)}o.resetAfterLine()}}(s[e],a,l,h,i,f);if(8===d){if(g!==t.length)throw Error("extra data found")}else i.end();return a}},35978:t=>{"use strict";t.exports=function(t,e){let i=e.depth,r=e.width,o=e.height,n=e.colorType,a=e.transColor,s=e.palette,l=t;return 3===n?function(t,e,i,r,o){let n=0;for(let a=0;a<r;a++)for(let r=0;r<i;r++){let i=o[t[n]];if(!i)throw Error("index "+t[n]+" not in palette");for(let t=0;t<4;t++)e[n+t]=i[t];n+=4}}(t,l,r,o,s):(a&&function(t,e,i,r,o){let n=0;for(let a=0;a<r;a++)for(let r=0;r<i;r++){let i=!1;if(1===o.length?o[0]===t[n]&&(i=!0):o[0]===t[n]&&o[1]===t[n+1]&&o[2]===t[n+2]&&(i=!0),i)for(let t=0;t<4;t++)e[n+t]=0;n+=4}}(t,l,r,o,a),8!==i&&(16===i&&(l=Buffer.alloc(r*o*4)),function(t,e,i,r,o){let n=Math.pow(2,o)-1,a=0;for(let o=0;o<r;o++)for(let r=0;r<i;r++){for(let i=0;i<4;i++)e[a+i]=Math.floor(255*t[a+i]/n+.5);a+=4}}(t,l,r,o,i))),l}},37267:(t,e,i)=>{"use strict";let r=i(28354),o=i(27910),n=i(10656),a=i(48417),s=i(1147),l=e.O=function(t){o.call(this),t=t||{},this.width=0|t.width,this.height=0|t.height,this.data=this.width>0&&this.height>0?Buffer.alloc(4*this.width*this.height):null,t.fill&&this.data&&this.data.fill(0),this.gamma=0,this.readable=this.writable=!0,this._parser=new n(t),this._parser.on("error",this.emit.bind(this,"error")),this._parser.on("close",this._handleClose.bind(this)),this._parser.on("metadata",this._metadata.bind(this)),this._parser.on("gamma",this._gamma.bind(this)),this._parser.on("parsed",(function(t){this.data=t,this.emit("parsed",t)}).bind(this)),this._packer=new a(t),this._packer.on("data",this.emit.bind(this,"data")),this._packer.on("end",this.emit.bind(this,"end")),this._parser.on("close",this._handleClose.bind(this)),this._packer.on("error",this.emit.bind(this,"error"))};r.inherits(l,o),l.sync=s,l.prototype.pack=function(){return this.data&&this.data.length?process.nextTick((function(){this._packer.pack(this.data,this.width,this.height,this.gamma)}).bind(this)):this.emit("error","No data provided"),this},l.prototype.parse=function(t,e){if(e){let t,i;t=(function(t){this.removeListener("error",i),this.data=t,e(null,this)}).bind(this),i=(function(i){this.removeListener("parsed",t),e(i,null)}).bind(this),this.once("parsed",t),this.once("error",i)}return this.end(t),this},l.prototype.write=function(t){return this._parser.write(t),!0},l.prototype.end=function(t){this._parser.end(t)},l.prototype._metadata=function(t){this.width=t.width,this.height=t.height,this.emit("metadata",t)},l.prototype._gamma=function(t){this.gamma=t},l.prototype._handleClose=function(){this._parser.writable||this._packer.readable||this.emit("close")},l.bitblt=function(t,e,i,r,o,n,a,s){if(r|=0,o|=0,n|=0,a|=0,s|=0,(i|=0)>t.width||r>t.height||i+o>t.width||r+n>t.height)throw Error("bitblt reading outside image");if(a>e.width||s>e.height||a+o>e.width||s+n>e.height)throw Error("bitblt writing outside image");for(let l=0;l<n;l++)t.data.copy(e.data,(s+l)*e.width+a<<2,(r+l)*t.width+i<<2,(r+l)*t.width+i+o<<2)},l.prototype.bitblt=function(t,e,i,r,o,n,a){return l.bitblt(this,t,e,i,r,o,n,a),this},l.adjustGamma=function(t){if(t.gamma){for(let e=0;e<t.height;e++)for(let i=0;i<t.width;i++){let r=t.width*e+i<<2;for(let e=0;e<3;e++){let i=t.data[r+e]/255;i=Math.pow(i,1/2.2/t.gamma),t.data[r+e]=Math.round(255*i)}}t.gamma=0}},l.prototype.adjustGamma=function(){l.adjustGamma(this)}},38578:(t,e,i)=>{"use strict";let r=i(13657),o=i(81031);function n(t,e,i){let r=t*e;return 8!==i&&(r=Math.ceil(r/(8/i))),r}let a=t.exports=function(t,e){let i=t.width,o=t.height,a=t.interlace,s=t.bpp,l=t.depth;if(this.read=e.read,this.write=e.write,this.complete=e.complete,this._imageIndex=0,this._images=[],a){let t=r.getImagePasses(i,o);for(let e=0;e<t.length;e++)this._images.push({byteWidth:n(t[e].width,s,l),height:t[e].height,lineIndex:0})}else this._images.push({byteWidth:n(i,s,l),height:o,lineIndex:0});8===l?this._xComparison=s:16===l?this._xComparison=2*s:this._xComparison=1};a.prototype.start=function(){this.read(this._images[this._imageIndex].byteWidth+1,this._reverseFilterLine.bind(this))},a.prototype._unFilterType1=function(t,e,i){let r=this._xComparison,o=r-1;for(let n=0;n<i;n++){let i=t[1+n],a=n>o?e[n-r]:0;e[n]=i+a}},a.prototype._unFilterType2=function(t,e,i){let r=this._lastLine;for(let o=0;o<i;o++){let i=t[1+o],n=r?r[o]:0;e[o]=i+n}},a.prototype._unFilterType3=function(t,e,i){let r=this._xComparison,o=r-1,n=this._lastLine;for(let a=0;a<i;a++){let i=t[1+a],s=n?n[a]:0,l=Math.floor(((a>o?e[a-r]:0)+s)/2);e[a]=i+l}},a.prototype._unFilterType4=function(t,e,i){let r=this._xComparison,n=r-1,a=this._lastLine;for(let s=0;s<i;s++){let i=t[1+s],l=a?a[s]:0,c=o(s>n?e[s-r]:0,l,s>n&&a?a[s-r]:0);e[s]=i+c}},a.prototype._reverseFilterLine=function(t){let e,i=t[0],r=this._images[this._imageIndex],o=r.byteWidth;if(0===i)e=t.slice(1,o+1);else switch(e=Buffer.alloc(o),i){case 1:this._unFilterType1(t,e,o);break;case 2:this._unFilterType2(t,e,o);break;case 3:this._unFilterType3(t,e,o);break;case 4:this._unFilterType4(t,e,o);break;default:throw Error("Unrecognised filter type - "+i)}this.write(e),r.lineIndex++,r.lineIndex>=r.height?(this._lastLine=null,this._imageIndex++,r=this._images[this._imageIndex]):this._lastLine=e,r?this.read(r.byteWidth+1,this._reverseFilterLine.bind(this)):(this._lastLine=null,this.complete())}},38891:(t,e,i)=>{"use strict";let r=i(12412).ok,o=i(74075),n=i(28354),a=i(79428).kMaxLength;function s(t){if(!(this instanceof s))return new s(t);t&&t.chunkSize<o.Z_MIN_CHUNK&&(t.chunkSize=o.Z_MIN_CHUNK),o.Inflate.call(this,t),this._offset=void 0===this._offset?this._outOffset:this._offset,this._buffer=this._buffer||this._outBuffer,t&&null!=t.maxLength&&(this._maxLength=t.maxLength)}function l(t,e){e&&process.nextTick(e),t._handle&&(t._handle.close(),t._handle=null)}function c(t,e){var i=new s(e),r=t;if("string"==typeof r&&(r=Buffer.from(r)),!(r instanceof Buffer))throw TypeError("Not a string or buffer");let n=i._finishFlushFlag;return null==n&&(n=o.Z_FINISH),i._processChunk(r,n)}s.prototype._processChunk=function(t,e,i){let n,s;if("function"==typeof i)return o.Inflate._processChunk.call(this,t,e,i);let c=this,u=t&&t.length,d=this._chunkSize-this._offset,h=this._maxLength,p=0,f=[],g=0;this.on("error",function(t){n=t}),r(this._handle,"zlib binding closed");do s=(s=this._handle.writeSync(e,t,p,u,this._buffer,this._offset,d))||this._writeState;while(!this._hadError&&function(t,e){if(c._hadError)return;let i=d-e;if(r(i>=0,"have should not go down"),i>0){let t=c._buffer.slice(c._offset,c._offset+i);if(c._offset+=i,t.length>h&&(t=t.slice(0,h)),f.push(t),g+=t.length,0==(h-=t.length))return!1}return(0===e||c._offset>=c._chunkSize)&&(d=c._chunkSize,c._offset=0,c._buffer=Buffer.allocUnsafe(c._chunkSize)),0===e&&(p+=u-t,u=t,!0)}(s[0],s[1]));if(this._hadError)throw n;if(g>=a)throw l(this),RangeError("Cannot create final Buffer. It would be larger than 0x"+a.toString(16)+" bytes");let w=Buffer.concat(f,g);return l(this),w},n.inherits(s,o.Inflate),t.exports=e=c,e.Inflate=s,e.createInflate=function(t){return new s(t)},e.inflateSync=c},45314:(t,e,i)=>{let r=i(74887),o=i(91670),n=i(29636),a=i(31047),s=i(9378),l=i(53733),c=i(82951),u=i(29913);function d(t){return unescape(encodeURIComponent(t)).length}function h(t,e,i){let r,o=[];for(;null!==(r=t.exec(i));)o.push({data:r[0],index:r.index,mode:e,length:r[0].length});return o}function p(t){let e,i,o=h(l.NUMERIC,r.NUMERIC,t),n=h(l.ALPHANUMERIC,r.ALPHANUMERIC,t);return c.isKanjiModeEnabled()?(e=h(l.BYTE,r.BYTE,t),i=h(l.KANJI,r.KANJI,t)):(e=h(l.BYTE_KANJI,r.BYTE,t),i=[]),o.concat(n,e,i).sort(function(t,e){return t.index-e.index}).map(function(t){return{data:t.data,mode:t.mode,length:t.length}})}function f(t,e){switch(e){case r.NUMERIC:return o.getBitsLength(t);case r.ALPHANUMERIC:return n.getBitsLength(t);case r.KANJI:return s.getBitsLength(t);case r.BYTE:return a.getBitsLength(t)}}function g(t,e){let i,l=r.getBestModeForData(t);if((i=r.from(e,l))!==r.BYTE&&i.bit<l.bit)throw Error('"'+t+'" cannot be encoded with mode '+r.toString(i)+".\n Suggested mode is: "+r.toString(l));switch(i!==r.KANJI||c.isKanjiModeEnabled()||(i=r.BYTE),i){case r.NUMERIC:return new o(t);case r.ALPHANUMERIC:return new n(t);case r.KANJI:return new s(t);case r.BYTE:return new a(t)}}e.fromArray=function(t){return t.reduce(function(t,e){return"string"==typeof e?t.push(g(e,null)):e.data&&t.push(g(e.data,e.mode)),t},[])},e.fromString=function(t,i){let o=function(t,e){let i={},o={start:{}},n=["start"];for(let a=0;a<t.length;a++){let s=t[a],l=[];for(let t=0;t<s.length;t++){let c=s[t],u=""+a+t;l.push(u),i[u]={node:c,lastCount:0},o[u]={};for(let t=0;t<n.length;t++){let a=n[t];i[a]&&i[a].node.mode===c.mode?(o[a][u]=f(i[a].lastCount+c.length,c.mode)-f(i[a].lastCount,c.mode),i[a].lastCount+=c.length):(i[a]&&(i[a].lastCount=c.length),o[a][u]=f(c.length,c.mode)+4+r.getCharCountIndicator(c.mode,e))}}n=l}for(let t=0;t<n.length;t++)o[n[t]].end=0;return{map:o,table:i}}(function(t){let e=[];for(let i=0;i<t.length;i++){let o=t[i];switch(o.mode){case r.NUMERIC:e.push([o,{data:o.data,mode:r.ALPHANUMERIC,length:o.length},{data:o.data,mode:r.BYTE,length:o.length}]);break;case r.ALPHANUMERIC:e.push([o,{data:o.data,mode:r.BYTE,length:o.length}]);break;case r.KANJI:e.push([o,{data:o.data,mode:r.BYTE,length:d(o.data)}]);break;case r.BYTE:e.push([{data:o.data,mode:r.BYTE,length:d(o.data)}])}}return e}(p(t,c.isKanjiModeEnabled())),i),n=u.find_path(o.map,"start","end"),a=[];for(let t=1;t<n.length-1;t++)a.push(o.table[n[t]].node);return e.fromArray(a.reduce(function(t,e){let i=t.length-1>=0?t[t.length-1]:null;return i&&i.mode===e.mode?t[t.length-1].data+=e.data:t.push(e),t},[]))},e.rawSplit=function(t){return e.fromArray(p(t,c.isKanjiModeEnabled()))}},45343:(t,e,i)=>{let r=i(82951).getSymbolSize;e.getPositions=function(t){let e=r(t);return[[0,0],[e-7,0],[0,e-7]]}},48417:(t,e,i)=>{"use strict";let r=i(28354),o=i(27910),n=i(85073),a=i(64104),s=t.exports=function(t){o.call(this),this._packer=new a(t||{}),this._deflate=this._packer.createDeflate(),this.readable=!0};r.inherits(s,o),s.prototype.pack=function(t,e,i,r){this.emit("data",Buffer.from(n.PNG_SIGNATURE)),this.emit("data",this._packer.packIHDR(e,i)),r&&this.emit("data",this._packer.packGAMA(r));let o=this._packer.filterData(t,e,i);this._deflate.on("error",this.emit.bind(this,"error")),this._deflate.on("data",(function(t){this.emit("data",this._packer.packIDAT(t))}).bind(this)),this._deflate.on("end",(function(){this.emit("data",this._packer.packIEND()),this.emit("end")}).bind(this)),this._deflate.end(o)}},49399:(t,e)=>{e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};let i={N1:3,N2:3,N3:40,N4:10};e.isValid=function(t){return null!=t&&""!==t&&!isNaN(t)&&t>=0&&t<=7},e.from=function(t){return e.isValid(t)?parseInt(t,10):void 0},e.getPenaltyN1=function(t){let e=t.size,r=0,o=0,n=0,a=null,s=null;for(let l=0;l<e;l++){o=n=0,a=s=null;for(let c=0;c<e;c++){let e=t.get(l,c);e===a?o++:(o>=5&&(r+=i.N1+(o-5)),a=e,o=1),(e=t.get(c,l))===s?n++:(n>=5&&(r+=i.N1+(n-5)),s=e,n=1)}o>=5&&(r+=i.N1+(o-5)),n>=5&&(r+=i.N1+(n-5))}return r},e.getPenaltyN2=function(t){let e=t.size,r=0;for(let i=0;i<e-1;i++)for(let o=0;o<e-1;o++){let e=t.get(i,o)+t.get(i,o+1)+t.get(i+1,o)+t.get(i+1,o+1);(4===e||0===e)&&r++}return r*i.N2},e.getPenaltyN3=function(t){let e=t.size,r=0,o=0,n=0;for(let i=0;i<e;i++){o=n=0;for(let a=0;a<e;a++)o=o<<1&2047|t.get(i,a),a>=10&&(1488===o||93===o)&&r++,n=n<<1&2047|t.get(a,i),a>=10&&(1488===n||93===n)&&r++}return r*i.N3},e.getPenaltyN4=function(t){let e=0,r=t.data.length;for(let i=0;i<r;i++)e+=t.data[i];return Math.abs(Math.ceil(100*e/r/5)-10)*i.N4},e.applyMask=function(t,i){let r=i.size;for(let o=0;o<r;o++)for(let n=0;n<r;n++)i.isReserved(n,o)||i.xor(n,o,function(t,i,r){switch(t){case e.Patterns.PATTERN000:return(i+r)%2==0;case e.Patterns.PATTERN001:return i%2==0;case e.Patterns.PATTERN010:return r%3==0;case e.Patterns.PATTERN011:return(i+r)%3==0;case e.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(r/3))%2==0;case e.Patterns.PATTERN101:return i*r%2+i*r%3==0;case e.Patterns.PATTERN110:return(i*r%2+i*r%3)%2==0;case e.Patterns.PATTERN111:return(i*r%3+(i+r)%2)%2==0;default:throw Error("bad maskPattern:"+t)}}(t,n,o))},e.getBestMask=function(t,i){let r=Object.keys(e.Patterns).length,o=0,n=1/0;for(let a=0;a<r;a++){i(a),e.applyMask(a,t);let r=e.getPenaltyN1(t)+e.getPenaltyN2(t)+e.getPenaltyN3(t)+e.getPenaltyN4(t);e.applyMask(a,t),r<n&&(n=r,o=a)}return o}},51688:(t,e,i)=>{"use strict";let r=i(27237),o=i(38578);e.process=function(t,e){let i=[],n=new r(t);return new o(e,{read:n.read.bind(n),write:function(t){i.push(t)},complete:function(){}}).start(),n.process(),Buffer.concat(i)}},51745:(t,e,i)=>{"use strict";let r=!0,o=i(74075);o.deflateSync||(r=!1);let n=i(85073),a=i(64104);t.exports=function(t,e){if(!r)throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");let i=new a(e||{}),s=[];s.push(Buffer.from(n.PNG_SIGNATURE)),s.push(i.packIHDR(t.width,t.height)),t.gamma&&s.push(i.packGAMA(t.gamma));let l=i.filterData(t.data,t.width,t.height),c=o.deflateSync(l,i.getDeflateOptions());if(l=null,!c||!c.length)throw Error("bad png - invalid compressed data response");return s.push(i.packIDAT(c)),s.push(i.packIEND()),Buffer.concat(s)}},53733:(t,e)=>{let i="[0-9]+",r="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+",o="(?:(?![A-Z0-9 $%*+\\-./:]|"+(r=r.replace(/u/g,"\\u"))+")(?:.|[\r\n]))+";e.KANJI=RegExp(r,"g"),e.BYTE_KANJI=RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),e.BYTE=RegExp(o,"g"),e.NUMERIC=RegExp(i,"g"),e.ALPHANUMERIC=RegExp("[A-Z $%*+\\-./:]+","g");let n=RegExp("^"+r+"$"),a=RegExp("^"+i+"$"),s=RegExp("^[A-Z0-9 $%*+\\-./:]+$");e.testKanji=function(t){return n.test(t)},e.testNumeric=function(t){return a.test(t)},e.testAlphanumeric=function(t){return s.test(t)}},54779:(t,e)=>{e.render=function(t,e,i){let r=t.modules.size,o=t.modules.data,n="\x1b[47m  \x1b[0m",a="",s=Array(r+3).join(n),l=[,,].join(n);a+=s+"\n";for(let t=0;t<r;++t){a+=n;for(let e=0;e<r;e++)a+=o[t*r+e]?"\x1b[40m  \x1b[0m":n;a+=l+"\n"}return a+=s+"\n","function"==typeof i&&i(null,a),a}},55176:(t,e)=>{let i=new Uint8Array(512),r=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)i[e]=t,r[t]=e,256&(t<<=1)&&(t^=285);for(let t=255;t<512;t++)i[t]=i[t-255]})(),e.log=function(t){if(t<1)throw Error("log("+t+")");return r[t]},e.exp=function(t){return i[t]},e.mul=function(t,e){return 0===t||0===e?0:i[r[t]+r[e]]}},57225:(t,e,i)=>{"use strict";let r=!0,o=i(74075),n=i(38891);o.deflateSync||(r=!1);let a=i(27237),s=i(51688),l=i(99705),c=i(32825),u=i(35978);t.exports=function(t,e){let i,d,h,p;if(!r)throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");let f=[],g=new a(t);if(new l(e,{read:g.read.bind(g),error:function(t){i=t},metadata:function(t){d=t},gamma:function(t){h=t},palette:function(t){d.palette=t},transColor:function(t){d.transColor=t},inflateData:function(t){f.push(t)},simpleTransparency:function(){d.alpha=!0}}).start(),g.process(),i)throw i;let w=Buffer.concat(f);if(f.length=0,d.interlace)p=o.inflateSync(w);else{let t=((d.width*d.bpp*d.depth+7>>3)+1)*d.height;p=n(w,{chunkSize:t,maxLength:t})}if(w=null,!p||!p.length)throw Error("bad png - invalid inflate data response");let b=s.process(p,d);w=null;let m=c.dataToBitMap(b,d);b=null;let y=u(m,d);return d.data=y,d.gamma=h||0,d}},61639:(t,e,i)=>{let r=i(22943),o={WW:" ",WB:"▄",BB:"█",BW:"▀"},n={BB:" ",BW:"▄",WW:"█",WB:"▀"};e.render=function(t,e,i){let a=r.getOptions(e),s=o;("#ffffff"===a.color.dark.hex||"#000000"===a.color.light.hex)&&(s=n);let l=t.modules.size,c=t.modules.data,u="",d=Array(l+2*a.margin+1).join(s.WW);d=Array(a.margin/2+1).join(d+"\n");let h=Array(a.margin+1).join(s.WW);u+=d;for(let t=0;t<l;t+=2){u+=h;for(let e=0;e<l;e++){var p;let i=c[t*l+e],r=c[(t+1)*l+e];u+=(p=s,i&&r?p.BB:i&&!r?p.BW:!i&&r?p.WB:p.WW)}u+=h+"\n"}return u+=d.slice(0,-1),"function"==typeof i&&i(null,u),u},e.renderToFile=function(t,r,o,n){void 0===n&&(n=o,o=void 0);let a=i(29021),s=e.render(r,o);a.writeFile(t,s,n)}},64104:(t,e,i)=>{"use strict";let r=i(85073),o=i(9066),n=i(94889),a=i(65640),s=i(74075),l=t.exports=function(t){if(this._options=t,t.deflateChunkSize=t.deflateChunkSize||32768,t.deflateLevel=null!=t.deflateLevel?t.deflateLevel:9,t.deflateStrategy=null!=t.deflateStrategy?t.deflateStrategy:3,t.inputHasAlpha=null==t.inputHasAlpha||t.inputHasAlpha,t.deflateFactory=t.deflateFactory||s.createDeflate,t.bitDepth=t.bitDepth||8,t.colorType="number"==typeof t.colorType?t.colorType:r.COLORTYPE_COLOR_ALPHA,t.inputColorType="number"==typeof t.inputColorType?t.inputColorType:r.COLORTYPE_COLOR_ALPHA,-1===[r.COLORTYPE_GRAYSCALE,r.COLORTYPE_COLOR,r.COLORTYPE_COLOR_ALPHA,r.COLORTYPE_ALPHA].indexOf(t.colorType))throw Error("option color type:"+t.colorType+" is not supported at present");if(-1===[r.COLORTYPE_GRAYSCALE,r.COLORTYPE_COLOR,r.COLORTYPE_COLOR_ALPHA,r.COLORTYPE_ALPHA].indexOf(t.inputColorType))throw Error("option input color type:"+t.inputColorType+" is not supported at present");if(8!==t.bitDepth&&16!==t.bitDepth)throw Error("option bit depth:"+t.bitDepth+" is not supported at present")};l.prototype.getDeflateOptions=function(){return{chunkSize:this._options.deflateChunkSize,level:this._options.deflateLevel,strategy:this._options.deflateStrategy}},l.prototype.createDeflate=function(){return this._options.deflateFactory(this.getDeflateOptions())},l.prototype.filterData=function(t,e,i){let o=n(t,e,i,this._options),s=r.COLORTYPE_TO_BPP_MAP[this._options.colorType];return a(o,e,i,this._options,s)},l.prototype._packChunk=function(t,e){let i=e?e.length:0,r=Buffer.alloc(i+12);return r.writeUInt32BE(i,0),r.writeUInt32BE(t,4),e&&e.copy(r,8),r.writeInt32BE(o.crc32(r.slice(4,r.length-4)),r.length-4),r},l.prototype.packGAMA=function(t){let e=Buffer.alloc(4);return e.writeUInt32BE(Math.floor(t*r.GAMMA_DIVISION),0),this._packChunk(r.TYPE_gAMA,e)},l.prototype.packIHDR=function(t,e){let i=Buffer.alloc(13);return i.writeUInt32BE(t,0),i.writeUInt32BE(e,4),i[8]=this._options.bitDepth,i[9]=this._options.colorType,i[10]=0,i[11]=0,i[12]=0,this._packChunk(r.TYPE_IHDR,i)},l.prototype.packIDAT=function(t){return this._packChunk(r.TYPE_IDAT,t)},l.prototype.packIEND=function(){return this._packChunk(r.TYPE_IEND,null)}},65640:(t,e,i)=>{"use strict";let r=i(81031),o={0:function(t,e,i,r,o){for(let n=0;n<i;n++)r[o+n]=t[e+n]},1:function(t,e,i,r,o,n){for(let a=0;a<i;a++){let i=a>=n?t[e+a-n]:0,s=t[e+a]-i;r[o+a]=s}},2:function(t,e,i,r,o){for(let n=0;n<i;n++){let a=e>0?t[e+n-i]:0,s=t[e+n]-a;r[o+n]=s}},3:function(t,e,i,r,o,n){for(let a=0;a<i;a++){let s=a>=n?t[e+a-n]:0,l=e>0?t[e+a-i]:0,c=t[e+a]-(s+l>>1);r[o+a]=c}},4:function(t,e,i,o,n,a){for(let s=0;s<i;s++){let l=s>=a?t[e+s-a]:0,c=e>0?t[e+s-i]:0,u=e>0&&s>=a?t[e+s-(i+a)]:0,d=t[e+s]-r(l,c,u);o[n+s]=d}}},n={0:function(t,e,i){let r=0,o=e+i;for(let i=e;i<o;i++)r+=Math.abs(t[i]);return r},1:function(t,e,i,r){let o=0;for(let n=0;n<i;n++){let i=n>=r?t[e+n-r]:0;o+=Math.abs(t[e+n]-i)}return o},2:function(t,e,i){let r=0,o=e+i;for(let n=e;n<o;n++){let o=e>0?t[n-i]:0;r+=Math.abs(t[n]-o)}return r},3:function(t,e,i,r){let o=0;for(let n=0;n<i;n++){let a=n>=r?t[e+n-r]:0,s=e>0?t[e+n-i]:0;o+=Math.abs(t[e+n]-(a+s>>1))}return o},4:function(t,e,i,o){let n=0;for(let a=0;a<i;a++){let s=a>=o?t[e+a-o]:0,l=e>0?t[e+a-i]:0,c=e>0&&a>=o?t[e+a-(i+o)]:0;n+=Math.abs(t[e+a]-r(s,l,c))}return n}};t.exports=function(t,e,i,r,a){let s;if("filterType"in r&&-1!==r.filterType)if("number"==typeof r.filterType)s=[r.filterType];else throw Error("unrecognised filter types");else s=[0,1,2,3,4];16===r.bitDepth&&(a*=2);let l=e*a,c=0,u=0,d=Buffer.alloc((l+1)*i),h=s[0];for(let e=0;e<i;e++){if(s.length>1){let e=1/0;for(let i=0;i<s.length;i++){let r=n[s[i]](t,u,l,a);r<e&&(h=s[i],e=r)}}d[c]=h,c++,o[h](t,u,l,d,c,a),c+=l,u+=l}return d}},73805:(t,e,i)=>{let r=i(94710),o=i(90678),n=i(88009),a=i(61639),s=i(80708),l=i(15204);function c(t,e,i){if(void 0===t)throw Error("String required as first argument");if(void 0===i&&(i=e,e={}),"function"!=typeof i)if(r())e=i||{},i=null;else throw Error("Callback required as last argument");return{opts:e,cb:i}}function u(t){switch(t){case"svg":return l;case"txt":case"utf8":return a;default:return n}}function d(t,e,i){if(!i.cb)return new Promise(function(r,n){try{let a=o.create(e,i.opts);return t(a,i.opts,function(t,e){return t?n(t):r(e)})}catch(t){n(t)}});try{let r=o.create(e,i.opts);return t(r,i.opts,i.cb)}catch(t){i.cb(t)}}e.create=o.create,e.toCanvas=i(16708).toCanvas,e.toString=function(t,e,i){let r=c(t,e,i);return d(function(t){switch(t){case"svg":return l;case"terminal":return s;default:return a}}(r.opts?r.opts.type:void 0).render,t,r)},e.toDataURL=function(t,e,i){let r=c(t,e,i);return d(u(r.opts.type).renderToDataURL,t,r)},e.toBuffer=function(t,e,i){let r=c(t,e,i);return d(u(r.opts.type).renderToBuffer,t,r)},e.toFile=function(t,e,i,o){if("string"!=typeof t||"string"!=typeof e&&"object"!=typeof e)throw Error("Invalid argument");if(arguments.length<3&&!r())throw Error("Too few arguments provided");let n=c(e,i,o);return d(u(n.opts.type||t.slice((t.lastIndexOf(".")-1>>>0)+2).toLowerCase()).renderToFile.bind(null,t),e,n)},e.toFileStream=function(t,e,i){if(arguments.length<2)throw Error("Too few arguments provided");let r=c(e,i,t.emit.bind(t,"error"));d(u("png").renderToFileStream.bind(null,t),e,r)}},74887:(t,e,i)=>{let r=i(24539),o=i(53733);e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(t,e){if(!t.ccBits)throw Error("Invalid mode: "+t);if(!r.isValid(e))throw Error("Invalid version: "+e);return e>=1&&e<10?t.ccBits[0]:e<27?t.ccBits[1]:t.ccBits[2]},e.getBestModeForData=function(t){return o.testNumeric(t)?e.NUMERIC:o.testAlphanumeric(t)?e.ALPHANUMERIC:o.testKanji(t)?e.KANJI:(0,e.BYTE)},e.toString=function(t){if(t&&t.id)return t.id;throw Error("Invalid mode")},e.isValid=function(t){return t&&t.bit&&t.ccBits},e.from=function(t,i){if(e.isValid(t))return t;try{if("string"!=typeof t)throw Error("Param is not a string");switch(t.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw Error("Unknown mode: "+t)}return}catch(t){return i}}},75043:t=>{"use strict";t.exports=function(t){for(var e=[],i=t.length,r=0;r<i;r++){var o=t.charCodeAt(r);if(o>=55296&&o<=56319&&i>r+1){var n=t.charCodeAt(r+1);n>=56320&&n<=57343&&(o=(o-55296)*1024+n-56320+65536,r+=1)}if(o<128){e.push(o);continue}if(o<2048){e.push(o>>6|192),e.push(63&o|128);continue}if(o<55296||o>=57344&&o<65536){e.push(o>>12|224),e.push(o>>6&63|128),e.push(63&o|128);continue}if(o>=65536&&o<=1114111){e.push(o>>18|240),e.push(o>>12&63|128),e.push(o>>6&63|128),e.push(63&o|128);continue}e.push(239,191,189)}return new Uint8Array(e).buffer}},75243:t=>{function e(t){if(!t||t<1)throw Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}e.prototype.set=function(t,e,i,r){let o=t*this.size+e;this.data[o]=i,r&&(this.reservedBit[o]=!0)},e.prototype.get=function(t,e){return this.data[t*this.size+e]},e.prototype.xor=function(t,e,i){this.data[t*this.size+e]^=i},e.prototype.isReserved=function(t,e){return this.reservedBit[t*this.size+e]},t.exports=e},75827:(t,e,i)=>{"use strict";i.r(e),i.d(e,{W3mAllWalletsView:()=>eS,W3mConnectingWcBasicView:()=>t2,W3mDownloadsView:()=>ej});var r=i(63861),o=i(15276),n=i(97184),a=i(98555),s=i(36585),l=i(47422),c=i(43753);i(30904);var u=i(24628),d=i(48244),h=i(91042),p=i(71966);i(20606),i(57086),i(77656);var f=i(10719),g=i(46548);i(69220),i(48180);let w=(0,r.AH)`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`;var b=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let m=class extends r.WF{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let t="xxs";return t="lg"===this.size?"m":"md"===this.size?"xs":"xxs",this.style.cssText=`
       --local-border-radius: var(--wui-border-radius-${t});
       --local-size: var(--wui-wallet-image-size-${this.size});
   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),(0,r.qy)`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?(0,r.qy)`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?(0,r.qy)`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:(0,r.qy)`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};m.styles=[f.fD,f.W5,w],b([(0,o.MZ)()],m.prototype,"size",void 0),b([(0,o.MZ)()],m.prototype,"name",void 0),b([(0,o.MZ)()],m.prototype,"imageSrc",void 0),b([(0,o.MZ)()],m.prototype,"walletIcon",void 0),b([(0,o.MZ)({type:Boolean})],m.prototype,"installed",void 0),b([(0,o.MZ)()],m.prototype,"badgeSize",void 0),m=b([(0,g.E)("wui-wallet-image")],m);let y=(0,r.AH)`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`;var v=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let x=class extends r.WF{constructor(){super(...arguments),this.walletImages=[]}render(){let t=this.walletImages.length<4;return(0,r.qy)`${this.walletImages.slice(0,4).map(({src:t,walletName:e})=>(0,r.qy)`
            <wui-wallet-image
              size="inherit"
              imageSrc=${t}
              name=${(0,u.J)(e)}
            ></wui-wallet-image>
          `)}
      ${t?[...Array(4-this.walletImages.length)].map(()=>(0,r.qy)` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};x.styles=[f.W5,y],v([(0,o.MZ)({type:Array})],x.prototype,"walletImages",void 0),x=v([(0,g.E)("wui-all-wallets-image")],x),i(34363);let _=(0,r.AH)`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`;var k=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let C=class extends r.WF{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return(0,r.qy)`
      <button ?disabled=${this.disabled} tabindex=${(0,u.J)(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?(0,r.qy)` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?(0,r.qy)` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?(0,r.qy)`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:(0,r.qy)`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.loading?(0,r.qy)`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?(0,r.qy)`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:(0,this.icon)?(0,r.qy)`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};C.styles=[f.W5,f.fD,_],k([(0,o.MZ)({type:Array})],C.prototype,"walletImages",void 0),k([(0,o.MZ)()],C.prototype,"imageSrc",void 0),k([(0,o.MZ)()],C.prototype,"name",void 0),k([(0,o.MZ)()],C.prototype,"tagLabel",void 0),k([(0,o.MZ)()],C.prototype,"tagVariant",void 0),k([(0,o.MZ)()],C.prototype,"icon",void 0),k([(0,o.MZ)()],C.prototype,"walletIcon",void 0),k([(0,o.MZ)()],C.prototype,"tabIdx",void 0),k([(0,o.MZ)({type:Boolean})],C.prototype,"installed",void 0),k([(0,o.MZ)({type:Boolean})],C.prototype,"disabled",void 0),k([(0,o.MZ)({type:Boolean})],C.prototype,"showAllWallets",void 0),k([(0,o.MZ)({type:Boolean})],C.prototype,"loading",void 0),k([(0,o.MZ)({type:String})],C.prototype,"loadingSpinnerColor",void 0),C=k([(0,g.E)("wui-list-wallet")],C);var E=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let R=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.count=a.N.state.count,this.filteredCount=a.N.state.filteredWallets.length,this.isFetchingRecommendedWallets=a.N.state.isFetchingRecommendedWallets,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t),a.N.subscribeKey("count",t=>this.count=t),a.N.subscribeKey("filteredWallets",t=>this.filteredCount=t.length),a.N.subscribeKey("isFetchingRecommendedWallets",t=>this.isFetchingRecommendedWallets=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.find(t=>"walletConnect"===t.id),{allWallets:e}=s.H.state;if(!t||"HIDE"===e||"ONLY_MOBILE"===e&&!n.w.isMobile())return null;let i=a.N.state.featured.length,o=this.count+i,l=o<10?o:10*Math.floor(o/10),c=this.filteredCount>0?this.filteredCount:l,d=`${c}`;return this.filteredCount>0?d=`${this.filteredCount}`:c<o&&(d=`${c}+`),(0,r.qy)`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${d}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${(0,u.J)(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
      ></wui-list-wallet>
    `}onAllWallets(){h.E.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),p.I.push("AllWallets")}};E([(0,o.MZ)()],R.prototype,"tabIdx",void 0),E([(0,o.wk)()],R.prototype,"connectors",void 0),E([(0,o.wk)()],R.prototype,"count",void 0),E([(0,o.wk)()],R.prototype,"filteredCount",void 0),E([(0,o.wk)()],R.prototype,"isFetchingRecommendedWallets",void 0),R=E([(0,c.EM)("w3m-all-wallets-widget")],R);var I=i(76931),T=i(36716),$=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let O=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(t=>"ANNOUNCED"===t.type);return t?.length?(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs">
        ${t.filter(T.g.showConnector).map(t=>(0,r.qy)`
              <wui-list-wallet
                imageSrc=${(0,u.J)(I.$.getConnectorImage(t))}
                name=${t.name??"Unknown"}
                @click=${()=>this.onConnector(t)}
                tagVariant="success"
                tagLabel="installed"
                data-testid=${`wallet-selector-${t.id}`}
                .installed=${!0}
                tabIdx=${(0,u.J)(this.tabIdx)}
              >
              </wui-list-wallet>
            `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){"walletConnect"===t.id?n.w.isMobile()?p.I.push("AllWallets"):p.I.push("ConnectingWalletConnect"):p.I.push("ConnectingExternal",{connector:t})}};$([(0,o.MZ)()],O.prototype,"tabIdx",void 0),$([(0,o.wk)()],O.prototype,"connectors",void 0),O=$([(0,c.EM)("w3m-connect-announced-widget")],O);var P=i(18912),M=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let A=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.loading=!1,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t)),n.w.isTelegram()&&n.w.isIos()&&(this.loading=!P.x.state.wcUri,this.unsubscribe.push(P.x.subscribeKey("wcUri",t=>this.loading=!t)))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let{customWallets:t}=s.H.state;if(!t?.length)return this.style.cssText="display: none",null;let e=this.filterOutDuplicateWallets(t);return(0,r.qy)`<wui-flex flexDirection="column" gap="xs">
      ${e.map(t=>(0,r.qy)`
          <wui-list-wallet
            imageSrc=${(0,u.J)(I.$.getWalletImage(t))}
            name=${t.name??"Unknown"}
            @click=${()=>this.onConnectWallet(t)}
            data-testid=${`wallet-selector-${t.id}`}
            tabIdx=${(0,u.J)(this.tabIdx)}
            ?loading=${this.loading}
          >
          </wui-list-wallet>
        `)}
    </wui-flex>`}filterOutDuplicateWallets(t){let e=l.i.getRecentWallets(),i=this.connectors.map(t=>t.info?.rdns).filter(Boolean),r=e.map(t=>t.rdns).filter(Boolean),o=i.concat(r);if(o.includes("io.metamask.mobile")&&n.w.isMobile()){let t=o.indexOf("io.metamask.mobile");o[t]="io.metamask"}return t.filter(t=>!o.includes(String(t?.rdns)))}onConnectWallet(t){this.loading||p.I.push("ConnectingWalletConnect",{wallet:t})}};M([(0,o.MZ)()],A.prototype,"tabIdx",void 0),M([(0,o.wk)()],A.prototype,"connectors",void 0),M([(0,o.wk)()],A.prototype,"loading",void 0),A=M([(0,c.EM)("w3m-connect-custom-widget")],A);var L=i(28975),S=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let B=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(t=>"EXTERNAL"===t.type).filter(T.g.showConnector).filter(t=>t.id!==L.o.CONNECTOR_ID.COINBASE_SDK);return t?.length?(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>(0,r.qy)`
            <wui-list-wallet
              imageSrc=${(0,u.J)(I.$.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              data-testid=${`wallet-selector-external-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${(0,u.J)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){p.I.push("ConnectingExternal",{connector:t})}};S([(0,o.MZ)()],B.prototype,"tabIdx",void 0),S([(0,o.wk)()],B.prototype,"connectors",void 0),B=S([(0,c.EM)("w3m-connect-external-widget")],B);var W=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let D=class extends r.WF{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){return this.wallets.length?(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map(t=>(0,r.qy)`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${t.id}`}
              imageSrc=${(0,u.J)(I.$.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${(0,u.J)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){d.a.selectWalletConnector(t)}};W([(0,o.MZ)()],D.prototype,"tabIdx",void 0),W([(0,o.MZ)()],D.prototype,"wallets",void 0),D=W([(0,c.EM)("w3m-connect-featured-widget")],D);var j=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let N=class extends r.WF{constructor(){super(...arguments),this.tabIdx=void 0,this.connectors=[]}render(){let t=this.connectors.filter(T.g.showConnector);return 0===t.length?(this.style.cssText="display: none",null):(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>(0,r.qy)`
            <wui-list-wallet
              imageSrc=${(0,u.J)(I.$.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${(0,u.J)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnector(t){d.a.setActiveConnector(t),p.I.push("ConnectingExternal",{connector:t})}};j([(0,o.MZ)()],N.prototype,"tabIdx",void 0),j([(0,o.MZ)()],N.prototype,"connectors",void 0),N=j([(0,c.EM)("w3m-connect-injected-widget")],N);var q=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let z=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(t=>"MULTI_CHAIN"===t.type&&"WalletConnect"!==t.name);return t?.length?(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>(0,r.qy)`
            <wui-list-wallet
              imageSrc=${(0,u.J)(I.$.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${(0,u.J)(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){d.a.setActiveConnector(t),p.I.push("ConnectingMultiChain")}};q([(0,o.MZ)()],z.prototype,"tabIdx",void 0),q([(0,o.wk)()],z.prototype,"connectors",void 0),z=q([(0,c.EM)("w3m-connect-multi-chain-widget")],z);var U=i(52722),Z=i(20358),H=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let F=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.loading=!1,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t)),n.w.isTelegram()&&n.w.isIos()&&(this.loading=!P.x.state.wcUri,this.unsubscribe.push(P.x.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let t=l.i.getRecentWallets().filter(t=>!Z.A.isExcluded(t)).filter(t=>!this.hasWalletConnector(t)).filter(t=>this.isWalletCompatibleWithCurrentChain(t));return t.length?(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(t=>(0,r.qy)`
            <wui-list-wallet
              imageSrc=${(0,u.J)(I.$.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${(0,u.J)(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){this.loading||d.a.selectWalletConnector(t)}hasWalletConnector(t){return this.connectors.some(e=>e.id===t.id||e.name===t.name)}isWalletCompatibleWithCurrentChain(t){let e=U.W.state.activeChain;return!e||!t.chains||t.chains.some(t=>e===t.split(":")[0])}};H([(0,o.MZ)()],F.prototype,"tabIdx",void 0),H([(0,o.wk)()],F.prototype,"connectors",void 0),H([(0,o.wk)()],F.prototype,"loading",void 0),F=H([(0,c.EM)("w3m-connect-recent-widget")],F);var Y=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let J=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,n.w.isTelegram()&&n.w.isIos()&&(this.loading=!P.x.state.wcUri,this.unsubscribe.push(P.x.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let{connectors:t}=d.a.state,{customWallets:e,featuredWalletIds:i}=s.H.state,o=l.i.getRecentWallets(),n=t.find(t=>"walletConnect"===t.id),a=t.filter(t=>"INJECTED"===t.type||"ANNOUNCED"===t.type||"MULTI_CHAIN"===t.type).filter(t=>"Browser Wallet"!==t.name);if(!n)return null;if(i||e||!this.wallets.length)return this.style.cssText="display: none",null;let c=Math.max(0,2-(a.length+o.length)),h=Z.A.filterOutDuplicateWallets(this.wallets).slice(0,c);return h.length?(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs">
        ${h.map(t=>(0,r.qy)`
            <wui-list-wallet
              imageSrc=${(0,u.J)(I.$.getWalletImage(t))}
              name=${t?.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${(0,u.J)(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){if(this.loading)return;let e=d.a.getConnector(t.id,t.rdns);e?p.I.push("ConnectingExternal",{connector:e}):p.I.push("ConnectingWalletConnect",{wallet:t})}};Y([(0,o.MZ)()],J.prototype,"tabIdx",void 0),Y([(0,o.MZ)()],J.prototype,"wallets",void 0),Y([(0,o.wk)()],J.prototype,"loading",void 0),J=Y([(0,c.EM)("w3m-connect-recommended-widget")],J);var G=i(33259),K=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let V=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.connectorImages=G.j.state.connectorImages,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t),G.j.subscribeKey("connectorImages",t=>this.connectorImages=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(n.w.isMobile())return this.style.cssText="display: none",null;let t=this.connectors.find(t=>"walletConnect"===t.id);if(!t)return this.style.cssText="display: none",null;let e=t.imageUrl||this.connectorImages[t?.imageId??""];return(0,r.qy)`
      <wui-list-wallet
        imageSrc=${(0,u.J)(e)}
        name=${t.name??"Unknown"}
        @click=${()=>this.onConnector(t)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${(0,u.J)(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `}onConnector(t){d.a.setActiveConnector(t),p.I.push("ConnectingWalletConnect")}};K([(0,o.MZ)()],V.prototype,"tabIdx",void 0),K([(0,o.wk)()],V.prototype,"connectors",void 0),K([(0,o.wk)()],V.prototype,"connectorImages",void 0),V=K([(0,c.EM)("w3m-connect-walletconnect-widget")],V);let Q=(0,r.AH)`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var X=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tt=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=d.a.state.connectors,this.recommended=a.N.state.recommended,this.featured=a.N.state.featured,this.unsubscribe.push(d.a.subscribeKey("connectors",t=>this.connectors=t),a.N.subscribeKey("recommended",t=>this.recommended=t),a.N.subscribeKey("featured",t=>this.featured=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return(0,r.qy)`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){let{custom:t,recent:e,announced:i,injected:o,multiChain:n,recommended:a,featured:s,external:l}=T.g.getConnectorsByType(this.connectors,this.recommended,this.featured);return T.g.getConnectorTypeOrder({custom:t,recent:e,announced:i,injected:o,multiChain:n,recommended:a,featured:s,external:l}).map(t=>{switch(t){case"injected":return(0,r.qy)`
            ${n.length?(0,r.qy)`<w3m-connect-multi-chain-widget
                  tabIdx=${(0,u.J)(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${i.length?(0,r.qy)`<w3m-connect-announced-widget
                  tabIdx=${(0,u.J)(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${o.length?(0,r.qy)`<w3m-connect-injected-widget
                  .connectors=${o}
                  tabIdx=${(0,u.J)(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return(0,r.qy)`<w3m-connect-walletconnect-widget
            tabIdx=${(0,u.J)(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return(0,r.qy)`<w3m-connect-recent-widget
            tabIdx=${(0,u.J)(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return(0,r.qy)`<w3m-connect-featured-widget
            .wallets=${s}
            tabIdx=${(0,u.J)(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return(0,r.qy)`<w3m-connect-custom-widget
            tabIdx=${(0,u.J)(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return(0,r.qy)`<w3m-connect-external-widget
            tabIdx=${(0,u.J)(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return(0,r.qy)`<w3m-connect-recommended-widget
            .wallets=${a}
            tabIdx=${(0,u.J)(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return console.warn(`Unknown connector type: ${t}`),null}})}};tt.styles=Q,X([(0,o.MZ)()],tt.prototype,"tabIdx",void 0),X([(0,o.wk)()],tt.prototype,"connectors",void 0),X([(0,o.wk)()],tt.prototype,"recommended",void 0),X([(0,o.wk)()],tt.prototype,"featured",void 0),tt=X([(0,c.EM)("w3m-connector-list")],tt);var te=i(7298),ti=i(73981);let tr=(0,r.AH)`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var to=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tn=class extends r.WF{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`
      --local-tab: ${this.activeTab};
      --local-tab-width: ${this.localTabWidth};
    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map((t,e)=>{let i=e===this.activeTab;return(0,r.qy)`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(e)}
          data-active=${i}
          data-testid="tab-${t.label?.toLowerCase()}"
        >
          ${this.iconTemplate(t)}
          <wui-text variant="small-600" color="inherit"> ${t.label} </wui-text>
        </button>
      `})}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout(()=>{this.animateTabs(0,!0)},0))}iconTemplate(t){return t.icon?(0,r.qy)`<wui-icon size="xs" color="inherit" name=${t.icon}></wui-icon>`:null}onTabClick(t){this.buttons&&this.animateTabs(t,!1),this.activeTab=t,this.onTabChange(t)}animateTabs(t,e){let i=this.buttons[this.activeTab],r=this.buttons[t],o=i?.querySelector("wui-text"),n=r?.querySelector("wui-text"),a=r?.getBoundingClientRect(),s=n?.getBoundingClientRect();i&&o&&!e&&t!==this.activeTab&&(o.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),i.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),r&&a&&s&&n&&(t!==this.activeTab||e)&&(this.localTabWidth=`${Math.round(a.width+s.width)+6}px`,r.animate([{width:`${a.width+s.width}px`}],{duration:500*!e,fill:"forwards",easing:"ease"}),n.animate([{opacity:1}],{duration:125*!e,delay:200*!e,fill:"forwards",easing:"ease"}))}};tn.styles=[f.W5,f.fD,tr],to([(0,o.MZ)({type:Array})],tn.prototype,"tabs",void 0),to([(0,o.MZ)()],tn.prototype,"onTabChange",void 0),to([(0,o.MZ)({type:Array})],tn.prototype,"buttons",void 0),to([(0,o.MZ)({type:Boolean})],tn.prototype,"disabled",void 0),to([(0,o.MZ)()],tn.prototype,"localTabWidth",void 0),to([(0,o.wk)()],tn.prototype,"activeTab",void 0),to([(0,o.wk)()],tn.prototype,"isDense",void 0),tn=to([(0,g.E)("wui-tabs")],tn);var ta=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ts=class extends r.WF{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.generateTabs();return(0,r.qy)`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs .tabs=${t} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let t=this.platforms.map(t=>{if("browser"===t)return{label:"Browser",icon:"extension",platform:"browser"};if("mobile"===t)return{label:"Mobile",icon:"mobile",platform:"mobile"};if("qrcode"===t)return{label:"Mobile",icon:"mobile",platform:"qrcode"};if("web"===t)return{label:"Webapp",icon:"browser",platform:"web"};if("desktop"===t)return{label:"Desktop",icon:"desktop",platform:"desktop"};return{label:"Browser",icon:"extension",platform:"unsupported"}});return this.platformTabs=t.map(({platform:t})=>t),t}onTabChange(t){let e=this.platformTabs[t];e&&this.onSelectPlatfrom?.(e)}};ta([(0,o.MZ)({type:Array})],ts.prototype,"platforms",void 0),ta([(0,o.MZ)()],ts.prototype,"onSelectPlatfrom",void 0),ts=ta([(0,c.EM)("w3m-connecting-header")],ts);var tl=i(94958);i(61455);let tc=(0,r.AH)`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: none;
    border-radius: var(--local-border-radius);
    width: var(--local-width);
    white-space: nowrap;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='md'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-l);
    height: 36px;
  }

  button[data-size='md'][data-icon-left='true'][data-icon-right='false'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-s);
  }

  button[data-size='md'][data-icon-right='true'][data-icon-left='false'] {
    padding: 8.2px var(--wui-spacing-s) 9px var(--wui-spacing-l);
  }

  button[data-size='lg'] {
    padding: var(--wui-spacing-m) var(--wui-spacing-2l);
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='inverse'] {
    background-color: var(--wui-color-inverse-100);
    color: var(--wui-color-inverse-000);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='accent-error'] {
    background: var(--wui-color-error-glass-015);
    color: var(--wui-color-error-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-error-glass-010);
  }

  button[data-variant='accent-success'] {
    background: var(--wui-color-success-glass-015);
    color: var(--wui-color-success-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-success-glass-010);
  }

  button[data-variant='neutral'] {
    background: transparent;
    color: var(--wui-color-fg-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-variant='main']:focus-visible:enabled {
    background-color: var(--wui-color-accent-090);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='inverse']:focus-visible:enabled {
    background-color: var(--wui-color-inverse-100);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent']:focus-visible:enabled {
    background-color: var(--wui-color-accent-glass-010);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent-error']:focus-visible:enabled {
    background: var(--wui-color-error-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-error-100),
      0 0 0 4px var(--wui-color-error-glass-020);
  }
  button[data-variant='accent-success']:focus-visible:enabled {
    background: var(--wui-color-success-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-success-100),
      0 0 0 4px var(--wui-color-success-glass-020);
  }
  button[data-variant='neutral']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='accent-error']:hover:enabled {
      background: var(--wui-color-error-glass-020);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-error']:active:enabled {
      background: var(--wui-color-error-glass-030);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-success']:hover:enabled {
      background: var(--wui-color-success-glass-020);
      color: var(--wui-color-success-100);
    }

    button[data-variant='accent-success']:active:enabled {
      background: var(--wui-color-success-glass-030);
      color: var(--wui-color-success-100);
    }

    button[data-variant='neutral']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='neutral']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }

    button[data-size='lg'][data-icon-left='true'][data-icon-right='false'] {
      padding-left: var(--wui-spacing-m);
    }

    button[data-size='lg'][data-icon-right='true'][data-icon-left='false'] {
      padding-right: var(--wui-spacing-m);
    }
  }

  /* -- Disabled state --------------------------------------------------- */
  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    color: var(--wui-color-gray-glass-020);
    cursor: not-allowed;
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`;var tu=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let td={main:"inverse-100",inverse:"inverse-000",accent:"accent-100","accent-error":"error-100","accent-success":"success-100",neutral:"fg-100",disabled:"gray-glass-020"},th={lg:"paragraph-600",md:"small-600"},tp={lg:"md",md:"md"},tf=class extends r.WF{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="main",this.hasIconLeft=!1,this.hasIconRight=!1,this.borderRadius="m"}render(){this.style.cssText=`
    --local-width: ${this.fullWidth?"100%":"auto"};
    --local-opacity-100: ${+!this.loading};
    --local-opacity-000: ${+!!this.loading};
    --local-border-radius: var(--wui-border-radius-${this.borderRadius});
    `;let t=this.textVariant??th[this.size];return(0,r.qy)`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${()=>this.handleSlotLeftChange()}></slot>
        <wui-text variant=${t} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight" @slotchange=${()=>this.handleSlotRightChange()}></slot>
      </button>
    `}handleSlotLeftChange(){this.hasIconLeft=!0}handleSlotRightChange(){this.hasIconRight=!0}loadingTemplate(){if(this.loading){let t=tp[this.size],e=this.disabled?td.disabled:td[this.variant];return(0,r.qy)`<wui-loading-spinner color=${e} size=${t}></wui-loading-spinner>`}return(0,r.qy)``}};tf.styles=[f.W5,f.fD,tc],tu([(0,o.MZ)()],tf.prototype,"size",void 0),tu([(0,o.MZ)({type:Boolean})],tf.prototype,"disabled",void 0),tu([(0,o.MZ)({type:Boolean})],tf.prototype,"fullWidth",void 0),tu([(0,o.MZ)({type:Boolean})],tf.prototype,"loading",void 0),tu([(0,o.MZ)()],tf.prototype,"variant",void 0),tu([(0,o.MZ)({type:Boolean})],tf.prototype,"hasIconLeft",void 0),tu([(0,o.MZ)({type:Boolean})],tf.prototype,"hasIconRight",void 0),tu([(0,o.MZ)()],tf.prototype,"borderRadius",void 0),tu([(0,o.MZ)()],tf.prototype,"textVariant",void 0),tf=tu([(0,g.E)("wui-button")],tf),i(16266);let tg=(0,r.AH)`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var tw=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tb=class extends r.WF{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return(0,r.qy)`
      <button ?disabled=${this.disabled} tabindex=${(0,u.J)(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};tb.styles=[f.W5,f.fD,tg],tw([(0,o.MZ)()],tb.prototype,"tabIdx",void 0),tw([(0,o.MZ)({type:Boolean})],tb.prototype,"disabled",void 0),tw([(0,o.MZ)()],tb.prototype,"color",void 0),tb=tw([(0,g.E)("wui-link")],tb);let tm=(0,r.AH)`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var ty=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tv=class extends r.WF{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let t=this.radius>50?50:this.radius,e=36-t;return(0,r.qy)`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${116+e} ${245+e}"
          stroke-dashoffset=${360+1.75*e}
        />
      </svg>
    `}};tv.styles=[f.W5,tm],ty([(0,o.MZ)({type:Number})],tv.prototype,"radius",void 0),tv=ty([(0,g.E)("wui-loading-thumbnail")],tv),i(88304);let tx=(0,r.AH)`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`;var t_=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tk=class extends r.WF{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){let t="sm"===this.size?"small-600":"paragraph-600";return(0,r.qy)`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?(0,r.qy)`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${t} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};tk.styles=[f.W5,f.fD,tx],t_([(0,o.MZ)()],tk.prototype,"variant",void 0),t_([(0,o.MZ)()],tk.prototype,"imageSrc",void 0),t_([(0,o.MZ)({type:Boolean})],tk.prototype,"disabled",void 0),t_([(0,o.MZ)()],tk.prototype,"icon",void 0),t_([(0,o.MZ)()],tk.prototype,"size",void 0),t_([(0,o.MZ)()],tk.prototype,"text",void 0),tk=t_([(0,g.E)("wui-chip-button")],tk);let tC=(0,r.AH)`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var tE=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tR=class extends r.WF{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return(0,r.qy)`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};tR.styles=[f.W5,f.fD,tC],tE([(0,o.MZ)({type:Boolean})],tR.prototype,"disabled",void 0),tE([(0,o.MZ)()],tR.prototype,"label",void 0),tE([(0,o.MZ)()],tR.prototype,"buttonLabel",void 0),tR=tE([(0,g.E)("wui-cta-button")],tR);let tI=(0,r.AH)`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`;var tT=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let t$=class extends r.WF{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:t,app_store:e,play_store:i,chrome_store:o,homepage:a}=this.wallet,s=n.w.isMobile(),l=n.w.isIos(),u=n.w.isAndroid(),d=[e,i,a,o].filter(Boolean).length>1,h=c.Zv.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return d&&!s?(0,r.qy)`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${()=>p.I.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!d&&a?(0,r.qy)`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:e&&l?(0,r.qy)`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:i&&u?(0,r.qy)`
        <wui-cta-button
          label=${`Don't have ${h}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&n.w.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&n.w.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&n.w.openHref(this.wallet.homepage,"_blank")}};t$.styles=[tI],tT([(0,o.MZ)({type:Object})],t$.prototype,"wallet",void 0),t$=tT([(0,c.EM)("w3m-mobile-download-links")],t$);let tO=(0,r.AH)`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`;var tP=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};class tM extends r.WF{constructor(){super(),this.wallet=p.I.state.data?.wallet,this.connector=p.I.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=I.$.getWalletImage(this.wallet)??I.$.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=P.x.state.wcUri,this.error=P.x.state.wcError,this.ready=!1,this.showRetry=!1,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(P.x.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),P.x.subscribeKey("wcError",t=>this.error=t)),(n.w.isTelegram()||n.w.isSafari())&&n.w.isIos()&&P.x.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),P.x.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,e=`Continue in ${this.name}`;return this.error&&(e="Connection declined"),(0,r.qy)`
      <wui-flex
        data-error=${(0,u.J)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${(0,u.J)(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?(0,r.qy)`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?(0,r.qy)`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;let t=this.shadowRoot?.querySelector("wui-button");t?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){P.x.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let t=tl.W.state.themeVariables["--w3m-border-radius-master"],e=t?parseInt(t.replace("px",""),10):4;return(0,r.qy)`<wui-loading-thumbnail radius=${9*e}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(n.w.copyToClopboard(this.uri),ti.P.showSuccess("Link copied"))}catch{ti.P.showError("Failed to copy")}}}tM.styles=tO,tP([(0,o.wk)()],tM.prototype,"isRetrying",void 0),tP([(0,o.wk)()],tM.prototype,"uri",void 0),tP([(0,o.wk)()],tM.prototype,"error",void 0),tP([(0,o.wk)()],tM.prototype,"ready",void 0),tP([(0,o.wk)()],tM.prototype,"showRetry",void 0),tP([(0,o.wk)()],tM.prototype,"secondaryBtnLabel",void 0),tP([(0,o.wk)()],tM.prototype,"secondaryLabel",void 0),tP([(0,o.wk)()],tM.prototype,"isLoading",void 0),tP([(0,o.MZ)({type:Boolean})],tM.prototype,"isMobile",void 0),tP([(0,o.MZ)()],tM.prototype,"onRetry",void 0);let tA=class extends tM{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),h.E.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){try{this.error=!1;let{connectors:t}=d.a.state,e=t.find(t=>"ANNOUNCED"===t.type&&t.info?.rdns===this.wallet?.rdns||"INJECTED"===t.type||t.name===this.wallet?.name);if(e)await P.x.connectExternal(e,e.chain);else throw Error("w3m-connecting-wc-browser: No connector found");te.W.close(),h.E.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown"}})}catch(t){h.E.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}}};tA=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([(0,c.EM)("w3m-connecting-wc-browser")],tA);let tL=class extends tM{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),h.E.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:t,name:e}=this.wallet,{redirect:i,href:r}=n.w.formatNativeUrl(t,this.uri);P.x.setWcLinking({name:e,href:r}),P.x.setRecentWallet(this.wallet),n.w.openHref(i,"_blank")}catch{this.error=!0}}};tL=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([(0,c.EM)("w3m-connecting-wc-desktop")],tL);var tS=i(98938),tB=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tW=class extends tM{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=s.H.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;let{mobile_link:t,link_mode:e,name:i}=this.wallet,{redirect:r,redirectUniversalLink:o,href:a}=n.w.formatNativeUrl(t,this.uri,e);this.redirectDeeplink=r,this.redirectUniversalLink=o,this.target=n.w.isIframe()?"_top":"_self",P.x.setWcLinking({name:i,href:a}),P.x.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?n.w.openHref(this.redirectUniversalLink,this.target):n.w.openHref(this.redirectDeeplink,this.target)}catch(t){h.E.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=tS.oU.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(P.x.subscribeKey("wcUri",()=>{this.onHandleURI()})),h.E.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){P.x.setWcError(!1),this.onConnect?.()}};tB([(0,o.wk)()],tW.prototype,"redirectDeeplink",void 0),tB([(0,o.wk)()],tW.prototype,"redirectUniversalLink",void 0),tB([(0,o.wk)()],tW.prototype,"target",void 0),tB([(0,o.wk)()],tW.prototype,"preferUniversalLinks",void 0),tB([(0,o.wk)()],tW.prototype,"isLoading",void 0),tW=tB([(0,c.EM)("w3m-connecting-wc-mobile")],tW);var tD=i(9184);function tj(t,e,i){return t!==e&&(t-e<0?e-t:t-e)<=i+.1}let tN={generate({uri:t,size:e,logoSize:i,dotColor:o="#141414"}){let n=[],a=function(t,e){let i=Array.prototype.slice.call(tD.create(t,{errorCorrectionLevel:"Q"}).modules.data,0),r=Math.sqrt(i.length);return i.reduce((t,e,i)=>(i%r==0?t.push([e]):t[t.length-1].push(e))&&t,[])}(t,0),s=e/a.length,l=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];l.forEach(({x:t,y:e})=>{let i=(a.length-7)*s*t,c=(a.length-7)*s*e;for(let t=0;t<l.length;t+=1){let e=s*(7-2*t);n.push((0,r.JW)`
            <rect
              fill=${2===t?o:"transparent"}
              width=${0===t?e-5:e}
              rx= ${0===t?(e-5)*.45:.45*e}
              ry= ${0===t?(e-5)*.45:.45*e}
              stroke=${o}
              stroke-width=${5*(0===t)}
              height=${0===t?e-5:e}
              x= ${0===t?c+s*t+2.5:c+s*t}
              y= ${0===t?i+s*t+2.5:i+s*t}
            />
          `)}});let c=Math.floor((i+25)/s),u=a.length/2-c/2,d=a.length/2+c/2-1,h=[];a.forEach((t,e)=>{t.forEach((t,i)=>{!a[e][i]||e<7&&i<7||e>a.length-8&&i<7||e<7&&i>a.length-8||e>u&&e<d&&i>u&&i<d||h.push([e*s+s/2,i*s+s/2])})});let p={};return h.forEach(([t,e])=>{p[t]?p[t]?.push(e):p[t]=[e]}),Object.entries(p).map(([t,e])=>{let i=e.filter(t=>e.every(e=>!tj(t,e,s)));return[Number(t),i]}).forEach(([t,e])=>{e.forEach(e=>{n.push((0,r.JW)`<circle cx=${t} cy=${e} fill=${o} r=${s/2.5} />`)})}),Object.entries(p).filter(([t,e])=>e.length>1).map(([t,e])=>{let i=e.filter(t=>e.some(e=>tj(t,e,s)));return[Number(t),i]}).map(([t,e])=>{e.sort((t,e)=>t<e?-1:1);let i=[];for(let t of e){let e=i.find(e=>e.some(e=>tj(t,e,s)));e?e.push(t):i.push([t])}return[t,i.map(t=>[t[0],t[t.length-1]])]}).forEach(([t,e])=>{e.forEach(([e,i])=>{n.push((0,r.JW)`
              <line
                x1=${t}
                x2=${t}
                y1=${e}
                y2=${i}
                stroke=${o}
                stroke-width=${s/1.25}
                stroke-linecap="round"
              />
            `)})}),n}},tq=(0,r.AH)`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var tz=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tU=class extends r.WF{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??"#3396ff"}
    `,(0,r.qy)`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){let t="light"===this.theme?this.size:this.size-32;return(0,r.JW)`
      <svg height=${t} width=${t}>
        ${tN.generate({uri:this.uri,size:t,logoSize:this.arenaClear?0:t/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?(0,r.qy)`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?(0,r.qy)`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:(0,r.qy)`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};tU.styles=[f.W5,tq],tz([(0,o.MZ)()],tU.prototype,"uri",void 0),tz([(0,o.MZ)({type:Number})],tU.prototype,"size",void 0),tz([(0,o.MZ)()],tU.prototype,"theme",void 0),tz([(0,o.MZ)()],tU.prototype,"imageSrc",void 0),tz([(0,o.MZ)()],tU.prototype,"alt",void 0),tz([(0,o.MZ)()],tU.prototype,"color",void 0),tz([(0,o.MZ)({type:Boolean})],tU.prototype,"arenaClear",void 0),tz([(0,o.MZ)({type:Boolean})],tU.prototype,"farcaster",void 0),tU=tz([(0,g.E)("wui-qr-code")],tU);let tZ=(0,r.AH)`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`;var tH=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tF=class extends r.WF{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
      border-radius: clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px);
    `,(0,r.qy)`<slot></slot>`}};tF.styles=[tZ],tH([(0,o.MZ)()],tF.prototype,"width",void 0),tH([(0,o.MZ)()],tF.prototype,"height",void 0),tH([(0,o.MZ)()],tF.prototype,"borderRadius",void 0),tH([(0,o.MZ)()],tF.prototype,"variant",void 0),tF=tH([(0,g.E)("wui-shimmer")],tF);let tY=(0,r.AH)`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.9;
  }
`,tJ=class extends r.WF{render(){return(0,r.qy)`
      <a
        data-testid="ux-branding-reown"
        href=${"https://reown.com"}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="xs"
          .padding=${["0","0","l","0"]}
        >
          <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
          <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};tJ.styles=[f.W5,f.fD,tY],tJ=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([(0,g.E)("wui-ux-by-reown")],tJ);let tG=(0,r.AH)`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }
`,tK=class extends tM{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),h.E.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(t=>t()),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),(0,r.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","xl","xl","xl"]}
        gap="xl"
      >
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let t=this.getBoundingClientRect().width-40,e=this.wallet?this.wallet.name:void 0;return P.x.setWcLinking(void 0),P.x.setRecentWallet(this.wallet),(0,r.qy)` <wui-qr-code
      size=${t}
      theme=${tl.W.state.themeMode}
      uri=${this.uri}
      imageSrc=${(0,u.J)(I.$.getWalletImage(this.wallet))}
      color=${(0,u.J)(tl.W.state.themeVariables["--w3m-qr-color"])}
      alt=${(0,u.J)(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let t=!this.uri||!this.ready;return(0,r.qy)`<wui-link
      .disabled=${t}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};tK.styles=tG,tK=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([(0,c.EM)("w3m-connecting-wc-qrcode")],tK);let tV=class extends r.WF{constructor(){if(super(),this.wallet=p.I.state.data?.wallet,!this.wallet)throw Error("w3m-connecting-wc-unsupported: No wallet provided");h.E.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return(0,r.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${(0,u.J)(I.$.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};tV=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([(0,c.EM)("w3m-connecting-wc-unsupported")],tV);var tQ=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let tX=class extends tM{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=tS.oU.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(P.x.subscribeKey("wcUri",()=>{this.updateLoadingState()})),h.E.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:t,name:e}=this.wallet,{redirect:i,href:r}=n.w.formatUniversalUrl(t,this.uri);P.x.setWcLinking({name:e,href:r}),P.x.setRecentWallet(this.wallet),n.w.openHref(i,"_blank")}catch{this.error=!0}}};tQ([(0,o.wk)()],tX.prototype,"isLoading",void 0),tX=tQ([(0,c.EM)("w3m-connecting-wc-web")],tX);var t0=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let t1=class extends r.WF{constructor(){super(),this.wallet=p.I.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!s.H.state.siwx,this.remoteFeatures=s.H.state.remoteFeatures,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(s.H.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return(0,r.qy)`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?(0,r.qy)`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(t=!1){if("browser"!==this.platform&&(!s.H.state.manualWCControl||t))try{let{wcPairingExpiry:e,status:i}=P.x.state;(t||s.H.state.enableEmbedded||n.w.isPairingExpired(e)||"connecting"===i)&&(await P.x.connectWalletConnect(),this.isSiwxEnabled||te.W.close())}catch(t){h.E.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),P.x.setWcError(!0),ti.P.showError(t.message??"Connection error"),P.x.resetWcConnection(),p.I.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:t,desktop_link:e,webapp_link:i,injected:r,rdns:o}=this.wallet,a=r?.map(({injected_id:t})=>t).filter(Boolean),l=[...o?[o]:a??[]],c=!s.H.state.isUniversalProvider&&l.length,u=P.x.checkInstalled(l),d=c&&u,h=e&&!n.w.isMobile();d&&!U.W.state.noAdapters&&this.platforms.push("browser"),t&&this.platforms.push(n.w.isMobile()?"mobile":"qrcode"),i&&this.platforms.push("web"),h&&this.platforms.push("desktop"),d||!c||U.W.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return(0,r.qy)`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return(0,r.qy)`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return(0,r.qy)`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return(0,r.qy)`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return(0,r.qy)`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return(0,r.qy)`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?(0,r.qy)`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(t){let e=this.shadowRoot?.querySelector("div");e&&(await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};t0([(0,o.wk)()],t1.prototype,"platform",void 0),t0([(0,o.wk)()],t1.prototype,"platforms",void 0),t0([(0,o.wk)()],t1.prototype,"isSiwxEnabled",void 0),t0([(0,o.wk)()],t1.prototype,"remoteFeatures",void 0),t1=t0([(0,c.EM)("w3m-connecting-wc-view")],t1);var t3=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let t2=class extends r.WF{constructor(){super(...arguments),this.isMobile=n.w.isMobile()}render(){if(this.isMobile){let{featured:t,recommended:e}=a.N.state,{customWallets:i}=s.H.state,o=l.i.getRecentWallets(),n=t.length||e.length||i?.length||o.length;return(0,r.qy)`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${n?(0,r.qy)`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return(0,r.qy)`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};t3([(0,o.wk)()],t2.prototype,"isMobile",void 0),t2=t3([(0,c.EM)("w3m-connecting-wc-basic-view")],t2);var t5=i(47104),t4=i(86977),t8=i(17300);let t6=()=>new t7;class t7{}let t9=new WeakMap,et=(0,t8.u$)(class extends t4.Kq{render(t){return t5.s6}update(t,[e]){let i=e!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),t5.s6}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){let e=this.ht??globalThis,i=t9.get(e);void 0===i&&(i=new WeakMap,t9.set(e,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?t9.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),ee=(0,r.AH)`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`;var ei=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let er=class extends r.WF{constructor(){super(...arguments),this.inputElementRef=t6(),this.checked=void 0}render(){return(0,r.qy)`
      <label>
        <input
          ${et(this.inputElementRef)}
          type="checkbox"
          ?checked=${(0,u.J)(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};er.styles=[f.W5,f.fD,f.ck,ee],ei([(0,o.MZ)({type:Boolean})],er.prototype,"checked",void 0),er=ei([(0,g.E)("wui-switch")],er);let eo=(0,r.AH)`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var en=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ea=class extends r.WF{constructor(){super(...arguments),this.checked=void 0}render(){return(0,r.qy)`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${(0,u.J)(this.checked)}></wui-switch>
      </button>
    `}};ea.styles=[f.W5,f.fD,eo],en([(0,o.MZ)({type:Boolean})],ea.prototype,"checked",void 0),ea=en([(0,g.E)("wui-certified-switch")],ea);let es=(0,r.AH)`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`;var el=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ec=class extends r.WF{constructor(){super(...arguments),this.icon="copy"}render(){return(0,r.qy)`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};ec.styles=[f.W5,f.fD,es],el([(0,o.MZ)()],ec.prototype,"icon",void 0),ec=el([(0,g.E)("wui-input-element")],ec);var eu=i(88563);let ed=(0,r.AH)`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md,
  wui-loading-spinner + .wui-size-md {
    padding: 10.5px var(--wui-spacing-3xl) 10.5px var(--wui-spacing-3xl);
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-lg {
    padding: var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-l);
    letter-spacing: var(--wui-letter-spacing-medium-title);
    font-size: var(--wui-font-size-medium-title);
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    color: var(--wui-color-fg-100);
    height: 64px;
  }

  .wui-padding-right-xs {
    padding-right: var(--wui-spacing-xs);
  }

  .wui-padding-right-s {
    padding-right: var(--wui-spacing-s);
  }

  .wui-padding-right-m {
    padding-right: var(--wui-spacing-m);
  }

  .wui-padding-right-l {
    padding-right: var(--wui-spacing-l);
  }

  .wui-padding-right-xl {
    padding-right: var(--wui-spacing-xl);
  }

  .wui-padding-right-2xl {
    padding-right: var(--wui-spacing-2xl);
  }

  .wui-padding-right-3xl {
    padding-right: var(--wui-spacing-3xl);
  }

  .wui-padding-right-4xl {
    padding-right: var(--wui-spacing-4xl);
  }

  .wui-padding-right-5xl {
    padding-right: var(--wui-spacing-5xl);
  }

  wui-icon + .wui-size-lg,
  wui-loading-spinner + .wui-size-lg {
    padding-left: 50px;
  }

  wui-icon[data-input='lg'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-m) 17.25px var(--wui-spacing-m);
  }
  wui-icon + .wui-size-mdl,
  wui-loading-spinner + .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-3xl) 17.25px 40px;
  }
  wui-icon[data-input='mdl'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`;var eh=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ep=class extends r.WF{constructor(){super(...arguments),this.inputElementRef=t6(),this.size="md",this.disabled=!1,this.placeholder="",this.type="text",this.value=""}render(){let t=`wui-padding-right-${this.inputRightPadding}`,e={[`wui-size-${this.size}`]:!0,[t]:!!this.inputRightPadding};return(0,r.qy)`${this.templateIcon()}
      <input
        data-testid="wui-input-text"
        ${et(this.inputElementRef)}
        class=${(0,eu.H)(e)}
        type=${this.type}
        enterkeyhint=${(0,u.J)(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
        .value=${this.value||""}
        tabindex=${(0,u.J)(this.tabIdx)}
      />
      <slot></slot>`}templateIcon(){return this.icon?(0,r.qy)`<wui-icon
        data-input=${this.size}
        size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};ep.styles=[f.W5,f.fD,ed],eh([(0,o.MZ)()],ep.prototype,"size",void 0),eh([(0,o.MZ)()],ep.prototype,"icon",void 0),eh([(0,o.MZ)({type:Boolean})],ep.prototype,"disabled",void 0),eh([(0,o.MZ)()],ep.prototype,"placeholder",void 0),eh([(0,o.MZ)()],ep.prototype,"type",void 0),eh([(0,o.MZ)()],ep.prototype,"keyHint",void 0),eh([(0,o.MZ)()],ep.prototype,"value",void 0),eh([(0,o.MZ)()],ep.prototype,"inputRightPadding",void 0),eh([(0,o.MZ)()],ep.prototype,"tabIdx",void 0),ep=eh([(0,g.E)("wui-input-text")],ep);let ef=(0,r.AH)`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`,eg=class extends r.WF{constructor(){super(...arguments),this.inputComponentRef=t6()}render(){return(0,r.qy)`
      <wui-input-text
        ${et(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){let t=this.inputComponentRef.value,e=t?.inputElementRef.value;e&&(e.value="",e.focus(),e.dispatchEvent(new Event("input")))}};eg.styles=[f.W5,ef],eg=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([(0,g.E)("wui-search-bar")],eg);let ew=(0,r.JW)`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`,eb=(0,r.AH)`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var em=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ey=class extends r.WF{constructor(){super(...arguments),this.type="wallet"}render(){return(0,r.qy)`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?(0,r.qy)` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${ew}`:(0,r.qy)`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};ey.styles=[f.W5,f.fD,eb],em([(0,o.MZ)()],ey.prototype,"type",void 0),ey=em([(0,g.E)("wui-card-select-loader")],ey);var ev=i(40838);let ex=(0,r.AH)`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var e_=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let ek=class extends r.WF{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&ev.Z.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&ev.Z.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&ev.Z.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&ev.Z.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&ev.Z.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&ev.Z.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&ev.Z.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&ev.Z.getSpacingStyles(this.margin,3)};
    `,(0,r.qy)`<slot></slot>`}};ek.styles=[f.W5,ex],e_([(0,o.MZ)()],ek.prototype,"gridTemplateRows",void 0),e_([(0,o.MZ)()],ek.prototype,"gridTemplateColumns",void 0),e_([(0,o.MZ)()],ek.prototype,"justifyItems",void 0),e_([(0,o.MZ)()],ek.prototype,"alignItems",void 0),e_([(0,o.MZ)()],ek.prototype,"justifyContent",void 0),e_([(0,o.MZ)()],ek.prototype,"alignContent",void 0),e_([(0,o.MZ)()],ek.prototype,"columnGap",void 0),e_([(0,o.MZ)()],ek.prototype,"rowGap",void 0),e_([(0,o.MZ)()],ek.prototype,"gap",void 0),e_([(0,o.MZ)()],ek.prototype,"padding",void 0),e_([(0,o.MZ)()],ek.prototype,"margin",void 0),ek=e_([(0,g.E)("wui-grid")],ek);let eC=(0,r.AH)`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var eE=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let eR=class extends r.WF{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let t=this.wallet?.badge_type==="certified";return(0,r.qy)`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${(0,u.J)(t?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${t?(0,r.qy)`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return(this.visible||this.imageSrc)&&!this.imageLoading?(0,r.qy)`
      <wui-wallet-image
        size="md"
        imageSrc=${(0,u.J)(this.imageSrc)}
        name=${this.wallet?.name}
        .installed=${this.wallet?.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `:this.shimmerTemplate()}shimmerTemplate(){return(0,r.qy)`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=I.$.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await I.$.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};eR.styles=eC,eE([(0,o.wk)()],eR.prototype,"visible",void 0),eE([(0,o.wk)()],eR.prototype,"imageSrc",void 0),eE([(0,o.wk)()],eR.prototype,"imageLoading",void 0),eE([(0,o.MZ)()],eR.prototype,"wallet",void 0),eR=eE([(0,c.EM)("w3m-all-wallets-list-item")],eR);let eI=(0,r.AH)`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var eT=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let e$="local-paginator",eO=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!a.N.state.wallets.length,this.wallets=a.N.state.wallets,this.recommended=a.N.state.recommended,this.featured=a.N.state.featured,this.filteredWallets=a.N.state.filteredWallets,this.unsubscribe.push(a.N.subscribeKey("wallets",t=>this.wallets=t),a.N.subscribeKey("recommended",t=>this.recommended=t),a.N.subscribeKey("featured",t=>this.featured=t),a.N.subscribeKey("filteredWallets",t=>this.filteredWallets=t))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.paginationObserver?.disconnect()}render(){return(0,r.qy)`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let t=this.shadowRoot?.querySelector("wui-grid");t&&(await a.N.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(t,e){return[...Array(t)].map(()=>(0,r.qy)`
        <wui-card-select-loader type="wallet" id=${(0,u.J)(e)}></wui-card-select-loader>
      `)}walletsTemplate(){let t=this.filteredWallets?.length>0?n.w.uniqueBy([...this.featured,...this.recommended,...this.filteredWallets],"id"):n.w.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id");return Z.A.markWalletsAsInstalled(t).map(t=>(0,r.qy)`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(t)}
          .wallet=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:t,recommended:e,featured:i,count:r}=a.N.state,o=window.innerWidth<352?3:4,n=t.length+e.length,s=Math.ceil(n/o)*o-n+o;return(s-=t.length?i.length%o:0,0===r&&i.length>0)?null:0===r||[...i,...t,...e].length<r?this.shimmerTemplate(s,e$):null}createPaginationObserver(){let t=this.shadowRoot?.querySelector(`#${e$}`);t&&(this.paginationObserver=new IntersectionObserver(([t])=>{if(t?.isIntersecting&&!this.loading){let{page:t,count:e,wallets:i}=a.N.state;i.length<e&&a.N.fetchWalletsByPage({page:t+1})}}),this.paginationObserver.observe(t))}onConnectWallet(t){d.a.selectWalletConnector(t)}};eO.styles=eI,eT([(0,o.wk)()],eO.prototype,"loading",void 0),eT([(0,o.wk)()],eO.prototype,"wallets",void 0),eT([(0,o.wk)()],eO.prototype,"recommended",void 0),eT([(0,o.wk)()],eO.prototype,"featured",void 0),eT([(0,o.wk)()],eO.prototype,"filteredWallets",void 0),eO=eT([(0,c.EM)("w3m-all-wallets-list")],eO);let eP=(0,r.AH)`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var eM=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let eA=class extends r.WF{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?(0,r.qy)`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await a.N.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:t}=a.N.state,e=Z.A.markWalletsAsInstalled(t);return t.length?(0,r.qy)`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${e.map(t=>(0,r.qy)`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(t)}
              .wallet=${t}
              data-testid="wallet-search-item-${t.id}"
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:(0,r.qy)`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(t){d.a.selectWalletConnector(t)}};eA.styles=eP,eM([(0,o.wk)()],eA.prototype,"loading",void 0),eM([(0,o.MZ)()],eA.prototype,"query",void 0),eM([(0,o.MZ)()],eA.prototype,"badge",void 0),eA=eM([(0,c.EM)("w3m-all-wallets-search")],eA);var eL=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let eS=class extends r.WF{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=n.w.debounce(t=>{this.search=t})}render(){let t=this.search.length>=2;return(0,r.qy)`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?(0,r.qy)`<w3m-all-wallets-search
            query=${this.search}
            badge=${(0,u.J)(this.badge)}
          ></w3m-all-wallets-search>`:(0,r.qy)`<w3m-all-wallets-list badge=${(0,u.J)(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onClick(){if("certified"===this.badge){this.badge=void 0;return}this.badge="certified",ti.P.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})}qrButtonTemplate(){return n.w.isMobile()?(0,r.qy)`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){p.I.push("ConnectingWalletConnect")}};eL([(0,o.wk)()],eS.prototype,"search",void 0),eL([(0,o.wk)()],eS.prototype,"badge",void 0),eS=eL([(0,c.EM)("w3m-all-wallets-view")],eS);let eB=(0,r.AH)`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var eW=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let eD=class extends r.WF{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return(0,r.qy)`
      <button
        ?disabled=${!!this.loading||!!this.disabled}
        data-loading=${this.loading}
        data-iconvariant=${(0,u.J)(this.iconVariant)}
        tabindex=${(0,u.J)(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if("image"===this.variant&&this.imageSrc)return(0,r.qy)`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if("square"===this.iconVariant&&this.icon&&"icon"===this.variant)return(0,r.qy)`<wui-icon name=${this.icon}></wui-icon>`;if("icon"===this.variant&&this.icon&&this.iconVariant){let t=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",e="square-blue"===this.iconVariant?"mdl":"md",i=this.iconSize?this.iconSize:e;return(0,r.qy)`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${i}
          background="transparent"
          iconColor=${t}
          backgroundColor=${t}
          size=${e}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?(0,r.qy)`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:(0,r.qy)``}chevronTemplate(){return this.chevron?(0,r.qy)`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};eD.styles=[f.W5,f.fD,eB],eW([(0,o.MZ)()],eD.prototype,"icon",void 0),eW([(0,o.MZ)()],eD.prototype,"iconSize",void 0),eW([(0,o.MZ)()],eD.prototype,"tabIdx",void 0),eW([(0,o.MZ)()],eD.prototype,"variant",void 0),eW([(0,o.MZ)()],eD.prototype,"iconVariant",void 0),eW([(0,o.MZ)({type:Boolean})],eD.prototype,"disabled",void 0),eW([(0,o.MZ)()],eD.prototype,"imageSrc",void 0),eW([(0,o.MZ)()],eD.prototype,"alt",void 0),eW([(0,o.MZ)({type:Boolean})],eD.prototype,"chevron",void 0),eW([(0,o.MZ)({type:Boolean})],eD.prototype,"loading",void 0),eD=eW([(0,g.E)("wui-list-item")],eD);let ej=class extends r.WF{constructor(){super(...arguments),this.wallet=p.I.state.data?.wallet}render(){if(!this.wallet)throw Error("w3m-downloads-view");return(0,r.qy)`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?(0,r.qy)`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?(0,r.qy)`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?(0,r.qy)`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?(0,r.qy)`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&n.w.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&n.w.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&n.w.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&n.w.openHref(this.wallet.homepage,"_blank")}};ej=function(t,e,i,r){var o,n=arguments.length,a=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}([(0,c.EM)("w3m-downloads-view")],ej)},80708:(t,e,i)=>{let r=i(54779),o=i(99545);e.render=function(t,e,i){return e&&e.small?o.render(t,e,i):r.render(t,e,i)}},81031:t=>{"use strict";t.exports=function(t,e,i){let r=t+e-i,o=Math.abs(r-t),n=Math.abs(r-e),a=Math.abs(r-i);return o<=n&&o<=a?t:n<=a?e:i}},82951:(t,e)=>{let i,r=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];e.getSymbolSize=function(t){if(!t)throw Error('"version" cannot be null or undefined');if(t<1||t>40)throw Error('"version" should be in range from 1 to 40');return 4*t+17},e.getSymbolTotalCodewords=function(t){return r[t]},e.getBCHDigit=function(t){let e=0;for(;0!==t;)e++,t>>>=1;return e},e.setToSJISFunction=function(t){if("function"!=typeof t)throw Error('"toSJISFunc" is not a valid function.');i=t},e.isKanjiModeEnabled=function(){return void 0!==i},e.toSJIS=function(t){return i(t)}},83528:(t,e,i)=>{let r=i(82951).getSymbolSize;e.getRowColCoords=function(t){if(1===t)return[];let e=Math.floor(t/7)+2,i=r(t),o=145===i?26:2*Math.ceil((i-13)/(2*e-2)),n=[i-7];for(let t=1;t<e-1;t++)n[t]=n[t-1]-o;return n.push(6),n.reverse()},e.getPositions=function(t){let i=[],r=e.getRowColCoords(t),o=r.length;for(let t=0;t<o;t++)for(let e=0;e<o;e++)(0!==t||0!==e)&&(0!==t||e!==o-1)&&(t!==o-1||0!==e)&&i.push([r[t],r[e]]);return i}},85073:t=>{"use strict";t.exports={PNG_SIGNATURE:[137,80,78,71,13,10,26,10],TYPE_IHDR:0x49484452,TYPE_IEND:0x49454e44,TYPE_IDAT:0x49444154,TYPE_PLTE:0x504c5445,TYPE_tRNS:0x74524e53,TYPE_gAMA:0x67414d41,COLORTYPE_GRAYSCALE:0,COLORTYPE_PALETTE:1,COLORTYPE_COLOR:2,COLORTYPE_ALPHA:4,COLORTYPE_PALETTE_COLOR:3,COLORTYPE_COLOR_ALPHA:6,COLORTYPE_TO_BPP_MAP:{0:1,2:3,3:1,4:2,6:4},GAMMA_DIVISION:1e5}},87134:(t,e)=>{e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2},e.isValid=function(t){return t&&void 0!==t.bit&&t.bit>=0&&t.bit<4},e.from=function(t,i){if(e.isValid(t))return t;try{if("string"!=typeof t)throw Error("Param is not a string");switch(t.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw Error("Unknown EC Level: "+t)}return}catch(t){return i}}},88009:(t,e,i)=>{let r=i(29021),o=i(37267).O,n=i(22943);e.render=function(t,e){let i=n.getOptions(e),r=i.rendererOpts,a=n.getImageWidth(t.modules.size,i);r.width=a,r.height=a;let s=new o(r);return n.qrToImageData(s.data,t,i),s},e.renderToDataURL=function(t,i,r){void 0===r&&(r=i,i=void 0),e.renderToBuffer(t,i,function(t,e){t&&r(t);let i="data:image/png;base64,";i+=e.toString("base64"),r(null,i)})},e.renderToBuffer=function(t,i,r){void 0===r&&(r=i,i=void 0);let o=e.render(t,i),n=[];o.on("error",r),o.on("data",function(t){n.push(t)}),o.on("end",function(){r(null,Buffer.concat(n))}),o.pack()},e.renderToFile=function(t,i,o,n){void 0===n&&(n=o,o=void 0);let a=!1,s=(...t)=>{a||(a=!0,n.apply(null,t))},l=r.createWriteStream(t);l.on("error",s),l.on("close",s),e.renderToFileStream(l,i,o)},e.renderToFileStream=function(t,i,r){e.render(i,r).pack().pipe(t)}},90678:(t,e,i)=>{let r=i(82951),o=i(87134),n=i(27620),a=i(75243),s=i(83528),l=i(45343),c=i(49399),u=i(25579),d=i(5487),h=i(93354),p=i(22948),f=i(74887),g=i(45314);function w(t,e,i){let r,o,n=t.size,a=p.getEncodedBits(e,i);for(r=0;r<15;r++)o=(a>>r&1)==1,r<6?t.set(r,8,o,!0):r<8?t.set(r+1,8,o,!0):t.set(n-15+r,8,o,!0),r<8?t.set(8,n-r-1,o,!0):r<9?t.set(8,15-r-1+1,o,!0):t.set(8,15-r-1,o,!0);t.set(n-8,8,1,!0)}e.create=function(t,e){let i,p;if(void 0===t||""===t)throw Error("No input text");let b=o.M;return void 0!==e&&(b=o.from(e.errorCorrectionLevel,o.M),i=h.from(e.version),p=c.from(e.maskPattern),e.toSJISFunc&&r.setToSJISFunction(e.toSJISFunc)),function(t,e,i,o){let p;if(Array.isArray(t))p=g.fromArray(t);else if("string"==typeof t){let r=e;if(!r){let e=g.rawSplit(t);r=h.getBestVersionForData(e,i)}p=g.fromString(t,r||40)}else throw Error("Invalid data");let b=h.getBestVersionForData(p,i);if(!b)throw Error("The amount of data is too big to be stored in a QR Code");if(e){if(e<b)throw Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: "+b+".\n")}else e=b;let m=function(t,e,i){let o=new n;i.forEach(function(e){o.put(e.mode.bit,4),o.put(e.getLength(),f.getCharCountIndicator(e.mode,t)),e.write(o)});let a=(r.getSymbolTotalCodewords(t)-u.getTotalCodewordsCount(t,e))*8;for(o.getLengthInBits()+4<=a&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(0);let s=(a-o.getLengthInBits())/8;for(let t=0;t<s;t++)o.put(t%2?17:236,8);return function(t,e,i){let o,n,a=r.getSymbolTotalCodewords(e),s=a-u.getTotalCodewordsCount(e,i),l=u.getBlocksCount(e,i),c=a%l,h=l-c,p=Math.floor(a/l),f=Math.floor(s/l),g=f+1,w=p-f,b=new d(w),m=0,y=Array(l),v=Array(l),x=0,_=new Uint8Array(t.buffer);for(let t=0;t<l;t++){let e=t<h?f:g;y[t]=_.slice(m,m+e),v[t]=b.encode(y[t]),m+=e,x=Math.max(x,e)}let k=new Uint8Array(a),C=0;for(o=0;o<x;o++)for(n=0;n<l;n++)o<y[n].length&&(k[C++]=y[n][o]);for(o=0;o<w;o++)for(n=0;n<l;n++)k[C++]=v[n][o];return k}(o,t,e)}(e,i,p),y=new a(r.getSymbolSize(e));!function(t,e){let i=t.size,r=l.getPositions(e);for(let e=0;e<r.length;e++){let o=r[e][0],n=r[e][1];for(let e=-1;e<=7;e++)if(!(o+e<=-1)&&!(i<=o+e))for(let r=-1;r<=7;r++)n+r<=-1||i<=n+r||(e>=0&&e<=6&&(0===r||6===r)||r>=0&&r<=6&&(0===e||6===e)||e>=2&&e<=4&&r>=2&&r<=4?t.set(o+e,n+r,!0,!0):t.set(o+e,n+r,!1,!0))}}(y,e);let v=y.size;for(let t=8;t<v-8;t++){let e=t%2==0;y.set(t,6,e,!0),y.set(6,t,e,!0)}return function(t,e){let i=s.getPositions(e);for(let e=0;e<i.length;e++){let r=i[e][0],o=i[e][1];for(let e=-2;e<=2;e++)for(let i=-2;i<=2;i++)-2===e||2===e||-2===i||2===i||0===e&&0===i?t.set(r+e,o+i,!0,!0):t.set(r+e,o+i,!1,!0)}}(y,e),w(y,i,0),e>=7&&function(t,e){let i,r,o,n=t.size,a=h.getEncodedBits(e);for(let e=0;e<18;e++)i=Math.floor(e/3),r=e%3+n-8-3,o=(a>>e&1)==1,t.set(i,r,o,!0),t.set(r,i,o,!0)}(y,e),function(t,e){let i=t.size,r=-1,o=i-1,n=7,a=0;for(let s=i-1;s>0;s-=2)for(6===s&&s--;;){for(let i=0;i<2;i++)if(!t.isReserved(o,s-i)){let r=!1;a<e.length&&(r=(e[a]>>>n&1)==1),t.set(o,s-i,r),-1==--n&&(a++,n=7)}if((o+=r)<0||i<=o){o-=r,r=-r;break}}}(y,m),isNaN(o)&&(o=c.getBestMask(y,w.bind(null,y,i))),c.applyMask(o,y),w(y,i,o),{modules:y,version:e,errorCorrectionLevel:i,maskPattern:o,segments:p}}(t,i,b,p)}},91670:(t,e,i)=>{let r=i(74887);function o(t){this.mode=r.NUMERIC,this.data=t.toString()}o.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)},o.prototype.getLength=function(){return this.data.length},o.prototype.getBitsLength=function(){return o.getBitsLength(this.data.length)},o.prototype.write=function(t){let e,i,r;for(e=0;e+3<=this.data.length;e+=3)r=parseInt(this.data.substr(e,3),10),t.put(r,10);let o=this.data.length-e;o>0&&(r=parseInt(this.data.substr(e),10),t.put(r,3*o+1))},t.exports=o},93354:(t,e,i)=>{let r=i(82951),o=i(25579),n=i(87134),a=i(74887),s=i(24539),l=r.getBCHDigit(7973);function c(t,e){return a.getCharCountIndicator(t,e)+4}e.from=function(t,e){return s.isValid(t)?parseInt(t,10):e},e.getCapacity=function(t,e,i){if(!s.isValid(t))throw Error("Invalid QR Code version");void 0===i&&(i=a.BYTE);let n=(r.getSymbolTotalCodewords(t)-o.getTotalCodewordsCount(t,e))*8;if(i===a.MIXED)return n;let l=n-c(i,t);switch(i){case a.NUMERIC:return Math.floor(l/10*3);case a.ALPHANUMERIC:return Math.floor(l/11*2);case a.KANJI:return Math.floor(l/13);case a.BYTE:default:return Math.floor(l/8)}},e.getBestVersionForData=function(t,i){let r,o=n.from(i,n.M);if(Array.isArray(t)){if(t.length>1){for(let i=1;i<=40;i++)if(function(t,e){let i=0;return t.forEach(function(t){let r=c(t.mode,e);i+=r+t.getBitsLength()}),i}(t,i)<=e.getCapacity(i,o,a.MIXED))return i;return}if(0===t.length)return 1;r=t[0]}else r=t;return function(t,i,r){for(let o=1;o<=40;o++)if(i<=e.getCapacity(o,r,t))return o}(r.mode,r.getLength(),o)},e.getEncodedBits=function(t){if(!s.isValid(t)||t<7)throw Error("Invalid QR Code version");let e=t<<12;for(;r.getBCHDigit(e)-l>=0;)e^=7973<<r.getBCHDigit(e)-l;return t<<12|e}},94710:t=>{t.exports=function(){return"function"==typeof Promise&&Promise.prototype&&Promise.prototype.then}},94889:(t,e,i)=>{"use strict";let r=i(85073);t.exports=function(t,e,i,o){let n=-1!==[r.COLORTYPE_COLOR_ALPHA,r.COLORTYPE_ALPHA].indexOf(o.colorType);if(o.colorType===o.inputColorType){let e,i=(new DataView(e=new ArrayBuffer(2)).setInt16(0,256,!0),256!==new Int16Array(e)[0]);if(8===o.bitDepth||16===o.bitDepth&&i)return t}let a=16!==o.bitDepth?t:new Uint16Array(t.buffer),s=255,l=r.COLORTYPE_TO_BPP_MAP[o.inputColorType];4!==l||o.inputHasAlpha||(l=3);let c=r.COLORTYPE_TO_BPP_MAP[o.colorType];16===o.bitDepth&&(s=65535,c*=2);let u=Buffer.alloc(e*i*c),d=0,h=0,p=o.bgColor||{};void 0===p.red&&(p.red=s),void 0===p.green&&(p.green=s),void 0===p.blue&&(p.blue=s);for(let t=0;t<i;t++)for(let t=0;t<e;t++){let t=function(){let t,e,i,l=s;switch(o.inputColorType){case r.COLORTYPE_COLOR_ALPHA:l=a[d+3],t=a[d],e=a[d+1],i=a[d+2];break;case r.COLORTYPE_COLOR:t=a[d],e=a[d+1],i=a[d+2];break;case r.COLORTYPE_ALPHA:l=a[d+1],e=t=a[d],i=t;break;case r.COLORTYPE_GRAYSCALE:e=t=a[d],i=t;break;default:throw Error("input color type:"+o.inputColorType+" is not supported at present")}return o.inputHasAlpha&&!n&&(l/=s,t=Math.min(Math.max(Math.round((1-l)*p.red+l*t),0),s),e=Math.min(Math.max(Math.round((1-l)*p.green+l*e),0),s),i=Math.min(Math.max(Math.round((1-l)*p.blue+l*i),0),s)),{red:t,green:e,blue:i,alpha:l}}(a,d);switch(o.colorType){case r.COLORTYPE_COLOR_ALPHA:case r.COLORTYPE_COLOR:8===o.bitDepth?(u[h]=t.red,u[h+1]=t.green,u[h+2]=t.blue,n&&(u[h+3]=t.alpha)):(u.writeUInt16BE(t.red,h),u.writeUInt16BE(t.green,h+2),u.writeUInt16BE(t.blue,h+4),n&&u.writeUInt16BE(t.alpha,h+6));break;case r.COLORTYPE_ALPHA:case r.COLORTYPE_GRAYSCALE:{let e=(t.red+t.green+t.blue)/3;8===o.bitDepth?(u[h]=e,n&&(u[h+1]=t.alpha)):(u.writeUInt16BE(e,h),n&&u.writeUInt16BE(t.alpha,h+2));break}default:throw Error("unrecognised color Type "+o.colorType)}d+=l,h+=c}return u}},99545:(t,e)=>{let i="\x1b[37m",r="\x1b[30m",o="\x1b[0m",n="\x1b[47m"+r,a="\x1b[40m"+i,s=function(t,e,i,r){let o=e+1;return i>=o||r>=o||r<-1||i<-1?"0":i>=e||r>=e||r<0||i<0?"1":t[r*e+i]?"2":"1"},l=function(t,e,i,r){return s(t,e,i,r)+s(t,e,i,r+1)};e.render=function(t,e,s){var c,u;let d=t.modules.size,h=t.modules.data,p=!!(e&&e.inverse),f=e&&e.inverse?a:n,g={"00":o+" "+f,"01":o+(c=p?r:i)+"▄"+f,"02":o+(u=p?i:r)+"▄"+f,10:o+c+"▀"+f,11:" ",12:"▄",20:o+u+"▀"+f,21:"▀",22:"█"},w=o+"\n"+f,b=f;for(let t=-1;t<d+1;t+=2){for(let e=-1;e<d;e++)b+=g[l(h,d,e,t)];b+=g[l(h,d,d,t)]+w}return b+=o,"function"==typeof s&&s(null,b),b}},99705:(t,e,i)=>{"use strict";let r=i(85073),o=i(9066),n=t.exports=function(t,e){this._options=t,t.checkCRC=!1!==t.checkCRC,this._hasIHDR=!1,this._hasIEND=!1,this._emittedHeadersFinished=!1,this._palette=[],this._colorType=0,this._chunks={},this._chunks[r.TYPE_IHDR]=this._handleIHDR.bind(this),this._chunks[r.TYPE_IEND]=this._handleIEND.bind(this),this._chunks[r.TYPE_IDAT]=this._handleIDAT.bind(this),this._chunks[r.TYPE_PLTE]=this._handlePLTE.bind(this),this._chunks[r.TYPE_tRNS]=this._handleTRNS.bind(this),this._chunks[r.TYPE_gAMA]=this._handleGAMA.bind(this),this.read=e.read,this.error=e.error,this.metadata=e.metadata,this.gamma=e.gamma,this.transColor=e.transColor,this.palette=e.palette,this.parsed=e.parsed,this.inflateData=e.inflateData,this.finished=e.finished,this.simpleTransparency=e.simpleTransparency,this.headersFinished=e.headersFinished||function(){}};n.prototype.start=function(){this.read(r.PNG_SIGNATURE.length,this._parseSignature.bind(this))},n.prototype._parseSignature=function(t){let e=r.PNG_SIGNATURE;for(let i=0;i<e.length;i++)if(t[i]!==e[i]){this.error(Error("Invalid file signature"));return}this.read(8,this._parseChunkBegin.bind(this))},n.prototype._parseChunkBegin=function(t){let e=t.readUInt32BE(0),i=t.readUInt32BE(4),n="";for(let e=4;e<8;e++)n+=String.fromCharCode(t[e]);let a=!!(32&t[4]);if(!this._hasIHDR&&i!==r.TYPE_IHDR){this.error(Error("Expected IHDR on beggining"));return}if(this._crc=new o,this._crc.write(Buffer.from(n)),this._chunks[i])return this._chunks[i](e);if(!a){this.error(Error("Unsupported critical chunk type "+n));return}this.read(e+4,this._skipChunk.bind(this))},n.prototype._skipChunk=function(){this.read(8,this._parseChunkBegin.bind(this))},n.prototype._handleChunkEnd=function(){this.read(4,this._parseChunkEnd.bind(this))},n.prototype._parseChunkEnd=function(t){let e=t.readInt32BE(0),i=this._crc.crc32();if(this._options.checkCRC&&i!==e){this.error(Error("Crc error - "+e+" - "+i));return}this._hasIEND||this.read(8,this._parseChunkBegin.bind(this))},n.prototype._handleIHDR=function(t){this.read(t,this._parseIHDR.bind(this))},n.prototype._parseIHDR=function(t){this._crc.write(t);let e=t.readUInt32BE(0),i=t.readUInt32BE(4),o=t[8],n=t[9],a=t[10],s=t[11],l=t[12];if(8!==o&&4!==o&&2!==o&&1!==o&&16!==o){this.error(Error("Unsupported bit depth "+o));return}if(!(n in r.COLORTYPE_TO_BPP_MAP)){this.error(Error("Unsupported color type"));return}if(0!==a){this.error(Error("Unsupported compression method"));return}if(0!==s){this.error(Error("Unsupported filter method"));return}if(0!==l&&1!==l){this.error(Error("Unsupported interlace method"));return}this._colorType=n;let c=r.COLORTYPE_TO_BPP_MAP[this._colorType];this._hasIHDR=!0,this.metadata({width:e,height:i,depth:o,interlace:!!l,palette:!!(n&r.COLORTYPE_PALETTE),color:!!(n&r.COLORTYPE_COLOR),alpha:!!(n&r.COLORTYPE_ALPHA),bpp:c,colorType:n}),this._handleChunkEnd()},n.prototype._handlePLTE=function(t){this.read(t,this._parsePLTE.bind(this))},n.prototype._parsePLTE=function(t){this._crc.write(t);let e=Math.floor(t.length/3);for(let i=0;i<e;i++)this._palette.push([t[3*i],t[3*i+1],t[3*i+2],255]);this.palette(this._palette),this._handleChunkEnd()},n.prototype._handleTRNS=function(t){this.simpleTransparency(),this.read(t,this._parseTRNS.bind(this))},n.prototype._parseTRNS=function(t){if(this._crc.write(t),this._colorType===r.COLORTYPE_PALETTE_COLOR){if(0===this._palette.length){this.error(Error("Transparency chunk must be after palette"));return}if(t.length>this._palette.length){this.error(Error("More transparent colors than palette size"));return}for(let e=0;e<t.length;e++)this._palette[e][3]=t[e];this.palette(this._palette)}this._colorType===r.COLORTYPE_GRAYSCALE&&this.transColor([t.readUInt16BE(0)]),this._colorType===r.COLORTYPE_COLOR&&this.transColor([t.readUInt16BE(0),t.readUInt16BE(2),t.readUInt16BE(4)]),this._handleChunkEnd()},n.prototype._handleGAMA=function(t){this.read(t,this._parseGAMA.bind(this))},n.prototype._parseGAMA=function(t){this._crc.write(t),this.gamma(t.readUInt32BE(0)/r.GAMMA_DIVISION),this._handleChunkEnd()},n.prototype._handleIDAT=function(t){this._emittedHeadersFinished||(this._emittedHeadersFinished=!0,this.headersFinished()),this.read(-t,this._parseIDAT.bind(this,t))},n.prototype._parseIDAT=function(t,e){if(this._crc.write(e),this._colorType===r.COLORTYPE_PALETTE_COLOR&&0===this._palette.length)throw Error("Expected palette not found");this.inflateData(e);let i=t-e.length;i>0?this._handleIDAT(i):this._handleChunkEnd()},n.prototype._handleIEND=function(t){this.read(t,this._parseIEND.bind(this))},n.prototype._parseIEND=function(t){this._crc.write(t),this._hasIEND=!0,this._handleChunkEnd(),this.finished&&this.finished()}}};