if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let i=Promise.resolve();return c[e]||(i=new Promise(async i=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=i}else importScripts(e),i()})),i.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},i=(i,c)=>{Promise.all(i.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(i)};self.define=(i,r,d)=>{c[i]||(c[i]=Promise.resolve().then(()=>{let c={};const t={uri:location.origin+i.slice(1)};return Promise.all(r.map(i=>{switch(i){case"exports":return c;case"module":return t;default:return e(i)}})).then(e=>{const i=d(...e);return c.default||(c.default=i),c})}))}}define("./service-worker.js",["./workbox-7c85bfc1"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"dict/base.dat.gz",revision:"7c8bbced46e88cdb77c9c66c9ca9fbcb"},{url:"dict/cc.dat.gz",revision:"05321caff24f87d1bed64fe1d44576fc"},{url:"dict/check.dat.gz",revision:"dcbeea0429520f5e669a75ff504241a7"},{url:"dict/tid.dat.gz",revision:"48d8e87b50f900b4795e55e9a70c2696"},{url:"dict/tid_map.dat.gz",revision:"ab259890529abb432a5c20aff4efb021"},{url:"dict/tid_pos.dat.gz",revision:"6b89472ae7b079cc8cb6d5758356ff37"},{url:"dict/unk.dat.gz",revision:"9229f1b8c742cd15ff3229ed3700112a"},{url:"dict/unk_char.dat.gz",revision:"557c5cc25a480e1946150625face4c91"},{url:"dict/unk_compat.dat.gz",revision:"da69ebce7400cc6ba01f5ce19d3108f1"},{url:"dict/unk_invoke.dat.gz",revision:"6b5a7c42a945cbba596148fecc2d56b4"},{url:"dict/unk_map.dat.gz",revision:"eda6e0354662ee169e817f5848ab56d4"},{url:"dict/unk_pos.dat.gz",revision:"5986e78e268fa51e3e119511ec914dd9"},{url:"favicon.png",revision:"daa807aa932db3b33fabe29364f5a674"},{url:"index.html",revision:"8fe57f0b4f4db415c068ee90052dadef"},{url:"main.js",revision:"4633c3cd187605547234cea78f5b5375"},{url:"manifest.json",revision:"0c3dbf41823f48f1460e970efb7daf75"}],{})}));
