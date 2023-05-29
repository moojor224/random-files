GM_setValue("pass", "password");
GM_setValue("decrypted", "Hello World");
GM_setValue("encrypted", sjcl.encrypt(GM_getValue("pass"), "Hello World"));
alert(sjcl.decrypt(GM_getValue("pass"), GM_getValue("encrypted")));
