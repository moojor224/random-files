import {devlog}from"./dev-helper.js";
import {Prism}from"./prism.js";
import {js_beautify}from"./beautify.js";
Math.roundf=(v,t)=>Math.round(v*t)/t;
let p=e=>typeof e,w=(c,...a)=>new c(...a),four=(t,o=0,i=o)=>w(Array,t).fill(i++),OF=(a,b)=>a instanceof b,qs="querySelector",y=e=>[...(function*(){for(let i in e)yield i})()];
export let waitForKeyElements=(qu,cb,st,el)=>{let o,r;(o=void(0)===el?$(qu):$(el).contents().find(qu))&&o.length>0?((r=!0),o.each(function(){let e=$(this);e.data("alreadyFound")||!1||(cb(e)?(r=!1):e.data("alreadyFound",!0))})):(r=!1);let l=waitForKeyElements.controlObj||{},i=qu.replace(/[^\w]/g,"_"),c=l[i];r&&st&&c?(clearInterval(c),delete l[i]):c||((c=setInterval(_=>{waitForKeyElements(qu,cb,st,el)},1000)),(l[i]=c));waitForKeyElements.controlObj=l}
let createElement=window.createElement;
if(createElement===void(0))c="createElement",createElement=(j,d={},t=p(j)[1]=="t"?document[c](j):j)=>{
    if(p(tag)=="t"&&tag.match(/[^a-zA-Z0-9]/g)){
        d=createElement("div");
        if(emmet&&emmet.expandAbbreviation&&p(emmet.expandAbbreviation)[0]=="f")d.innerHTML=emmet.expandAbbreviation(tag);
        else if(expandAbbreviation&&p(expandAbbreviation)[0]=="f")d.innerHTML=expandAbbreviation(tag);
        let a=[...d.children];
        return a.length==1?a[0]:d
    }
    Object.keys(d).map(e=>(p(d[e])[0]=="o")?window[c](t[e]||(t[e]={}),d[e]):(OF(t,Element)?((e.startsWith("on")&&p(d[e])[0]=="f")?t.addEventListener(e.substring(2),d[e]):t[e]=d[e]):t[e]=d[e]));
    return t
}
let add=(...args)=>(t=this,args.map(elem=>t.append(elem)),t)
Element.prototype.add===void(0)?Element.prototype.add=add:0;
Object.getOwnPropertyNames(window).filter(e=>e.startsWith("HTML")&&e.endsWith("Element")).map(e=>window[e].prototype.add!==add?window[e].prototype.add=add:0);
window.Element.prototype.error=text=>(this.clearError(),this.add(createElement("error",{innerHTML:text||"!"})))
window.Element.prototype.clearError=_=>{
    for(let e of this.childNodes)if(e.tagName.toLowerCase()=="error")return(e.remove(),!0)
    return!1
}
export let warn=(str,...sels)=>(clearWarn(...sels),sels.map(s=>el=s,p(s)[1]=="t"?el=document[qs](s):0,el.append(createElement("warn",{innerHTML:str})))),
clearWarn=(...sels)=>{
    sels.map(s=>{
        el=s;
        if(p(s)==="string")el=document[qs](s);
        for(let e of el.children)if(e.tagName.toLowerCase()=="warn")e.remove()
    })
},
error=(str,...selectors)=>{
    clearWarn(...selectors)
    let w=createElement("error",{innerHTML:str})
    selectors.map(s=>(el=s,p(s)[1]=="t"&&(el=document[qs](s)),el.append(w.cloneNode(!0))))
},
clearError=(...S)=>S.map(s=>{let el=s;p(s)[1]=="t"?el=document[qs](s):0;[...el.children].map(e=>e.tagName.toLowerCase()=="error"?e.remove():0)}),
hide=(...S)=>S.map(s=>(p(s)[1]=="t"?document[qs](s):s).classList.add("hidden")),
show=(...S)=>S.map(s=>(p(s)[1]=="t"?document[qs](s):s).classList.remove("hidden")),
clear=(...S)=>S.map(s=>{s=p(s)=="string"?document[qs](s):s;let arr=flattenChildNodes(s);arr.reverse().map(e=>e.remove?.call(e)),s.innerHTML=""}),
disable=(m,...S)=>S.map(s=>(p(s)[1]=="t"?document[qs](s):s).setAttribute("disabled",m)),
enable=(...S)=>S.map(s=>(p(s)[1]=="t"?document[qs](s):s).removeAttribute("disabled")),
tabColor=color=>{
    let valid=c=>c.match(/^(unset|initial|inherit)$/)?!1:createElement("div",{style:{color:c}}).style.color!==""
    if(!valid(color))return;
    let c=createElement("canvas",{width:1,height:1}),ctx=c.getContext("2d");ctx.fillStyle=color;ctx.fillRect(0,0,1,1);document.head.append(createElement(document[qs]("link[rel=icon]")||"link",{href:c.toDataURL(),rel:"icon"}))
},
parseCookies=(cookies)=>{
    let reading=!1,escaped=!1,quoted=NaN,key="",value="",map=w(Map);
    cookies.trim().split("").map(e=>{
        if(escaped){
            value+=e;
            escaped=!1
        }else if(reading){
            if(quoted==NaN){
                if(!(quoted=e=='"'))value+=e
            }else if((e=='"'&&quoted)||(e==";"&&!quoted))(quoted=NaN,map.set(key.trim(),value),reading=!1,value="",key="")
            else value+=e
        }else if(e=="=")reading=!0;
        else key+=e
    });
    if(key!="")map.set(key.trim(),value);
    return map
},
dynamicSort=P=>(sO=(p(P)[1]=="t"&&P[0]=="-")?(P=P.substring(1),-1):1,(a,b)=>(a[P]<b[P]?-1:a[P]>b[P]?1:0)*sO),
advancedDynamicSort=(...P)=>{
    let D=(P,c=(a,b,chain,p=chain[0].trim(),sO=(p[0]=="-"?(p=p.substring(1),-1):1))=>([a[p],b[p]].includes(void(0))||chain.length==1)?sO*(a[p]<b[p]?-1:a[p]>b[p]?1:0):(chain.length>1?c(a[p],b[p],chain.slice(1)):void(0)))=>(P=P.split("."),(a,b)=>c(a,b,P))
    P=P.map(e=>D(e))
    return(a,b,funcs=[...P],result)=>(r=_=>result=funcs.shift()(a,b),w=_=>(result==0&&funcs.length>0)?w(r()):0,w(r()),result)
},
rgbGradient=(P,colors=[{r:255,g:0,b:0},{r:255,g:0x7f,b:0},{r:255,g:127,b:0},{r:0,g:255,b:0},{r:0,g:0,b:255},{r:255,g:0,b:255}])=>{
    let numChunks=colors.length-1,chunkSize=100/numChunks,i;
    for(i=1;i<=numChunks;i++){
        if(P<=chunkSize*i){
            let percent=((P+(1-i)*chunkSize)*numChunks)/100,c1=colors[i],c2=colors[i-1],result=[];
            Object.keys(colors[0]).map((e)=>result.push(Math.roundf((c1[e]*percent+c2[e]*(1-percent)),100)));
            return`rgb(${result.join(",")})`
        }
    }
},
map=(v,n,x,N,X,c=!1)=>((c?clamp(v,n,x):v)-n)*(X-N)/(x-n)+N,
gradient=(n,c=[{r:255,g:0,b:0},{r:255,g:0x7f,b:0},{r:255,g:127,b:0},{r:0,g:255,b:0},{r:0,g:0,b:255},{r:255,g:0,b:255}])=>n==1?[`rgb(${c[0].r},${c[0].g},${c[0].b})`]:w(Array,n).fill("").map((e,n)=>rgbGradient(map(n,0,n-1,0,100),c)),
interleaveArrays=(fill,...arrs)=>{
    if(fill)arrs=arrs.map(arr=>[...arr,...w(Array,Math.max(...arrs.map(e=>e.length))-arr.length).fill(null)]);
    let result=[];
    while(arrs.filter(e=>e.length>0).length>0)arrs.map(arr=>arr.length>0?result.push(arr.shift()):0);
    return result
},
captureConsole=_=>{
    if(console.everything===void(0)){
        console.everything=[];
        let TS=_=>w(Date).toLocaleString("sv",{timeZone:'UTC'})+"Z"
        window.onerror=(error,url,line)=>(console.everything.push({type:"exception",timeStamp:TS(),value:{error,url,line}}),!1)
        window.onunhandledrejection=e=>console.everything.push({type:"promiseRejection",timeStamp:TS(),value:e.reason});
        let hookLogType=logType=>{let o=console[logType].bind(console);(...args)=>(console.everything.push({type:logType,timeStamp:TS(),value:Array.from(args)}),o.apply(console,args))}
        ['log','error','warn','debug'].map(logType=>{console[logType]=hookLogType(logType)})
    }
},
flattenChildren=arr=>[arr,...(arr.children?.flatMap(e=>flattenChildren(e))||[])],
flattenChildNodes=el=>[el,...([...el.childNodes].flatMap(e=>flattenChildNodes(e))||[])],
getColor=(varname,...append)=>{
    let color=getComputedStyle(document[qs](":root")).getPropertyValue(varname);
    return(color.match(/^#[a-zA-Z0-9]{3}$/g)?color="#"+color.substring(1).split("").map(e=>e.padStart(e,2)).join("")+append.join(""):0,color+append.join(""))
},
lockValue=(callback,...args)=>class{constructor(){}static valueOf=_=>callback(...args)},
listAllColorsOnPage=_=>{
    let hexToRgb=color=>{
        if (color.match(/#?([a-zA-Z0-9]{8}|[a-zA-Z0-9]{6}|[a-zA-Z0-9]{3,4})/g)?.at(0)===color){
            color=color.replace("#","");
            let split,a;
            switch(color.length){
                case 4:a=!0;case 3:split=color.split("");break
                case 8:a=!0;case 6:split=color.match(/.{1,2}/g);break
            }
            return`rgb${a?"a":""}(${split.map((e,n)=>parseInt(e.padStart(2,e),16)/(n==3?255:1)).join(", ")})`
        }
    }
    rgbToHex=rgb=>"#"+rgb.replaceAll(/[^0-9\.,]/g,"").split(",").map((e,n)=>parseInt(e*(n==3?255:1)).toString(16).padStart(2,e)).join("");
    getColor=rgb=>{
        let [r,g,b]=rgb.replaceAll(/[^0-9 ]/g,"").split(" ");
        return(r*0.299+g*0.587+b*0.114)>186?'#000000':'#FFFFFF'
    }
    let colorProps=["backgroundColor","color"],displayResults=array=>{
        array.map(e=>{
            console.groupCollapsed(`%c${rgbToHex(e.value)} (${(e.varName)})`,`color:${getColor(e.value)};background-color:${e.value};padding:20px;line-height:60px;font-size:20px`);
            colorProps.map(prop=>{
                if(e[prop].length>0){
                    console.groupCollapsed("%c "+prop,"font-size:20px;");
                    console.groupEnd()
                }
            })
            console.groupEnd()
        })
    }
    let arr=[...w(Array,106).fill(0).map((e,n)=>"--color"+(n+1)),...w(Array,10).fill(1).map((e,n)=>"--transparent"+(n+1))],root=getComputedStyle(document[qs](":root")),els=flattenChildren(document.body).map(e=>[e,getComputedStyle(e)]);
    arr=arr.map(c=>{
        let color=hexToRgb(root.getPropertyValue(c)),obj={value:color,varName:c};
        colorProps.map(e=>obj[e]=els.filter(r=>r[1][e]===color));
        return obj
    }).filter(e=>colorProps.map(p=>e[p].length>0).includes(!0));
    displayResults(arr)
},
clamp=(v,n,x)=>(((n>x)?([n,x]=[x,n]):0),(v<n?n:v>x?x:v)),
getValueOrDefault=(val,def)=>(val===void(0)||val===null)?def:val,
extend=(t,s)=>(Object.keys(s).map(k=>{t[k]=s[k]}),t),
convertBase=(str,fromBase,toBase)=>{
    let DIGITS='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',add=(x,y,base)=>{
        let z=[],n=Math.max(x.length,y.length),carry=0,i=0;
        while(i<n||carry){
            let xi=i<x.length?x[i]:0,yi=i<y.length?y[i]:0,zi=carry+xi+yi;
            z.push(zi%base);
            carry=Math.floor(zi/base);
            i++
        }
        return z
    },multiplyByNumber=(num,x,base)=>{
        if(num<0)return null;
        if(num==0)return[];
        let result=[],power=x;
        while(!0){
            num&1&&(result=add(result,power,base));
            num=num>>1;
            if(num===0)break;
            power=add(power,power,base)
        }
        return result
    },parseToDigitsArray=(str,base)=>{
        let digits=str.split(''),arr=[],i;
        for(i=digits.length-1;i>=0;i--){
            let n=DIGITS.indexOf(digits[i])
            if(n==-1)return null;
            arr.push(n)
        }
        return arr
    }
    let digits=parseToDigitsArray(str,fromBase);
    if(digits===null)return null;
    let outArray=[],power=[1],out='',i;
    for(i=0;i<digits.length;i++){
        digits[i]&&(outArray=add(outArray,multiplyByNumber(digits[i],power,toBase),toBase));
        power=multiplyByNumber(fromBase,power,toBase)
    }
    for(i=outArray.length-1;i>=0;i--)out+=DIGITS[outArray[i]];
    return out
},
Settings=class extends EventTarget{
    config={name:"settings"};
    sections=[];
    constructor(config={},sections){
        super();
        extend(this.config,config);
        if(!Array.isArray(sections))sections=[sections];
        this.sections=sections.filter(e=>OF(e,Section));
        sections.map(section=>section.settings_obj=this)
    }
    render(){
        let div=createElement("div",{classList:"settings"}).add(createElement("h2",{innerHTML:this.config.name}));
        div.add(...this.sections.map(s=>s.render()));
        return div
    }
    getSection=i=>this.sections.find(e=>e.config.id==i)
    export(){
        let data=JSON.parse(JSON.stringify(this,(key,value)=>key.includes("_obj")?void(0):value));
        data.sections.map(sec=>sec.options.map(e=>delete e.input));
        return JSON.stringify(data)
    }
    dispatchEvent(event){
        let originalDispatch=EventTarget.prototype.dispatchEvent.bind(this);
        originalDispatch.apply(this,[event])
        return!event.defaultPrevented||!event.cancelable
    }
    on=(type,callback)=>this.addEventListener(type,callback);
    off=(type,callback)=>this.removeEventListener(type,callback);
    static fromJson(jsontext){
        if(jsontext.length==0)return null;
        try{
            let json=JSON.parse(jsontext),j=Joi,validate=j.object({config:j.object({name:j.string().required()}).required(),sections:j.array().items(j.object({config:j.object({name:j.string().required(),id:j.string().required()}),options:j.array().items(j.object({config:j.object({name:j.string().required(),id:j.string().required(),type:j.string().required(),value:j.any(),values:j.array()}).required()})).required()})).required()}).validate(json);
            if(validate.error){
                console.error("invalid json data");
                throw w(Error,validate.error)
            }
            return w(Settings,json.config,json.sections.map(sec=>w(Section,sec.config,sec.options.map(opt=>w(Option,opt.config)))))
        }catch(err){
            console.error(err);
            return err
        }
    }
    replaceWith(settings){
        if(!OF(settings,Settings))return;
        this.config=settings.config;
        this.sections=settings.sections
    }
},
Section=class extends EventTarget{
    settings_obj=null;
    config={name:"section"}
    options=[];
    constructor(config,options){
        super();
        extend(this.config,config);
        if(!Array.isArray(options))options=[options];
        this.options=options.filter(e=>OF(e,Option));
        options.map(option=>option.section_obj=this)
    }
    getOption=name=>this.options.find(e=>e.config.id==name);
    render(){
        let section=createElement("section").add(createElement("h2",{innerHTML:this.config.name}));
        section.add(...this.options.map(o=>o.render()));
        return section
    }
    dispatchEvent(event){
        this.settings_obj.dispatchEvent(event);
        let originalDispatch=EventTarget.prototype.dispatchEvent.bind(this);
        originalDispatch.apply(this,[event]);
        return!event.defaultPrevented||!event.cancelable
    }
    on=(type,callback)=>this.addEventListener(type,callback);
    off=(type,callback)=>this.removeEventListener(type,callback)
},
Option=class extends EventTarget{
    input=null;
    section_obj=null;
    config={name:"option",type:"toggle",value:!1}
    constructor(config){
        super();
        extend(this.config,config);
        if(config.value==void(0)&&config.values)this.config.value=config.values[0]
    }
    get value(){
        return this.config.value
    }
    set value(val){
        show("#loadingModal");
        let option=this,previousVal=this.config.value;
        this.config.value=val;
        fetch("/Reports/Report/SaveSettings",{method:"POST",body:this.section_obj.settings_obj.export(),headers:{"X-CSRF-TOKEN":Cookies.get("CSRF-TOKEN")}}).then(e=>{
            e.text().then(t=>{
                if(t.includes("error")){
                    this.config.value=previousVal;
                    if(this.input.checked!=void(0))this.input.checked=previousVal;
                    else this.input=previousVal
                }
                option.dispatchEvent(w(Event,"change"));
                hide("#loadingModal")
            })
        })
    }
    render=_=>createElement("label").add(createElement("span",{innerHTML:this.config.name}),this.createInput());
    createInput(){
        let input,option=this;
        if(this.config.type=="toggle")input=createElement("input",{type:"checkbox",classList:"slider",checked:option.config.value});
        else if(this.config.type=="dropdown"){
            input=createElement("select");
            let values=[];
            if(this.config.values||(!["undefined","null"].includes(p(this.config.values)))){
                if(!Array.isArray(this.config.values))this.config.values=[this.config.values];
                values.push(...this.config.values)
            }
            values=Array.from(w(Set,values));
            input.add(...values.map(v=>createElement("option",{innerHTML:v})));
            if(this.config.value&&!this.config.values.includes(this.config.value))input.insertAdjacentElement("afterBegin",createElement("option",{innerHTML:this.config.value,value:this.config.value,hidden:!0,disabled:!0}));
            input.value=this.config.value||this.config.values[0]
        }
        input.addEventListener("input",_=>{
            if(input.checked!=void(0))option.value=input.checked;
            else option.value=input.value
        });
        return input
    }
    dispatchEvent(event){
        this.section_obj.dispatchEvent(event);
        let originalDispatch=EventTarget.prototype.dispatchEvent.bind(this);
        originalDispatch.apply(this,[event]);
        return!event.defaultPrevented||!event.cancelable
    }
    on=(type,callback)=>this.addEventListener(type,callback);
    off=(type,callback)=>this.removeEventListener(type,callback)
}
export let copyObject=obj=>{
    let result=obj,type={}.toString.call(obj).slice(8,-1);
    if(type=='Set')return w(Set,[...obj].map(value=>clone(value)));
    if(type=='Map')return w(Map,[...obj].map(kv=>[clone(kv[0]),clone(kv[1])]));
    if(type=='Date')return w(Date,obj.getTime());
    if(type=='RegExp')return w(RegExp,obj.source,getRegExpFlags(obj));
    if(type=='Array'||type=='Object'){
        result=Array.isArray(obj)?[]:{};
        y(obj).map(k=>result[k]=clone(obj[k]))
    }
    return result
},
parseTrace=t=>{
    let paths=t.trim().split("\n").map(p=>{
        let a=p.split("@"),locs=a.pop().split(":");
        return{func:a.join("@"),char:parseInt(locs.pop()),line:parseInt(locs.pop()),location:locs.join(":")}
    });
    return paths
},
getRegExpFlags=(r,f=[],p="push")=>(p(r.source.flags)[1]=='t'?r.source.flags:r.flags?r.flags:(r.global&&f[p]('g'),r.ignoreCase&&f[p]('i'),r.multiline&&f[p]('m'),r.sticky&&f[p]('y'),r.unicode&&f[p]('u'),f.join(''))),
toHTMLEntities=(str)=>str.split("").map(e=>`&#${e.charCodeAt(0)};`).join(""),
svgToDataUri=(_=>{
    let shorterNames={aqua:/#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,azure:/#f0ffff(ff)?(?!\w)/gi,beige:/#f5f5dc(ff)?(?!\w)/gi,bisque:/#ffe4c4(ff)?(?!\w)/gi,black:/#0{6}(ff)?(?!\w)|#000(f)?(?!\w)/gi,blue:/#0000ff(ff)?(?!\w)|#00f(f)?(?!\w)/gi,brown:/#a52a2a(ff)?(?!\w)/gi,coral:/#ff7f50(ff)?(?!\w)/gi,cornsilk:/#fff8dc(ff)?(?!\w)/gi,crimson:/#dc143c(ff)?(?!\w)/gi,cyan:/#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,darkblue:/#00008b(ff)?(?!\w)/gi,darkcyan:/#008b8b(ff)?(?!\w)/gi,darkgrey:/#a9a9a9(ff)?(?!\w)/gi,darkred:/#8b0000(ff)?(?!\w)/gi,deeppink:/#ff1493(ff)?(?!\w)/gi,dimgrey:/#696969(ff)?(?!\w)/gi,gold:/#ffd700(ff)?(?!\w)/gi,green:/#008000(ff)?(?!\w)/gi,grey:/#808080(ff)?(?!\w)/gi,honeydew:/#f0fff0(ff)?(?!\w)/gi,hotpink:/#ff69b4(ff)?(?!\w)/gi,indigo:/#4b0082(ff)?(?!\w)/gi,ivory:/#f{5}0(ff)?(?!\w)/gi,khaki:/#f0e68c(ff)?(?!\w)/gi,lavender:/#e6e6fa(ff)?(?!\w)/gi,lime:/#00ff00(ff)?(?!\w)|#0f0(f)?(?!\w)/gi,linen:/#faf0e6(ff)?(?!\w)/gi,maroon:/#80{5}(ff)?(?!\w)/gi,moccasin:/#ffe4b5(ff)?(?!\w)/gi,navy:/#000080(ff)?(?!\w)/gi,oldlace:/#fdf5e6(ff)?(?!\w)/gi,olive:/#808000(ff)?(?!\w)/gi,orange:/#ffa500(ff)?(?!\w)/gi,orchid:/#da70d6(ff)?(?!\w)/gi,peru:/#cd853f(ff)?(?!\w)/gi,pink:/#ffc0cb(ff)?(?!\w)/gi,plum:/#dda0dd(ff)?(?!\w)/gi,purple:/#800080(ff)?(?!\w)/gi,red:/#ff0000(ff)?(?!\w)|#f00(f)?(?!\w)/gi,salmon:/#fa8072(ff)?(?!\w)/gi,seagreen:/#2e8b57(ff)?(?!\w)/gi,seashell:/#fff5ee(ff)?(?!\w)/gi,sienna:/#a0522d(ff)?(?!\w)/gi,silver:/#c0c0c0(ff)?(?!\w)/gi,skyblue:/#87ceeb(ff)?(?!\w)/gi,snow:/#fffafa(ff)?(?!\w)/gi,tan:/#d2b48c(ff)?(?!\w)/gi,teal:/#008080(ff)?(?!\w)/gi,thistle:/#d8bfd8(ff)?(?!\w)/gi,tomato:/#ff6347(ff)?(?!\w)/gi,violet:/#ee82ee(ff)?(?!\w)/gi,wheat:/#f5deb3(ff)?(?!\w)/gi,white:/#f{6}(ff)?(?!\w)|#fff(f)?(?!\w)/gi},REGEX={w:/\s+/g,u:/%[\dA-F]{2}/g,quotes:/"/g},collapseWhitespace=s=>s.trim().replace(REGEX.w,' '),dataURIPayload=s=>encodeURIComponent(s).replace(REGEX.u,specialHexEncode),colorCodeToShorterNames=string=>(Object.keys(shorterNames).map(key=>shorterNames[key].test(string)?string=string.replace(shorterNames[key],key):0),string),specialHexEncode=m=>m=='%20'?' ':m=='%3D'?'=':m=='%3A'?':':m=='%2F'?'/':m.toLowerCase(),svgToTinyDataUri=svgString=>{
        if(p(svgString)[1]!='t')throw w(TypeError,'Expected a string, but received '+p(svgString));
        if(svgString.charCodeAt(0)===0xfeff){svgString=svgString.slice(1)}
        let body=colorCodeToShorterNames(collapseWhitespace(svgString)).replace(REGEX.quotes,"'");
        return'data:image/svg+xml,'+dataURIPayload(body)
    }
    svgToTinyDataUri.toSrcset=s=>svgToTinyDataUri(s).replace(/ /g,'%20')
    return svgToTinyDataUri.toSrcset
})(),
logFormatted=(object,options={})=>{
    let {embedObjects,raw,collapsed,maxDepth,label}=extend({embedObjects:!1,raw:!1,collapsed:!1,maxDepth:Infinity,label:"formatted log"},options),objects=[],indentAmount=1,depth=0,embedIndex=0,indexes=[],stringify=obj=>{
        if(depth>maxDepth){
            let str="'<max depth reached>'";
            embedIndex+=str.length
            return str
        }
        let type=p(obj),pad=" ".repeat(indentAmount*4);
        if(type=="number"||type=="boolean"){
            let str=""+obj;
            embedIndex+=str.length;
            return obj
        }else if(type=="function"){
            objects.push(obj);
            let beautified=js_beautify(obj.toString().replaceAll("\r",""));
            let splitFunc=beautified.split("\n");
            while(splitFunc[1].length==0)splitFunc.splice(1,1);
            let padded=splitFunc.map((e,n)=>(n>0?pad.substring(4)+e:e+" "));
            embedIndex+=padded[0].length;
            indexes.push(embedIndex);
            embedIndex+=(padded.slice(1).join("\n").length+1);
            return padded.join("\n")
        }else if(type[1]=="t"){
            let quote;
            if(!obj.includes('"'))quote='"';
            else if(!obj.includes("'"))quote="'";
            else quote='"';
            [["\n","\\n"],["\r","\\r"],["\t","\\t"],(quote=='"')?['"','\\"']:["'","\\'"]].map(e=>obj=obj.replaceAll(e[0],e[1]));
            let str=`${quote}${obj}${quote}`;
            embedIndex+=str.length;
            return str
        }else if(type=="object"){
            if(objects.includes(obj)){
                let str="<already stringified (recursion prevention)>";
                embedIndex+=str.length;
                indexes.push(embedIndex);
                return str
            }
            objects.push(obj);
            let arr=[];
            indentAmount++;
            depth++;
            embedIndex+=2;
            indexes.push(embedIndex);
            embedIndex+=(1+pad.length);
            if(Array.isArray(obj)){
                obj.map((item,index)=>{
                    arr.push(stringify(item));
                    if(index<obj.length-1)embedIndex+=2+pad.length
                });
                indentAmount--;
                depth--;
                embedIndex+=(1+(pad.length-4)+1);
                return`[ \n${pad+arr.join(",\n"+pad)}\n${pad.substring(4)}]`
            }else{
                if(!obj)return(embedIndex+=4,"null");
                Object.entries(obj).map((kvp,index,entries)=>{
                    let [key,value]=kvp;
                    embedIndex+=key.length+2;
                    let str=stringify(value);
                    str=`${key}: ${str}`;
                    arr.push(str);
                    if(index<entries.length-1)embedIndex+=2+pad.length
                });
                indentAmount--;
                depth--;
                let returnVal=`{ \n${pad+arr.join(",\n"+pad)}\n${pad.substring(4)}}`;
                embedIndex+=1+(pad.length-4)+1;
                return returnVal
            }
        }else{
            let str=""+obj;
            embedIndex+=str.length;
            return str
        }
    },element=createElement("div",{innerHTML:Prism.highlight(stringify(object),Prism.languages.javascript).replaceAll("%","%%")}),regex=/(?<!%)(%%)*%[co]/g,PC=[[["cdata","comment","doctype","prolog"],"#6a9955"],[["boolean","constant","number","property","symbol","tag"],"#4fc1ff"],[["attr-name","builtin","char","inserted","selector","string"],"#ce9178"],[["entity","url","variable"],"#f4b73d"],[["atrule","attr-value","keyword"],"#569cd6"],[["important","regex"],"#ee9900"],[["deleted"],"#ff0000"],[["function"],"#dcdcaa"],[["parameter"],"#9cdcfe"],[["template-punctuation"],"#ce9178"],[["interpolation-punctuation"],"#ff8800"],[["class-name"],"#4ec9b0"]],calcStyle=e=>{
        if(!e.style)return;
        [...e.classList].map(clss=>PC.map(pclass=>pclass[0].includes(clss)?e.style.color=pclass[1]:0));
        return e
    },logs=[],styles=[],flattened=flattenChildNodes(element);
    if(embedObjects){
        let index=0,lastPercent=!1,count=node=>{
            let text="";
            node.textContent.split("").map(char=>{
                if(char=="\r")return;
                if(index==indexes[0]){
                    indexes.shift();
                    text+="%o"
                }
                if(char=="%"&&!lastPercent)lastPercent=!0;
                else if(lastPercent){
                    lastPercent=!1;
                    index++
                }else index++;
                text+=char
            });
            node.textContent=text
        }
        flattened.map(e=>e.nodeName.includes("text")?count(e):0)
    }
    flattened.map(calcStyle).map(e=>e.nodeName!="#text"?void (0):logs.push(`%c${e.textContent}`),styles.push(e.parentNode.style.color?`color:${e.parentNode.style.color};`:""));
    logs=logs.join("");
    let regexSplit=string=>{
        let str=[],reg=[],match,lastindex=0,index;
        while(match=regex.exec(string)){
            index=match.index;
            let kind=match[0],mod=0;
            if (kind.length>2){
                str[str.length-1]+=kind.substring(0,kind.length-2);
                mod=kind.length-2;
                kind=kind.substring(kind.length-2)
            }
            str.push(string.substring(((lastindex+2)>index?index:(lastindex+2)),index));
            lastindex=index+mod;
            reg.push(kind)
        }
        str.push(string.substring(lastindex+2));
        return{split:str,matches:reg}
    }
    let{matches,split}=regexSplit(logs),final=[],finalStyles=[];
    while(matches.length>0){
        let type=matches.shift();
        final.push(split.shift()||"");
        final.push(type);
        if(type=="%o")finalStyles.push(objects.shift()||"");
        else finalStyles.push(styles.shift()||"")
    }
    while(split.length>0)final.push(split.shift());
    while(embedObjects&&objects.length>0)finalStyles.push(objects.shift());
    while(styles.length>0)finalStyles.push(styles.shift());
    final=final.join("");
    if(raw)return{logs:final,styles:finalStyles,html:element.outerHTML}
    else{
        if(collapsed){
            console.groupCollapsed(label);
            console.groupEnd(console.log(final,...finalStyles))
        }else console.log(final,...finalStyles)
    }
},
JSFuck=(_=>{
    let NU=null,MIN=32,MAX=126,SIM={false:'![]',true:'!![]',undefined:'[][[]]',NaN:'+[![]]',Infinity:'+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])'},CON={Array:'[]',Number:'(+[])',String:'([]+[])',Boolean:'(![])',Function:'[]["flat"]',RegExp:'Function("return/"+false+"/")()',Object:'[]["entries"]()'},MAP={a:'(false+"")[1]',b:'([]["entries"]()+"")[2]',c:'([]["flat"]+"")[3]',d:'(undefined+"")[2]',e:'(true+"")[3]',f:'(false+"")[0]',g:'(false+[0]+String)[20]',h:'(+(101))["to"+String["name"]](21)[1]',i:'([false]+undefined)[10]',j:'([]["entries"]()+"")[3]',k:'(+(20))["to"+String["name"]](21)',l:'(false+"")[2]',m:'(Number+"")[11]',n:'(undefined+"")[1]',o:'(true+[]["flat"])[10]',p:'(+(211))["to"+String["name"]](31)[1]',q:'("")["fontcolor"]([0]+false+")[20]',r:'(true+"")[1]',s:'(false+"")[3]',t:'(true+"")[0]',u:'(undefined+"")[0]',v:'(+(31))["to"+String["name"]](32)',w:'(+(32))["to"+String["name"]](33)',x:'(+(101))["to"+String["name"]](34)[1]',y:'(NaN+[Infinity])[10]',z:'(+(35))["to"+String["name"]](36)',A:'(NaN+[]["entries"]())[11]',B:'(+[]+Boolean)[10]',C:'Function("return escape")()(("")["italics"]())[2]',D:'Function("return escape")()([]["flat"])["slice"]("-1")',E:'(RegExp+"")[12]',F:'(+[]+Function)[10]',G:'(false+Function("return Date")()())[30]',H:NU,I:'(Infinity+"")[0]',J:NU,K:NU,L:NU,M:'(true+Function("return Date")()())[30]',N:'(NaN+"")[0]',O:'(+[]+Object)[10]',P:NU,Q:NU,R:'(+[]+RegExp)[10]',S:'(+[]+String)[10]',T:'(NaN+Function("return Date")()())[30]',U:'(NaN+Object()["to"+String["name"]]["call"]())[11]',V:NU,W:NU,X:NU,Y:NU,Z:NU,' ':'(NaN+[]["flat"])[11]','!':NU,'"':'("")["fontcolor"]()[12]','#':NU,$:NU,'%':'Function("return escape")()([]["flat"])[21]','&':'("")["fontcolor"](")[13]','\'':NU,'(':'([]["flat"]+"")[13]',')':'([0]+false+[]["flat"])[20]','*':NU,'+':'(+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]])+[])[2]',',':'[[]]["concat"]([[]])+""','-':'(+(.+[0000001])+"")[2]','.':'(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]','/':'(false+[0])["italics"]()[10]',':':'(RegExp()+"")[3]',';':'("")["fontcolor"](NaN+")[21]','<':'("")["italics"]()[0]','=':'("")["fontcolor"]()[11]','>':'("")["italics"]()[2]','?':'(RegExp()+"")[2]','@':NU,'[':'([]["entries"]()+"")[0]','\\':'(RegExp("/")+"")[1]',']':'([]["entries"]()+"")[22]','^':NU,'_':NU,'`':NU,'{':'(true+[]["flat"])[20]','|':NU,'}':'([]["flat"]+"")["slice"]("-1")','~':NU},GLOBAL='Function("return this")()',fillMissingDigits=_=>{
        let o;four(10).map(n=>(o="+[]",n>0&&(o="+!"+o),four(n-1,1).map(e=>o="+!+[]"+o),n>1&&(o=o.substring(1)),MAP[n]=`[${o}]`))
    },replaceMap=_=>{
        let character="",value,i,key,replace=(pattern,replacement)=>value=value.replace(w(RegExp,pattern,"gi"),replacement),digitReplacer=(_,x)=>MAP[x],numberReplacer=(_,y)=>{
            let values=y.split(""),head=(+values.shift()),output="+[]";
            head>0&&(output="+!"+output);
            four(head-1,1).map(_=>output="+!+[]"+output);
            head>1&&(output=output.substring(1));
            return[output].concat(values).join("+").replace(/(\d)/g,digitReplacer)
        }
        four(MAX-MIN,MIN).map(i=>{
            character=String.fromCharCode(i);
            value=MAP[character];
            if(!value)return;
            (Object.keys(CON).map(key=>replace("\\b"+key,CON[key]+'["constructor"]')),Object.keys(SIM).map(key=>replace(key,SIM[key])),replace('(\\d\\d+)',numberReplacer),replace('\\((\\d)\\)',digitReplacer),replace('\\[(\\d)\\]',digitReplacer),replace("GLOBAL",GLOBAL),replace('\\+""',"+[]"),replace('""',"[]+[]"),MAP[character]=value)
        })
    },replaceStrings=_=>{
        let regEx=/[^\[\]\(\)\!\+]{1}/g,all,value,missing,count=MAX-MIN,findMissing=_=>{
            let value,done=!1;
            missing={};
            y(MAP).map(e=>(value=MAP[e],value&&value.match(regEx)?(missing[e]=value,done=!0):0))
            return done
        },mappingReplacer=(a,b)=>b.split("").join("+"),valueReplacer=c=>missing[c]?c:MAP[c];
        y(MAP).map(e=>MAP[all]?MAP[all]=MAP[all].replace(/\"([^\"]+)\"/gi,mappingReplacer):0)
        while(findMissing()){
            for(all in missing){
                value=MAP[all];
                value=value.replace(regEx,valueReplacer);
                MAP[all]=value;
                missing[all]=value
            }
            if(count--===0)console.error("Couldn't compile the following chars:",missing)
        }
    },eS=(c,cc=c.charCodeAt(0))=>'\\'+(cc<256?cc.toString(8):'u'+cc.toString(16).padStart(4,0)),
    eSFR=c=>eS(c).replace('\\','t'),encode=(input,wrapWithEval,runInParentScope,unmappped='',output=[],r="")=>{
        if(!input)return"";
        for(let k in MAP)if(MAP[k])unmappped+=k;
        unmappped=w(RegExp,'[^'+unmappped.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+']','g');
        let uCC=(input.match(unmappped)||[]).length;
        if(uCC>1)input=input.replace(/[^0123456789.adefilnrsuN]/g,eSFR);
        else if(uCC>0)input=input.replace(/["\\]/g,eS).replace(unmappped,eS);
        for(let i in SIM)r+=i+"|";
        r+=".";
        input.replace(w(RegExp,r,'g'),c=>{
            let replacement=SIM[c];
            if(replacement)output.push("("+replacement+"+[])");
            else{
                replacement=MAP[c];
                if(replacement)output.push(replacement);
                else throw w(Error,'Found unmapped character: '+c)
            }
        });
        output=output.join("+");
        if(/^\d$/.test(input))output+="+[]";
        if(uCC>1)output=`(${output})[${encode("split")}](${encode("t")})[${encode("join")}](${encode("\\")})`;
        if(uCC>0)output=`[][${encode("flat")}][${encode("constructor")}](${encode("return\"")}+${output}+${encode("\"")})()`;
        if(wrapWithEval){
            if(runInParentScope)output=`[][${encode("flat")}][${encode("constructor")}](${encode("return eval")})()(${output})`;
            else output=`[][${encode("flat")}][${encode("constructor")}](${output})()`
        }
        return output
    }
    fillMissingDigits();
    replaceMap();
    replaceStrings();
    return{encode}
})(),
meyerDiff=(seq1,seq2)=>{
    var N=seq1.length,M=seq2.length,X=N+M,furthestReaching=[],D,k,x,y,step,src=[],target=[],stepMap=[],dist=X,a;
    for(;dist--;)stepMap[dist]=[];
    furthestReaching[X+1]=0;
    for(D=0;D<=X&&dist===-1;D++){
        for(k=-D,x,y,step;k<=D&&dist===-1;k+=2){
            if(k===-D||(k!==D&&furthestReaching[k-1+X]<furthestReaching[k+1+X]))step=(x=furthestReaching[k+1+X],3);
            else step=(x=furthestReaching[k-1+X]+1,2);
            y=x-k;
            stepMap[x][y]=step;
            while(x<N&&y<M&&seq1[x]===seq2[y])(x++,y++,stepMap[x][y]=0)
            furthestReaching[k+X]=x;
            if(x>=N&&y>=M)dist=D
        }
    }
    for(;N||M;){
        a=stepMap[N][M];
        src.unshift(a>2?-1:seq1[N-1]);
        target.unshift(a==2?-1:seq2[M-1]);
        a<3&&N--;
        a!=2&&M--
    }
    return[src,target]
},
logAndReturn=arg=>(console.log(arg),arg),
timeConversions=(_=>{let s=t=>t*1000,m=t=>t*s(60),h=t=>t*m(60),d=t=>t*h(24),k=t=>t*d(7),y=t=>t*d(365);return{seconds:s,minutes:m,hours:h,days:d,weeks:k,years:y}})(),
rect=n=>{let h=Math.ceil(Math.sqrt(n)),t=h;while(h*t-t>=n){h--}return w(Array,h).fill(0).map(e=>w(Array,t))};
export {Settings,Section,Option,createElement};
window.logFormatted=logFormatted;