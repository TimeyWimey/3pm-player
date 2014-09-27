var StringUtils={readUTF16String:function(e,f,b){var c=0,d=1,a=0;b=Math.min(b||e.length,e.length);254===e[0]&&255===e[1]?(f=!0,c=2):255===e[0]&&254===e[1]&&(f=!1,c=2);f&&(d=0,a=1);f=Array(b);for(var u=0;c<b;u++){var g=e[c+d],h=(g<<8)+e[c+a],c=c+2;if(0===h)break;else 216>g||224<=g?f[u]=String.fromCharCode(h):(g=(e[c+d]<<8)+e[c+a],c+=2,f[u]=String.fromCharCode(h,g))}e=new String(f.join(""));e.bytesReadCount=c;return e},readUTF8String:function(e,f){var b=0;f=Math.min(f||e.length,e.length);239===e[0]&&
187===e[1]&&191===e[2]&&(b=3);for(var c=Array(f),d=0;b<f;d++){var a=e[b++];if(0===a)break;else if(128>a)c[d]=String.fromCharCode(a);else if(194<=a&&224>a){var u=e[b++];c[d]=String.fromCharCode(((a&31)<<6)+(u&63))}else if(224<=a&&240>a){var u=e[b++],g=e[b++];c[d]=String.fromCharCode(((a&255)<<12)+((u&63)<<6)+(g&63))}else if(240<=a&&245>a){var u=e[b++],g=e[b++],h=e[b++],a=((a&7)<<18)+((u&63)<<12)+((g&63)<<6)+(h&63)-65536;c[d]=String.fromCharCode((a>>10)+55296,(a&1023)+56320)}}c=new String(c.join(""));
c.bytesReadCount=b;return c},readNullTerminatedString:function(e,f){f=f||e.length;for(var b=Array(f),c=0;c<f;){var d=e[c++];if(0===d)break;b[c-1]=String.fromCharCode(d)}b=new String(b.join(""));b.bytesReadCount=c;return b},readISO_8859_1String:function(e,f){var b=unescape("%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457");f=f||e.length;for(var c=Array(f),d=0;d<f;){var a=e[d++];if(0===a)break;var u=c,g=d-1;a=192<=a&&255>=a?String.fromCharCode(a-192+1040):128<=a&&191>=a?b.charAt(a-128):String.fromCharCode(a);u[g]=a}b=new String(c.join(""));b.bytesReadCount=
d;return b}};function BinaryFile(e,f,b){var c=e,d=f||0,a=0;this.getRawData=function(){return c};"string"===typeof e?(a=b||c.length,this.getByteAt=function(a){return c.charCodeAt(a+d)&255}):"unknown"===typeof e&&(a=b||IEBinary_getLength(c),this.getByteAt=function(a){return IEBinary_getByteAt(c,a+d)});this.getBytesAt=function(a,b){for(var c=Array(b),d=0;d<b;d++)c[d]=this.getByteAt(a+d);return c};this.getLength=function(){return a};this.isBitSetAt=function(a,b){return 0!=(this.getByteAt(a)&1<<b)};this.getSByteAt=
function(a){a=this.getByteAt(a);return 127<a?a-256:a};this.getShortAt=function(a,b){var c=b?(this.getByteAt(a)<<8)+this.getByteAt(a+1):(this.getByteAt(a+1)<<8)+this.getByteAt(a);0>c&&(c+=65536);return c};this.getSShortAt=function(a,b){var c=this.getShortAt(a,b);return 32767<c?c-65536:c};this.getLongAt=function(a,b){var c=this.getBytesAt(a,4),d=c[0]&255,e=c[1]&255,f=c[2]&255,c=c[3]&255,d=b?(((d<<8)+e<<8)+f<<8)+c:(((c<<8)+f<<8)+e<<8)+d;0>d&&(d+=4294967296);return d};this.getSLongAt=function(a,b){var c=
this.getLongAt(a,b);return 2147483647<c?c-4294967296:c};this.getInteger24At=function(a,c){var b=this.getBytesAt(a,3),d=b[0]&255,e=b[1]&255,b=b[2]&255,d=c?((d<<8)+e<<8)+b:((b<<8)+e<<8)+d;0>d&&(d+=16777216);return d};this.getStringAt=function(a,b){for(var c=Array(b),d=this.getBytesAt(a,b),e=0;e<b;e++)c[e]=String.fromCharCode(d[e]&255);return c.join("")};this.getStringWithCharsetAt=function(a,b,c){a=this.getBytesAt(a,b);switch(c.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":c=StringUtils.readUTF16String(a,
c);break;case "utf-8":c=StringUtils.readUTF8String(a);break;case "iso-8859-1":c=StringUtils.readISO_8859_1String(a);break;default:c=StringUtils.readNullTerminatedString(a)}return c};this.decodeString=function(a,c,b,d){var e,f,m,w,q,k,n;b=b.toLowerCase();k=null===c?0:-1;null==c&&(c=Infinity);d=a+c;n="";switch(b){case "iso-8859-1":case "ascii":case "latin1":for(;a<d&&(q=this.getByteAt(a++))!==k;)n+=String.fromCharCode(q);break;case "utf8":case "utf-8":for(;a<d&&(e=this.getByteAt(a++))!==k;)0===(e&128)?
n+=String.fromCharCode(e):192===(e&224)?(f=this.getByteAt(a++)&63,n+=String.fromCharCode((e&31)<<6|f)):224===(e&240)?(f=this.getByteAt(a++)&63,m=this.getByteAt(a++)&63,n+=String.fromCharCode((e&15)<<12|f<<6|m)):240===(e&248)&&(f=this.getByteAt(a++)&63,m=this.getByteAt(a++)&63,c=this.getByteAt(a++)&63,f=((e&15)<<18|f<<12|m<<6|c)-65536,n+=String.fromCharCode(55296+(f>>10),56320+(f&1023)));break;case "utf16-be":case "utf16be":case "utf-16":case "utf16le":case "utf16-le":case "utf16bom":case "utf16-bom":switch(b){case "utf16be":case "utf16-be":f=
!1;break;case "utf16le":case "utf16-le":f=!0;break;case "utf16bom":case "utf16-bom":if(2>c||(w=this.getShortAt(a))===k)return n;f=65534===w;a+=2}for(;a<d&&(m=this.getShortAt(a,f))!==k;)if(a+=2,55296>m||57343<m)n+=String.fromCharCode(m);else{if(56319<m)throw Error("Invalid utf16 sequence.");e=this.getShortAt(a,f);if(56320>e||57343<e)throw Error("Invalid utf16 sequence.");n+=String.fromCharCode(m,e);a+=2}m===k&&(a+=2);break;default:n=this.getStringWithCharsetAt(a,c,b),a+=n.length}return[n,a]};this.readString=
function(a,c,b){null==b&&(b="ascii");return this.decodeString(a,c,b,!0)};this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))};this.toBase64=function(){return window.btoa(c)};this.fromBase64=function(a){c=window.atob(a)};this.loadRange=function(a,c){c()}}var js=document.createElement("script");js.type="text/vbscript";js.textContent="Function IEBinary_getByteAt(strBinary, iOffset)\r\n\tIEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n\tIEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n";
document.getElementsByTagName("head")[0].appendChild(js);var BufferedFileReader=function(e,f,b){f(new function(c,b,a,e){var g=0;a=new BinaryFile("",0,b);var f=new Uint8Array(b),l=[],s=function(a){var c=0;l.forEach(function(b){if(a>=b[0]&&a<b[1])return c=1,0});return c},p=function(a,b){for(;0!==s(a[0]);)if(a[0]++,a[0]>a[1])return b?b():void 0;for(;0!==s(a[1]);)if(a[1]--,a[0]>a[1])return b?b():void 0;var d=new FileReader;d.onload=function(c){l.push(a);c=new Uint8Array(c.target.result);f.set(c,a[0]);g+=a[1]-a[0]+1;b&&b()};d.readAsArrayBuffer(c.slice(a[0],
a[1]))},m;for(m in a)a.hasOwnProperty(m)&&"function"===typeof a[m]&&(this[m]=a[m]);this.getByteAt=function(a){return f[a]};this.getBytesAt=function(a,b){return f.subarray(a,a+b)};this.getDownloadedBytesCount=function(){return g};this.loadRange=function(a,b){p(a,b)}}(e,e.size))};(function(e){function f(a){return"ftypM4A"==a.getStringAt(4,7)?ID4:"ID3"==a.getStringAt(0,3)?ID3v2:ID3v1}var b=e.ID3={},c={},d=[0,11];b.clearTags=function(a){delete c[a]};b.clearAll=function(){c={}};b.loadTags=function(a,b,e){e=e||{};(void 0!==e.file?BufferedFileReader:e.dataReader)(e.file||a,function(h){h.loadRange(d,function(){var d=f(h);d.loadData(h,function(){var f=e.tags,p=d.readTagsFromData(h,f),f=c[a]||{},m;for(m in p)p.hasOwnProperty(m)&&(f[m]=p[m]);c[a]=f;b&&b()})})},e.onError)};b.getAllTags=
function(a){if(!c[a])return null;var b={},d;for(d in c[a])c[a].hasOwnProperty(d)&&(b[d]=c[a][d]);return b};b.getTag=function(a,b){return c[a]?c[a][b]:null};e.ID3=e.ID3;b.loadTags=b.loadTags;b.getAllTags=b.getAllTags;b.getTag=b.getTag;b.clearTags=b.clearTags;b.clearAll=b.clearAll})(this);(function(e){var f=e.ID3v1={},b="Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";");
f.loadData=function(b,d){var a=b.getLength();b.loadRange([a-128-1,a],d)};f.readTagsFromData=function(c){var d=c.getLength()-128;if("TAG"==c.getStringAt(d,3)){var a=c.getStringAt(d+3,30).replace(/\0/g,""),e=c.getStringAt(d+33,30).replace(/\0/g,""),f=c.getStringAt(d+63,30).replace(/\0/g,""),h=c.getStringAt(d+93,4).replace(/\0/g,"");if(0==c.getByteAt(d+97+28))var l=c.getStringAt(d+97,28).replace(/\0/g,""),s=c.getByteAt(d+97+29);else l="",s=0;c=c.getByteAt(d+97+30);return{version:"1.1",title:a,artist:e,
album:f,year:h,comment:l,track:s,genre:255>c?b[c]:""}}return{}};e.ID3v1=e.ID3v1})(this);(function(e){function f(a,b){var c=b.getBytesAt(a,4);return c[3]&127|(c[2]&127)<<7|(c[1]&127)<<14|(c[0]&127)<<21}var b=e.ID3v2={};b.readFrameData={};b.frames={BUF:"Recommended buffer size",CNT:"Play counter",COM:"Comments",CRA:"Audio encryption",CRM:"Encrypted meta frame",ETC:"Event timing codes",EQU:"Equalization",GEO:"General encapsulated object",IPL:"Involved people list",LNK:"Linked information",MCI:"Music CD Identifier",MLL:"MPEG location lookup table",PIC:"Attached picture",POP:"Popularimeter",
REV:"Reverb",RVA:"Relative volume adjustment",SLT:"Synchronized lyric/text",STC:"Synced tempo codes",TAL:"Album/Movie/Show title",TBP:"BPM (Beats Per Minute)",TCM:"Composer",TCO:"Content type",TCR:"Copyright message",TDA:"Date",TDY:"Playlist delay",TEN:"Encoded by",TFT:"File type",TIM:"Time",TKE:"Initial key",TLA:"Language(s)",TLE:"Length",TMT:"Media type",TOA:"Original artist(s)/performer(s)",TOF:"Original filename",TOL:"Original Lyricist(s)/text writer(s)",TOR:"Original release year",TOT:"Original album/Movie/Show title",
TP1:"Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",TP2:"Band/Orchestra/Accompaniment",TP3:"Conductor/Performer refinement",TP4:"Interpreted, remixed, or otherwise modified by",TPA:"Part of a set",TPB:"Publisher",TRC:"ISRC (International Standard Recording Code)",TRD:"Recording dates",TRK:"Track number/Position in set",TSI:"Size",TSS:"Software/hardware and settings used for encoding",TT1:"Content group description",TT2:"Title/Songname/Content description",TT3:"Subtitle/Description refinement",
TXT:"Lyricist/text writer",TXX:"User defined text information frame",TYE:"Year",UFI:"Unique file identifier",ULT:"Unsychronized lyric/text transcription",WAF:"Official audio file webpage",WAR:"Official artist/performer webpage",WAS:"Official audio source webpage",WCM:"Commercial information",WCP:"Copyright/Legal information",WPB:"Publishers official webpage",WXX:"User defined URL link frame",AENC:"Audio encryption",APIC:"Attached picture",COMM:"Comments",COMR:"Commercial frame",ENCR:"Encryption method registration",
EQUA:"Equalization",ETCO:"Event timing codes",GEOB:"General encapsulated object",GRID:"Group identification registration",IPLS:"Involved people list",LINK:"Linked information",MCDI:"Music CD identifier",MLLT:"MPEG location lookup table",OWNE:"Ownership frame",PRIV:"Private frame",PCNT:"Play counter",POPM:"Popularimeter",POSS:"Position synchronisation frame",RBUF:"Recommended buffer size",RVAD:"Relative volume adjustment",RVRB:"Reverb",SYLT:"Synchronized lyric/text",SYTC:"Synchronized tempo codes",
TALB:"Album/Movie/Show title",TBPM:"BPM (beats per minute)",TCOM:"Composer",TCON:"Content type",TCOP:"Copyright message",TDAT:"Date",TDLY:"Playlist delay",TENC:"Encoded by",TEXT:"Lyricist/Text writer",TFLT:"File type",TIME:"Time",TIT1:"Content group description",TIT2:"Title/songname/content description",TIT3:"Subtitle/Description refinement",TKEY:"Initial key",TLAN:"Language(s)",TLEN:"Length",TMED:"Media type",TOAL:"Original album/movie/show title",TOFN:"Original filename",TOLY:"Original lyricist(s)/text writer(s)",
TOPE:"Original artist(s)/performer(s)",TORY:"Original release year",TOWN:"File owner/licensee",TPE1:"Lead performer(s)/Soloist(s)",TPE2:"Band/orchestra/accompaniment",TPE3:"Conductor/performer refinement",TPE4:"Interpreted, remixed, or otherwise modified by",TPOS:"Part of a set",TPUB:"Publisher",TRCK:"Track number/Position in set",TRDA:"Recording dates",TRSN:"Internet radio station name",TRSO:"Internet radio station owner",TSIZ:"Size",TSRC:"ISRC (international standard recording code)",TSSE:"Software/Hardware and settings used for encoding",
TYER:"Year",TXXX:"User defined text information frame",UFID:"Unique file identifier",USER:"Terms of use",USLT:"Unsychronized lyric/text transcription",WCOM:"Commercial information",WCOP:"Copyright/Legal information",WOAF:"Official audio file webpage",WOAR:"Official artist/performer webpage",WOAS:"Official audio source webpage",WORS:"Official internet radio station homepage",WPAY:"Payment",WPUB:"Publishers official webpage",WXXX:"User defined URL link frame"};var c={title:["TIT2","TT2"],artist:["TPE1",
"TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON","TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},d=["title","artist","album","track"];b.readSynchsafeInteger32At=f;b.loadData=function(a,b){a.loadRange([0,f(6,a)],b)};b.readTagsFromData=function(a,e){var g=0,h=a.getByteAt(g+3);if(4<h)return{version:">2.4"};var l=a.getByteAt(g+4),s=a.isBitSetAt(g+5,7),p=a.isBitSetAt(g+5,6),m=a.isBitSetAt(g+5,5),w=f(g+6,a),g=g+10;if(p)var q=a.getLongAt(g,!0),
g=g+(q+4);var h={version:"2."+h+"."+l,major:h,revision:l,flags:{unsynchronisation:s,extended_header:p,experimental_indicator:m},size:w},k;if(s)k={};else{for(var w=w-10,s=a,l={},p=h.major,m=e||d,q=[],n=0,r;r=m[n];n++)q=q.concat(c[r]||[r]);for(m=q;g<w;){q=null;n=s;r=g;var t=null;switch(p){case 2:k=n.getStringAt(r,3);var v=n.getInteger24At(r+3,!0),y=6;break;case 3:k=n.getStringAt(r,4);v=n.getLongAt(r+4,!0);y=10;break;case 4:k=n.getStringAt(r,4),v=f(r+4,n),y=10}if(""==k)break;g+=y+v;if(!(0>m.indexOf(k))){if(2<
p)var t=n,x=r+8,t={message:{tag_alter_preservation:t.isBitSetAt(x,6),file_alter_preservation:t.isBitSetAt(x,5),read_only:t.isBitSetAt(x,4)},format:{grouping_identity:t.isBitSetAt(x+1,7),compression:t.isBitSetAt(x+1,3),encription:t.isBitSetAt(x+1,2),unsynchronisation:t.isBitSetAt(x+1,1),data_length_indicator:t.isBitSetAt(x+1,0)}};r+=y;t&&t.format.data_length_indicator&&(f(r,n),r+=4,v-=4);t&&t.format.unsynchronisation||(void 0!==b.readFrameData[k]?q=b.readFrameData[k]:"T"==k[0]&&(q=b.readFrameData["T*"]),
q=q?q(r,v,n,t):void 0,q={id:k,size:v,description:void 0!==b.frames[k]?b.frames[k]:"Unknown",data:q},void 0!==l[k]?(l[k].id&&(l[k]=[l[k]]),l[k].push(q)):l[k]=q)}}k=l}for(var z in c)if(c.hasOwnProperty(z)){a:{v=c[z];"string"==typeof v&&(v=[v]);y=0;for(g=void 0;g=v[y];y++)if(void 0!==k[g]){a=k[g].data;break a}a=void 0}a&&(h[z]=a)}for(var A in k)k.hasOwnProperty(A)&&(h[A]=k[A]);return h};e.ID3v2=b})(this);(function(){function e(b){var c;switch(b){case 0:c="iso-8859-1";break;case 1:c="utf-16";break;case 2:c="utf-16be";break;case 3:c="utf-8"}return c}var f="32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. lable side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(";");
ID3v2.readFrameData.APIC=function(b,c,d,a,u){var g=b,h=d.getByteAt(b);b++;b=d.readString(b,null,"latin1");a=b[0];b=b[1];u=d.getByteAt(b);b++;b=d.readString(b,null,e(h));h=b[0];b=b[1];c=d.getBytesAt(b,c-b-g);return{format:a,type:f[u],description:h,data:c}};ID3v2.readFrameData.COMM=function(b,c,d){var a=b,f=e(d.getByteAt(b)),g=d.getStringAt(b+1,3),h=d.getStringWithCharsetAt(b+4,c-4,f);b+=4+h.bytesReadCount;b=d.getStringWithCharsetAt(b,a+c-b,f);return{language:g,short_description:h.toString(),text:b.toString()}};
ID3v2.readFrameData.COM=ID3v2.readFrameData.COMM;ID3v2.readFrameData.PIC=function(b,c,d,a){return ID3v2.readFrameData.APIC(b,c,d,a,"2")};ID3v2.readFrameData.PCNT=function(b,c,d){return d.getInteger32At(b)};ID3v2.readFrameData.CNT=ID3v2.readFrameData.PCNT;ID3v2.readFrameData["T*"]=function(b,c,d){var a=e(d.getByteAt(b));return d.getStringWithCharsetAt(b+1,c-1,a).toString()};ID3v2.readFrameData.TCON=function(b,c,d){return ID3v2.readFrameData["T*"].apply(this,arguments).replace(/^\(\d+\)/,"")};ID3v2.readFrameData.TCO=
ID3v2.readFrameData.TCON;ID3v2.readFrameData.USLT=function(b,c,d){var a=b,f=e(d.getByteAt(b)),g=d.getStringAt(b+1,3),h=d.getStringWithCharsetAt(b+4,c-4,f);b+=4+h.bytesReadCount;b=d.getStringWithCharsetAt(b,a+c-b,f);return{language:g,descriptor:h.toString(),lyrics:b.toString()}};ID3v2.readFrameData.ULT=ID3v2.readFrameData.USLT})();(function(e){function f(b,a,e,g){var h=b.getLongAt(a,!0);if(isNaN(h)||0===h)return g();var l=b.getStringAt(a+4,4);-1<["moov","udta","meta","ilst"].indexOf(l)?("meta"==l&&(a+=4),b.loadRange([a+8,a+8+8],function(){f(b,a+8,h-8,g)})):b.loadRange([a+(void 0!==c.atom[l]?0:h),a+h+8],function(){f(b,a+h,e,g)})}function b(d,a,e,f,h){h=void 0===h?"":h+"  ";for(var l=e;l<e+f;){var s=a.getLongAt(l,!0);if(isNaN(s)||0==s)break;var p=a.getStringAt(l+4,4);if(-1<["moov","udta","meta","ilst"].indexOf(p)){"meta"==p&&
(l+=4);b(d,a,l+8,s-8,h);break}if(c.atom[p]){var m=a.getInteger24At(l+16+1,!0),w=c.atom[p],m=c.types[m];if("trkn"==p)d[w[0]]=a.getByteAt(l+16+11),d.count=a.getByteAt(l+16+13);else{var p=l+16+4+4,q=s-16-4-4,k;switch(m){case "text":k=a.getStringWithCharsetAt(p,q,"UTF-8");break;case "uint8":k=a.getShortAt(p);break;case "jpeg":case "png":k={format:"image/"+m,data:a.getBytesAt(p,q)}}d[w[0]]="comment"===w[0]?{text:k}:k}}l+=s}}var c=e.ID4={};c.types={0:"uint8",1:"text",13:"jpeg",14:"png",21:"uint8"};c.atom=
{"\u00a9alb":["album"],"\u00a9art":["artist"],"\u00a9ART":["artist"],aART:["artist"],"\u00a9day":["year"],"\u00a9nam":["title"],"\u00a9gen":["genre"],trkn:["track"],"\u00a9wrt":["composer"],"\u00a9too":["encoder"],cprt:["copyright"],covr:["picture"],"\u00a9grp":["grouping"],keyw:["keyword"],"\u00a9lyr":["lyrics"],"\u00a9cmt":["comment"],tmpo:["tempo"],cpil:["compilation"],disk:["disc"]};c.loadData=function(b,a){b.loadRange([0,8],function(){f(b,0,b.getLength(),a)})};c.readTagsFromData=function(c){var a=
{};b(a,c,0,c.getLength());return a};e.ID4=e.ID4})(this);
