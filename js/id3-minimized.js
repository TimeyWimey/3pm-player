var StringUtils={readUTF16String:function(e,b,d){var c=0,f=1,a=0;d=Math.min(d||e.length,e.length);254===e[0]&&255===e[1]?(b=!0,c=2):255===e[0]&&254===e[1]&&(b=!1,c=2);b&&(f=0,a=1);b=Array(d);for(var r=0;c<d;r++){var g=e[c+f],h=(g<<8)+e[c+a],c=c+2;if(0===h)break;else 216>g||224<=g?b[r]=String.fromCharCode(h):(g=(e[c+f]<<8)+e[c+a],c+=2,b[r]=String.fromCharCode(h,g))}e=new String(b.join(""));e.bytesReadCount=c;return e},readUTF8String:function(e,b){var d=0;b=Math.min(b||e.length,e.length);239===e[0]&&
187===e[1]&&191===e[2]&&(d=3);for(var c=Array(b),f=0;d<b;f++){var a=e[d++];if(0===a)break;else if(128>a)c[f]=String.fromCharCode(a);else if(194<=a&&224>a){var r=e[d++];c[f]=String.fromCharCode(((a&31)<<6)+(r&63))}else if(224<=a&&240>a){var r=e[d++],g=e[d++];c[f]=String.fromCharCode(((a&255)<<12)+((r&63)<<6)+(g&63))}else if(240<=a&&245>a){var r=e[d++],g=e[d++],h=e[d++],a=((a&7)<<18)+((r&63)<<12)+((g&63)<<6)+(h&63)-65536;c[f]=String.fromCharCode((a>>10)+55296,(a&1023)+56320)}}c=new String(c.join(""));
c.bytesReadCount=d;return c},readNullTerminatedString:function(e,b){b=b||e.length;for(var d=Array(b),c=0;c<b;){var f=e[c++];if(0===f)break;d[c-1]=String.fromCharCode(f)}d=new String(d.join(""));d.bytesReadCount=c;return d},readISO_8859_1String:function(e,b){var d=unescape(NaN);b=b||e.length;for(var c=Array(b),f=0;f<b;){var a=e[f++];if(0===a)break;var r=c,g=f-1;a=192<=a&&255>=a?String.fromCharCode(a-192+1040):128<=a&&191>=a?d.charAt(a-128):String.fromCharCode(a);r[g]=a}d=new String(c.join(""));d.bytesReadCount=
f;return d}};function BinaryFile(e,b,d){var c=e,f=b||0,a=0;this.getRawData=function(){return c};"string"===typeof e?(a=d||c.length,this.getByteAt=function(a){return c.charCodeAt(a+f)&255}):"unknown"===typeof e&&(a=d||IEBinary_getLength(c),this.getByteAt=function(a){return IEBinary_getByteAt(c,a+f)});this.getBytesAt=function(a,c){for(var b=Array(c),d=0;d<c;d++)b[d]=this.getByteAt(a+d);return b};this.getLength=function(){return a};this.isBitSetAt=function(a,c){return 0!=(this.getByteAt(a)&1<<c)};this.getSByteAt=
function(a){a=this.getByteAt(a);return 127<a?a-256:a};this.getShortAt=function(a,c){var b=c?(this.getByteAt(a)<<8)+this.getByteAt(a+1):(this.getByteAt(a+1)<<8)+this.getByteAt(a);0>b&&(b+=65536);return b};this.getSShortAt=function(a,c){var b=this.getShortAt(a,c);return 32767<b?b-65536:b};this.getLongAt=function(a,c){var b=this.getBytesAt(a,4),d=b[0]&255,f=b[1]&255,e=b[2]&255,b=b[3]&255,d=c?(((d<<8)+f<<8)+e<<8)+b:(((b<<8)+e<<8)+f<<8)+d;0>d&&(d+=4294967296);return d};this.getSLongAt=function(a,c){var b=
this.getLongAt(a,c);return 2147483647<b?b-4294967296:b};this.getInteger24At=function(a,c){var b=this.getBytesAt(a,3),d=b[0]&255,f=b[1]&255,b=b[2]&255,d=c?((d<<8)+f<<8)+b:((b<<8)+f<<8)+d;0>d&&(d+=16777216);return d};this.getStringAt=function(a,b){for(var c=Array(b),d=this.getBytesAt(a,b),f=0;f<b;f++)c[f]=String.fromCharCode(d[f]&255);return c.join("")};this.getStringWithCharsetAt=function(a,b,c){a=this.getBytesAt(a,b);switch(c.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":c=StringUtils.readUTF16String(a,
c);break;case "utf-8":c=StringUtils.readUTF8String(a);break;case "iso-8859-1":c=StringUtils.readISO_8859_1String(a);break;default:c=StringUtils.readNullTerminatedString(a)}return c};this.decodeString=function(a,c,b,d){var f,e,m,w,q,k,n;b=b.toLowerCase();k=null===c?0:-1;null==c&&(c=Infinity);d=a+c;n="";switch(b){case "iso-8859-1":case "ascii":case "latin1":for(;a<d&&(q=this.getByteAt(a++))!==k;)n+=String.fromCharCode(q);break;case "utf8":case "utf-8":for(;a<d&&(f=this.getByteAt(a++))!==k;)0===(f&128)?
n+=String.fromCharCode(f):192===(f&224)?(e=this.getByteAt(a++)&63,n+=String.fromCharCode((f&31)<<6|e)):224===(f&240)?(e=this.getByteAt(a++)&63,m=this.getByteAt(a++)&63,n+=String.fromCharCode((f&15)<<12|e<<6|m)):240===(f&248)&&(e=this.getByteAt(a++)&63,m=this.getByteAt(a++)&63,c=this.getByteAt(a++)&63,e=((f&15)<<18|e<<12|m<<6|c)-65536,n+=String.fromCharCode(55296+(e>>10),56320+(e&1023)));break;case "utf16-be":case "utf16be":case "utf-16":case "utf16le":case "utf16-le":case "utf16bom":case "utf16-bom":switch(b){case "utf16be":case "utf16-be":e=
!1;break;case "utf16le":case "utf16-le":e=!0;break;case "utf16bom":case "utf16-bom":if(2>c||(w=this.getShortAt(a))===k)return n;e=65534===w;a+=2}for(;a<d&&(m=this.getShortAt(a,e))!==k;)if(a+=2,55296>m||57343<m)n+=String.fromCharCode(m);else{if(56319<m)throw Error("Invalid utf16 sequence.");f=this.getShortAt(a,e);if(56320>f||57343<f)throw Error("Invalid utf16 sequence.");n+=String.fromCharCode(m,f);a+=2}m===k&&(a+=2);break;default:throw Error("Unknown encoding: "+b);}return[n,a]};this.readString=function(a,
c,b){null==b&&(b="ascii");return this.decodeString(a,c,b,!0)};this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))};this.toBase64=function(){return window.btoa(c)};this.fromBase64=function(a){c=window.atob(a)};this.loadRange=function(a,c){c()}}var js=document.createElement("script");js.type="text/vbscript";js.textContent="Function IEBinary_getByteAt(strBinary, iOffset)\r\n\tIEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n\tIEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n";
document.getElementsByTagName("head")[0].appendChild(js);var BufferedFileReader=function(e,b,d){b(new function(c,b,a,d){var e=0;a=new BinaryFile("",0,b);var h=new Uint8Array(b),l=[],t=function(a){var c=0;l.forEach(function(b){if(a>=b[0]&&a<b[1])return c=1,0});return c},p=function(a,b){for(;0!==t(a[0]);)if(a[0]++,a[0]>a[1])return b?b():void 0;for(;0!==t(a[1]);)if(a[1]--,a[0]>a[1])return b?b():void 0;var d=new FileReader;d.onload=function(c){l.push(a);c=new Uint8Array(c.target.result);h.set(c,a[0]);e+=a[1]-a[0]+1;b&&b()};d.readAsArrayBuffer(c.slice(a[0],
a[1]))},m;for(m in a)a.hasOwnProperty(m)&&"function"===typeof a[m]&&(this[m]=a[m]);this.getByteAt=function(a){return h[a]};this.getBytesAt=function(a,b){return h.subarray(a,a+b)};this.getDownloadedBytesCount=function(){return e};this.loadRange=function(a,b){p(a,b)}}(e,e.size))};(function(e){function b(a){return"ftypM4A"==a.getStringAt(4,7)?ID4:"ID3"==a.getStringAt(0,3)?ID3v2:ID3v1}var d=e.ID3={},c={},f=[0,11];d.clearTags=function(a){delete c[a]};d.clearAll=function(){c={}};d.loadTags=function(a,d,e){e=e||{};(void 0!==e.file?BufferedFileReader:e.dataReader)(e.file||a,function(h){h.loadRange(f,function(){var f=b(h);f.loadData(h,function(){var b=e.tags,p=f.readTagsFromData(h,b),b=c[a]||{},m;for(m in p)p.hasOwnProperty(m)&&(b[m]=p[m]);c[a]=b;d&&d()})})},e.onError)};d.getAllTags=
function(a){if(!c[a])return null;var b={},d;for(d in c[a])c[a].hasOwnProperty(d)&&(b[d]=c[a][d]);return b};d.getTag=function(a,b){return c[a]?c[a][b]:null};e.ID3=e.ID3;d.loadTags=d.loadTags;d.getAllTags=d.getAllTags;d.getTag=d.getTag;d.clearTags=d.clearTags;d.clearAll=d.clearAll})(this);(function(e){var b=e.ID3v1={},d="Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";");
b.loadData=function(b,d){var a=b.getLength();b.loadRange([a-128-1,a],d)};b.readTagsFromData=function(b){var f=b.getLength()-128;if("TAG"==b.getStringAt(f,3)){var a=b.getStringAt(f+3,30).replace(/\0/g,""),e=b.getStringAt(f+33,30).replace(/\0/g,""),g=b.getStringAt(f+63,30).replace(/\0/g,""),h=b.getStringAt(f+93,4).replace(/\0/g,"");if(0==b.getByteAt(f+97+28))var l=b.getStringAt(f+97,28).replace(/\0/g,""),t=b.getByteAt(f+97+29);else l="",t=0;b=b.getByteAt(f+97+30);return{version:"1.1",title:a,artist:e,
album:g,year:h,comment:l,track:t,genre:255>b?d[b]:""}}return{}};e.ID3v1=e.ID3v1})(this);(function(e){function b(a,b){var c=b.getBytesAt(a,4);return c[3]&127|(c[2]&127)<<7|(c[1]&127)<<14|(c[0]&127)<<21}var d=e.ID3v2={};d.readFrameData={};d.frames={BUF:"Recommended buffer size",CNT:"Play counter",COM:"Comments",CRA:"Audio encryption",CRM:"Encrypted meta frame",ETC:"Event timing codes",EQU:"Equalization",GEO:"General encapsulated object",IPL:"Involved people list",LNK:"Linked information",MCI:"Music CD Identifier",MLL:"MPEG location lookup table",PIC:"Attached picture",POP:"Popularimeter",
REV:"Reverb",RVA:"Relative volume adjustment",SLT:"Synchronized lyric/text",STC:"Synced tempo codes",TAL:"Album/Movie/Show title",TBP:"BPM (Beats Per Minute)",TCM:"Composer",TCO:"Content type",TCR:"Copyright message",TDA:"Date",TDY:"Playlist delay",TEN:"Encoded by",TFT:"File type",TIM:"Time",TKE:"Initial key",TLA:"Language(s)",TLE:"Length",TMT:"Media type",TOA:"Original artist(s)/performer(s)",TOF:"Original filename",TOL:"Original Lyricist(s)/text writer(s)",TOR:"Original release year",TOT:"Original album/Movie/Show title",
TP1:"Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",TP2:"Band/Orchestra/Accompaniment",TP3:"Conductor/Performer refinement",TP4:"Interpreted, remixed, or otherwise modified by",TPA:"Part of a set",TPB:"Publisher",TRC:"ISRC (International Standard Recording Code)",TRD:"Recording dates",TRK:"Track number/Position in set",TSI:"Size",TSS:"Software/hardware and settings used for encoding",TT1:"Content group description",TT2:"Title/Songname/Content description",TT3:"Subtitle/Description refinement",
TXT:"Lyricist/text writer",TXX:"User defined text information frame",TYE:"Year",UFI:"Unique file identifier",ULT:"Unsychronized lyric/text transcription",WAF:"Official audio file webpage",WAR:"Official artist/performer webpage",WAS:"Official audio source webpage",WCM:"Commercial information",WCP:"Copyright/Legal information",WPB:"Publishers official webpage",WXX:"User defined URL link frame",AENC:"Audio encryption",APIC:"Attached picture",COMM:"Comments",COMR:"Commercial frame",ENCR:"Encryption method registration",
EQUA:"Equalization",ETCO:"Event timing codes",GEOB:"General encapsulated object",GRID:"Group identification registration",IPLS:"Involved people list",LINK:"Linked information",MCDI:"Music CD identifier",MLLT:"MPEG location lookup table",OWNE:"Ownership frame",PRIV:"Private frame",PCNT:"Play counter",POPM:"Popularimeter",POSS:"Position synchronisation frame",RBUF:"Recommended buffer size",RVAD:"Relative volume adjustment",RVRB:"Reverb",SYLT:"Synchronized lyric/text",SYTC:"Synchronized tempo codes",
TALB:"Album/Movie/Show title",TBPM:"BPM (beats per minute)",TCOM:"Composer",TCON:"Content type",TCOP:"Copyright message",TDAT:"Date",TDLY:"Playlist delay",TENC:"Encoded by",TEXT:"Lyricist/Text writer",TFLT:"File type",TIME:"Time",TIT1:"Content group description",TIT2:"Title/songname/content description",TIT3:"Subtitle/Description refinement",TKEY:"Initial key",TLAN:"Language(s)",TLEN:"Length",TMED:"Media type",TOAL:"Original album/movie/show title",TOFN:"Original filename",TOLY:"Original lyricist(s)/text writer(s)",
TOPE:"Original artist(s)/performer(s)",TORY:"Original release year",TOWN:"File owner/licensee",TPE1:"Lead performer(s)/Soloist(s)",TPE2:"Band/orchestra/accompaniment",TPE3:"Conductor/performer refinement",TPE4:"Interpreted, remixed, or otherwise modified by",TPOS:"Part of a set",TPUB:"Publisher",TRCK:"Track number/Position in set",TRDA:"Recording dates",TRSN:"Internet radio station name",TRSO:"Internet radio station owner",TSIZ:"Size",TSRC:"ISRC (international standard recording code)",TSSE:"Software/Hardware and settings used for encoding",
TYER:"Year",TXXX:"User defined text information frame",UFID:"Unique file identifier",USER:"Terms of use",USLT:"Unsychronized lyric/text transcription",WCOM:"Commercial information",WCOP:"Copyright/Legal information",WOAF:"Official audio file webpage",WOAR:"Official artist/performer webpage",WOAS:"Official audio source webpage",WORS:"Official internet radio station homepage",WPAY:"Payment",WPUB:"Publishers official webpage",WXXX:"User defined URL link frame"};var c={title:["TIT2","TT2"],artist:["TPE1",
"TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON","TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},f=["title","artist","album","track"];d.readSynchsafeInteger32At=b;d.loadData=function(a,c){a.loadRange([0,b(6,a)],c)};d.readTagsFromData=function(a,e){var g=0,h=a.getByteAt(g+3);if(4<h)return{version:">2.4"};var l=a.getByteAt(g+4),t=a.isBitSetAt(g+5,7),p=a.isBitSetAt(g+5,6),m=a.isBitSetAt(g+5,5),w=b(g+6,a),g=g+10;if(p)var q=a.getLongAt(g,!0),
g=g+(q+4);var h={version:"2."+h+"."+l,major:h,revision:l,flags:{unsynchronisation:t,extended_header:p,experimental_indicator:m},size:w},k;if(t)k={};else{for(var w=w-10,t=a,l={},p=h.major,m=e||f,q=[],n=0,s;s=m[n];n++)q=q.concat(c[s]||[s]);for(m=q;g<w;){q=null;n=t;s=g;var u=null;switch(p){case 2:k=n.getStringAt(s,3);var v=n.getInteger24At(s+3,!0),y=6;break;case 3:k=n.getStringAt(s,4);v=n.getLongAt(s+4,!0);y=10;break;case 4:k=n.getStringAt(s,4),v=b(s+4,n),y=10}if(""==k)break;g+=y+v;if(!(0>m.indexOf(k))){if(2<
p)var u=n,x=s+8,u={message:{tag_alter_preservation:u.isBitSetAt(x,6),file_alter_preservation:u.isBitSetAt(x,5),read_only:u.isBitSetAt(x,4)},format:{grouping_identity:u.isBitSetAt(x+1,7),compression:u.isBitSetAt(x+1,3),encription:u.isBitSetAt(x+1,2),unsynchronisation:u.isBitSetAt(x+1,1),data_length_indicator:u.isBitSetAt(x+1,0)}};s+=y;u&&u.format.data_length_indicator&&(b(s,n),s+=4,v-=4);u&&u.format.unsynchronisation||(void 0!==d.readFrameData[k]?q=d.readFrameData[k]:"T"==k[0]&&(q=d.readFrameData["T*"]),
q=q?q(s,v,n,u):void 0,q={id:k,size:v,description:void 0!==d.frames[k]?d.frames[k]:"Unknown",data:q},void 0!==l[k]?(l[k].id&&(l[k]=[l[k]]),l[k].push(q)):l[k]=q)}}k=l}for(var z in c)if(c.hasOwnProperty(z)){a:{v=c[z];"string"==typeof v&&(v=[v]);y=0;for(g=void 0;g=v[y];y++)if(void 0!==k[g]){a=k[g].data;break a}a=void 0}a&&(h[z]=a)}for(var A in k)k.hasOwnProperty(A)&&(h[A]=k[A]);return h};e.ID3v2=d})(this);(function(){function e(b){var d;switch(b){case 0:d="iso-8859-1";break;case 1:d="utf-16";break;case 2:d="utf-16be";break;case 3:d="utf-8"}return d}ID3v2.readFrameData.APIC=function(b,d,c,f,a){a=b;var r=c.getByteAt(b);b++;b=c.readString(b,null,"latin1");f=b[0];b=b[1];c.getByteAt(b,null,1);b++;b=c.readString(b,null,e(r));r=b[0];b=b[1];d=c.getBytesAt(b,d-b-a);return{format:f,type:f,description:r,data:d}};ID3v2.readFrameData.COMM=function(b,d,c){var f=b,a=e(c.getByteAt(b)),r=c.getStringAt(b+1,3),g=c.getStringWithCharsetAt(b+
4,d-4,a);b+=4+g.bytesReadCount;b=c.getStringWithCharsetAt(b,f+d-b,a);return{language:r,short_description:g.toString(),text:b.toString()}};ID3v2.readFrameData.COM=ID3v2.readFrameData.COMM;ID3v2.readFrameData.PIC=function(b,d,c,e){return ID3v2.readFrameData.APIC(b,d,c,e,"2")};ID3v2.readFrameData.PCNT=function(b,d,c){return c.getInteger32At(b)};ID3v2.readFrameData.CNT=ID3v2.readFrameData.PCNT;ID3v2.readFrameData["T*"]=function(b,d,c){var f=e(c.getByteAt(b));return c.getStringWithCharsetAt(b+1,d-1,f).toString()};
ID3v2.readFrameData.TCON=function(b,d,c){return ID3v2.readFrameData["T*"].apply(this,arguments).replace(/^\(\d+\)/,"")};ID3v2.readFrameData.TCO=ID3v2.readFrameData.TCON;ID3v2.readFrameData.USLT=function(b,d,c){var f=b,a=e(c.getByteAt(b)),r=c.getStringAt(b+1,3),g=c.getStringWithCharsetAt(b+4,d-4,a);b+=4+g.bytesReadCount;b=c.getStringWithCharsetAt(b,f+d-b,a);return{language:r,descriptor:g.toString(),lyrics:b.toString()}};ID3v2.readFrameData.ULT=ID3v2.readFrameData.USLT})();(function(e){function b(d,a,e,g){var h=d.getLongAt(a,!0);if(isNaN(h)||0===h)return g();var l=d.getStringAt(a+4,4);-1<["moov","udta","meta","ilst"].indexOf(l)?("meta"==l&&(a+=4),d.loadRange([a+8,a+8+8],function(){b(d,a+8,h-8,g)})):d.loadRange([a+(void 0!==c.atom[l]?0:h),a+h+8],function(){b(d,a+h,e,g)})}function d(b,a,e,g,h){h=void 0===h?"":h+"  ";for(var l=e;l<e+g;){var t=a.getLongAt(l,!0);if(isNaN(t)||0==t)break;var p=a.getStringAt(l+4,4);if(-1<["moov","udta","meta","ilst"].indexOf(p)){"meta"==p&&
(l+=4);d(b,a,l+8,t-8,h);break}if(c.atom[p]){var m=a.getInteger24At(l+16+1,!0),w=c.atom[p],m=c.types[m];if("trkn"==p)b[w[0]]=a.getByteAt(l+16+11),b.count=a.getByteAt(l+16+13);else{var p=l+16+4+4,q=t-16-4-4,k;switch(m){case "text":k=a.getStringWithCharsetAt(p,q,"UTF-8");break;case "uint8":k=a.getShortAt(p);break;case "jpeg":case "png":k={format:"image/"+m,data:a.getBytesAt(p,q)}}b[w[0]]="comment"===w[0]?{text:k}:k}}l+=t}}var c=e.ID4={};c.types={0:"uint8",1:"text",13:"jpeg",14:"png",21:"uint8"};c.atom=
{"\u00a9alb":["album"],"\u00a9art":["artist"],"\u00a9ART":["artist"],aART:["artist"],"\u00a9day":["year"],"\u00a9nam":["title"],"\u00a9gen":["genre"],trkn:["track"],"\u00a9wrt":["composer"],"\u00a9too":["encoder"],cprt:["copyright"],covr:["picture"],"\u00a9grp":["grouping"],keyw:["keyword"],"\u00a9lyr":["lyrics"],"\u00a9cmt":["comment"],tmpo:["tempo"],cpil:["compilation"],disk:["disc"]};c.loadData=function(c,a){c.loadRange([0,8],function(){b(c,0,c.getLength(),a)})};c.readTagsFromData=function(b){var a=
{};d(a,b,0,b.getLength());return a};e.ID4=e.ID4})(this);
