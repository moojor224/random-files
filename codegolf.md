for swapping methods with strings to save characters in javascript:

variable length: 3, at least 8 instances
variable length: 4, at least 5 instances
variable length: 5, at least 4 instances
variable length: 6, at least 3 instances
variable length: 7, at least 
variable length: 8, at least 
variable length: 9, at least 2 instances



t=e=>typeof e              <13chars L12chars
typeof e=="undefined"      t(e)[0]=="u"      saved 9 chars/instance      2+ instances
typeof e=="function"       t(e)[0]=="f"      saved 8 chars/instance
typeof e=="boolean"        t(e)[1]=="o"      saved 7 chars/instance
typeof e=="number"         t(e)[0]=="n"      saved 6 chars/instance      3+ instances
typeof e=="bigint"         t(e)[1]=="i"
typeof e=="string"         t(e)[1]=="t"
typeof e=="symbol"         t(e)[1]=="y"
typeof e=="object"         t(e)[0]=="o"



convert if/else to ternary or short-circuit boolean comparison

if(a==0)b++        if(a==0)b++;else c++
a==0?b++:0         a==0?b++:c++
a==0?b++:0         a==0?(b++):(c++)       // if multiple statements are needed in one if
a==0&&b++          a==0&&b++||c++         // this is bad (only works if b!=-1, and uses more chars)


