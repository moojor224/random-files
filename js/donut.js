(function () {
    function _onload() {
        // var pretag = document.getElementById('d');
        // let canvastag = document.getElementById('canvasdonut');

        let tmr1 = undefined, tmr2 = undefined;
        let A = 1, B = 1;

        function asciiframe() {
            let b = [];
            let z = [];
            A += 0.07;
            B += 0.03;
            let cA = Math.cos(A), sA = Math.sin(A),
                cB = Math.cos(B), sB = Math.sin(B);
            for (let k = 0; k < 1760; k++) {
                b[k] = k % 80 == 79 ? "\n" : " ";
                z[k] = 0;
            }
            for (let j = 0; j < 6.28; j += 0.07) { // j <=> theta
                let ct = Math.cos(j), st = Math.sin(j);
                for (i = 0; i < 6.28; i += 0.02) {   // i <=> phi
                    let sp = Math.sin(i), cp = Math.cos(i),
                        h = ct + 2, // R1 + R2*cos(theta)
                        D = 1 / (sp * h * sA + st * cA + 5), // this is 1/z
                        t = sp * h * cA - st * sA; // this is a clever factoring of some of the terms in x' and y'

                    let x = 0 | (40 + 30 * D * (cp * h * cB - t * sB)),
                        y = 0 | (12 + 15 * D * (cp * h * sB + t * cB)),
                        o = x + 80 * y,
                        N = 0 | (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
                    if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
                        z[o] = D;
                        b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
                    }
                }
            }
            console.log(b.join(""));
            setTimeout(asciiframe, 100);
        };

        function anim1() {
            if (tmr1 === undefined) {
                tmr1 = setInterval(asciiframe, 50);
            } else {
                clearInterval(tmr1);
                tmr1 = undefined;
            }
        };

        // This is a reimplementation according to my math derivation on the page
        let R1 = 1;
        let R2 = 2;
        let K1 = 150;
        let K2 = 5;
        let canvasframe = function () {
            // let ctx = canvastag.getContext('2d');
            // ctx.fillStyle = '#000';
            // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (tmr1 === undefined) { // only update A and B if the first animation isn't doing it already
                A += 0.07;
                B += 0.03;
            }
            // precompute cosines and sines of A, B, theta, phi, same as before
            let cA = Math.cos(A), sA = Math.sin(A),
                cB = Math.cos(B), sB = Math.sin(B);
            for (let j = 0; j < 6.28; j += 0.3) { // j <=> theta
                let ct = Math.cos(j), st = Math.sin(j); // cosine theta, sine theta
                for (i = 0; i < 6.28; i += 0.1) {   // i <=> phi
                    let sp = Math.sin(i), cp = Math.cos(i); // cosine phi, sine phi
                    let ox = R2 + R1 * ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
                        oy = R1 * st;

                    let x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB; // final 3D x coordinate
                    let y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB; // final 3D y
                    let ooz = 1 / (K2 + cA * ox * sp + sA * oy); // one over z
                    let xp = (150 + K1 * ooz * x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
                    let yp = (120 - K1 * ooz * y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
                    // luminance, scaled back to 0 to 1
                    let L = 0.7 * (cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp));
                    if (L > 0) {
                        // ctx.fillStyle = 'rgba(255,255,255,' + L + ')';
                        // ctx.fillRect(xp, yp, 1.5, 1.5);
                    }
                }
            }
        }

        asciiframe();
        canvasframe();
    }

    // if (document.all) {
    //     window.attachEvent('onload', _onload);
    // } else {
    //     window.addEventListener("load", _onload, false);
    // }
    _onload();
})();

// (function donut2(){
//     _,x,y,o       ,N;char       b[1840]       ;p(n,c)
// {for(;n       --;x++)       c==10?y       +=80,x=
// o-1:x>=       0?80>x?       c!='~'?       b[y+x]=
// c:0:0:0       ;}c(q,l       ,r,o,v)       char*l,
//        *r;{for       (;q>=0;       )q=("A"       "YLrZ^"
//        "w^?EX"           "novne"     "bYV"       "dO}LE"
//        "{yWlw"      "Jl_Ja|[ur]zovpu"   ""       "i]e|y"
//        "ao_Be"   "osmIg}r]]r]m|wkZU}{O}"         "xys]]\
// x|ya|y"        "sm||{uel}|r{yIcsm||ya[{uE"  "{qY\
// w|gGor"      "VrVWioriI}Qac{{BIY[sXjjsVW]aM"  "T\
// tXjjss"     "sV_OUkRUlSiorVXp_qOM>E{BadB"[_/6  ]-
// 62>>_++    %6&1?r[q]:l[q])-o;return q;}E(a){for (
//        o= x=a,y=0,_=0;1095>_;)a= " <.,`'/)(\n-"  "\\_~"[
//        c  (12,"!%*/')#3"  ""     "+-6,8","\"(.$" "01245"
//        " &79",46)+14],  p(""       "#$%&'()0:439 "[ c(10
//        , "&(*#,./1345" ,"')"       "+%-$02\"! ", 44)+12]
// -34,a);  }main(k){float     A=0,B= 0,i,j,z[1840];
// puts(""  "\x1b[2J");;;      for(;; ){float e=sin
// (A), n=  sin(B),g=cos(      A),m=  cos(B);for(k=
// 0;1840>   k;k++)y=-10-k/    80   ,o=41+(k%80-40
//        )* 1.3/y+n,N=A-100.0/y,b[k]=".#"[o+N&1],  z[k]=0;
//        E(  80-(int)(9*B)%250);for(j=0;6.28>j;j   +=0.07)
//        for  (i=0;6.28>i;i+=0.02){float c=sin(    i),  d=
//        cos(  j),f=sin(j),h=d+2,D=15/(c*h*e+f     *g+5),l
// =cos(i)        ,t=c*h*g-f*e;x=40+2*D*(l*h*  m-t*n
// ),y=12+       D  *(l*h*n+t*m),o=x+80*y,N  =8*((f*
// e-c*d*g       )*m   -c*d*e-f*g-l*d*n)     ;if(D>z
// [o])z[o       ]=D,b[     o]=" ."          ".,,-+"
//        "+=#$@"       [N>0?N:       0];;;;}       printf(
//        "%c[H",       27);for       (k=1;18       *100+41
//        >k;k++)       putchar       (k%80?b       [k]:10)
//        ;;;;A+=       0.053;;       B+=0.03       ;;;;;}}
// });