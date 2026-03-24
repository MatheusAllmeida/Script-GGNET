// ==UserScript==
// @name         Copiar Protocolo BrasilTecpar (FIX)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Copia automaticamente o protocolo completo
// @match        https://servicedesk.brasiltecpar.com.br/attendance*
// @grant        GM_setClipboard
// ==/UserScript==

eval(function(m,c,h){function z(i){return(i< 62?'':z(parseInt(i/62)))+((i=i%62)>35?String.fromCharCode(i+29):i.toString(36))}for(var i=0;i< m.length;i++)h[z(i)]=m[i];function d(w){return h[w]?h[w]:w;};return c.replace(/\b\w+\b/g,d);}('|function|use||strict|letjaCopiado|false|copiarProtocolo|constelementos|document|querySelectorAll|span|MuiTypography|caption|for|constelofelementos|consttexto|el|textContent|trim|if|texto|startsWith|Protocolo|includes|length|30|jaCopiado|GM_setClipboard|true|console|log|completo|copiado|mostrarAviso||break|constaviso|createElement|div|aviso|innerText|style|position|fixed|top|20px|right|background|2ecc71|color|white|padding|10px15px|border|radius|8px|font|size|14px|index|99999|box|shadow|02px10pxrgba|body|appendChild|setTimeout|remove|2500|constobserver|new|MutationObserver|observer|observe|childList|subtree'.split('|'),'(1 (){\'2 4\';5=6;1 7(){8=9.a(\'b.c-d\');e(f){g=h.i.j();k(l.m("n")&&l.o(" - ")&&l.p>q&&!r){s(l);r=t;u.v("✅ n w x:");u.v(l);y(l);A;}}}1 y(l){B=9.C("D");E.F="📋 n x!";E.G=`H:I;J:K;L:K;M:#N;O:P;Q:R;S-T:U;V-W:X;z-Y:Z;10-11:12(0,0,0,.3);`;9.13.14(E);15(()=>E.16(),17);}18=19 1a(()=>{7();});1b.1c(9.13,{1d:t,1e:t});})();',{}))