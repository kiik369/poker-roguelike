/* Joker-Motive (technik-1). Jede Funktion malt ein Motiv in 62x83-Karten (F = Hintergrund, S = Vordergrund). */
(function(){ const {put,rect,disc,ell,sell,line,poly,outline,shine,bands,star5,plus,OL,WH}=window.JK;

  // ---------- 1. Ruckelschutz ----------
  function ruckelschutz(F,S){
    bands(F,4,4,57,78,[[4,'#18b8d8'],[18,'#34ccea'],[34,'#5ee0f4'],[52,'#92eefa'],[66,'#c4f8fc'],[74,'#8adaea']]);
    rect(F,4,66,54,1,'#ffffff');
    plus(F,9,60,WH);plus(F,52,8,WH);plus(F,8,24,'#d8fcff');
    // Monitor
    rect(S,6,9,51,38,'#7a86a8'); rect(S,6,9,51,1,'#c8d2ec'); rect(S,6,9,1,38,'#c8d2ec'); rect(S,56,9,1,38,'#4a5678'); rect(S,6,46,51,1,'#4a5678');
    rect(S,9,12,45,32,'#0c2a28');
    // Titelleiste
    rect(S,9,12,45,5,'#2c6a68'); disc(S,12,14,1,'#ff6a5a'); disc(S,16,14,1,'#ffd04a'); disc(S,20,14,1,'#5aff8a'); rect(S,44,13,8,3,'#1c4a48');
    // Raster
    for(let x=14;x<54;x+=8) rect(S,x,18,1,26,'#14463c');
    for(let y=22;y<44;y+=7) rect(S,9,y,45,1,'#14463c');
    // glatte Welle
    let py=null;
    for(let x=10;x<=53;x++){ const y=Math.round(30+6*Math.sin((x-10)/44*Math.PI*4)); rect(S,x,y,1,2,'#3cff8a'); if(py!==null){ const a=Math.min(py,y), b=Math.max(py,y); for(let k=a;k<=b+1;k++) put(S,x,k,'#3cff8a'); } py=y; }
    for(let x=10;x<=53;x++){ const y=Math.round(30+6*Math.sin((x-10)/44*Math.PI*4)); put(S,x,y,'#d8ffe8'); }
    // Fuss
    rect(S,27,47,9,5,'#5a6688'); rect(S,27,47,1,5,'#9aa6c4'); rect(S,20,52,23,3,'#7a86a8'); rect(S,20,52,23,1,'#c8d2ec');
    // Schild
    const cx=36, top=44, bot=77;
    const hw=y=>{ const t=(y-top)/(bot-top); if(t<0.5) return 15; const u=(t-0.5)/0.5; return Math.max(0,Math.round(15*Math.sqrt(1-u*u*0.98))); };
    for(let y=top;y<=bot;y++){ const h=hw(y); if(h>0) rect(S,cx-h,y,2*h,1,'#cfd8ee'); }
    for(let y=top;y<=bot;y++){ const h=hw(y); if(h>0) { rect(S,cx-h,y,2,1,WH); rect(S,cx+h-2,y,2,1,'#7a88ae'); } }
    for(let y=top;y<=top+1;y++) rect(S,cx-15,y,30,1,WH);
    for(let y=top+2;y<=bot-2;y++){ const h=hw(y)-3; if(h>0){ rect(S,cx-h,y,h,1,'#3a82f4'); rect(S,cx,y,h,1,'#1e4ec0'); } }
    rect(S,cx-12,top+3,24,2,'#6aa8ff'); rect(S,cx-12,top+3,12,2,'#78b4ff');
    // Stern
    star5(S,cx-1,top+15,8,'#e8eefc'); star5(S,cx-1,top+16,6,'#aab8dc');
    star5(S,cx-1,top+15,6,'#ffffff');
    // Ruckel-Signal (zackig, rot) prallt ab
    const zz=[[5,52],[8,57],[11,51],[14,59],[17,53],[20,58]];
    for(let i=0;i<zz.length-1;i++) line(S,zz[i][0],zz[i][1],zz[i+1][0],zz[i+1][1],'#ff4a3a',0);
    for(let i=0;i<zz.length-1;i++) line(S,zz[i][0],zz[i][1]+1,zz[i+1][0],zz[i+1][1]+1,'#c01c2c',0);
    outline(S,OL);
    // Funken
    const sp=(x,y,c)=>{ plus(S,x,y,c); };
    plus(S,23,52,'#ffe84a',1); plus(S,19,46,'#ffe84a'); plus(S,20,64,'#ffe84a'); put(S,22,48,'#ffe84a'); put(S,25,56,'#ffffff'); put(S,21,62,'#ffe84a'); put(S,18,47,'#ff8a3a'); put(S,22,56,'#ffffff');
    shine(S,10,10); shine(S,25,53+3);
  }

  // ---------- 2. Sechs Gigabyte ----------
  function sechs_gigabyte(F,S){
    bands(F,4,4,57,78,[[4,'#2a1a78'],[18,'#3a24a0'],[34,'#5230c4'],[52,'#6e3cd8'],[66,'#8a4cee']]);
    ell(F,31,41,26,26,'#4a2cb4'); ell(F,31,41,20,20,'#5c38cc');
    plus(F,9,10,'#d8c8ff',1);plus(F,52,70,'#d8c8ff',1);plus(F,53,12,'#b8a0ff');plus(F,9,72,'#b8a0ff');plus(F,8,40,'#b8a0ff');
    const X=5,Y=21,Wd=52;
    // Platine
    rect(S,X,Y,Wd,16,'#14683a'); rect(S,X,Y,Wd,1,'#2cc468'); rect(S,X,Y+15,Wd,1,'#0c4a2a');
    for(let i=0;i<14;i++) rect(S,X+2+i*3+(i%3),Y+13,1,1,'#7ae8a0');
    // 6 Speicherchips
    for(let i=0;i<6;i++){ const x=X+3+i*8; rect(S,x,Y+3,7,7,'#14161c'); rect(S,x,Y+3,7,1,'#4a5068'); rect(S,x,Y+3,1,7,'#4a5068'); put(S,x+1,Y+4,WH); put(S,x+2,Y+4,'#aab4d8'); put(S,x+1,Y+5,'#aab4d8'); rect(S,x,Y+10,7,1,'#0a0c10'); }
    // Kuehlkoerper (Lamellen)
    rect(S,X,Y+16,Wd,5,'#8a96b4'); for(let x=X+1;x<X+Wd-1;x+=3){ rect(S,x,Y+16,2,5,'#c8d2ec'); rect(S,x+2,Y+16,1,5,'#4a5678'); }
    // Huelle
    rect(S,X,Y+21,Wd,28,'#2a2e44'); rect(S,X,Y+21,Wd,2,'#5a6488'); rect(S,X,Y+47,Wd,2,'#161a2c'); rect(S,X,Y+21,2,28,'#4a5478');
    // Luefter
    const fan=(cx,cy)=>{
      disc(S,cx,cy,11,'#12162a'); disc(S,cx,cy,10,'#0a0c18');
      for(let k=0;k<7;k++){ const a=k*Math.PI*2/7+0.4; const bx=cx+Math.cos(a)*9, by=cy+Math.sin(a)*9;
        const a2=a+0.7, cx2=cx+Math.cos(a2)*7, cy2=cy+Math.sin(a2)*7;
        poly(S,[[cx+0.5,cy+0.5],[bx+0.5,by+0.5],[cx2+0.5,cy2+0.5]],k%2?'#9aa8d0':'#6e7ca8'); }
      disc(S,cx,cy,3,'#c8d2ec'); disc(S,cx,cy,2,'#e8f0ff'); put(S,cx,cy,'#5a6488');
      for(let a=0;a<360;a+=45){ put(S,cx+Math.cos(a*Math.PI/180)*11,cy+Math.sin(a*Math.PI/180)*11,'#7a86b0'); }
    };
    fan(17,Y+35); fan(43,Y+35);
    // goldene Anschluesse
    rect(S,X+2,Y+49,Wd-4,6,'#3a2a12');
    for(let x=X+3;x<X+Wd-3;x+=3){ if(x>=X+20&&x<=X+22) continue; rect(S,x,Y+49,2,5,'#ffd23a'); put(S,x,Y+49,'#fff4a8'); rect(S,x,Y+53,2,1,'#c08a10'); }
    // Slotblech links
    rect(S,X-1,Y+10,3,38,'#c8d2ec'); rect(S,X-1,Y+10,1,38,WH);
    outline(S,OL);
    shine(S,X+3+8*5+0,Y+3+0); shine(S,20,Y+22);
  }

  // ---------- 3. Schlafzimmer-Server ----------
  function schlafzimmer_server(F,S){
    bands(F,4,4,57,78,[[4,'#18204c'],[24,'#222c64'],[44,'#2e3a7c'],[64,'#6a4a2e'],[70,'#54381e']]);
    rect(F,4,64,54,1,'#8a6440');
    // Fenster mit Nachthimmel
    rect(F,10,8,26,30,'#c0c8e8'); rect(F,12,10,22,26,'#0a0e34'); rect(F,22,10,2,26,'#c0c8e8'); rect(F,12,21,22,2,'#c0c8e8');
    rect(F,10,38,26,2,'#8a94c0');
    disc(F,17,17,5,'#ffe880'); disc(F,19,15,4,'#0a0e34');
    plus(F,28,14,WH); put(F,16,29,WH); put(F,29,28,'#fff0a0'); put(F,13,26,'#fff0a0');plus(F,29,31,WH);put(F,19,28,WH);
    // Bett
    rect(S,6,48,5,22,'#8a5a2c'); rect(S,6,48,5,2,'#c08848'); rect(S,6,48,1,22,'#c08848'); rect(S,10,48,1,22,'#5a3818');
    rect(S,6,62,33,9,'#8a5a2c'); rect(S,6,62,33,1,'#c08848');
    rect(S,10,53,29,10,'#e8ecf8'); rect(S,10,53,29,1,WH);
    // Kissen
    ell(S,16,52,5,3,'#ffffff'); rect(S,12,53,9,1,'#c4cce4'); put(S,13,50,WH);
    // Decke
    rect(S,16,54,23,10,'#3a8cf0'); rect(S,16,54,23,2,'#78b8ff'); rect(S,16,62,23,2,'#2058b8');
    rect(S,16,57,1,6,'#2058b8'); rect(S,26,56,1,6,'#2c6ad0'); rect(S,32,56,1,6,'#2c6ad0');
    rect(S,16,59,23,2,'#ffd040'); rect(S,16,59,23,1,'#ffe888');
    // Beine
    rect(S,6,70,3,5,'#5a3818'); rect(S,36,70,3,5,'#5a3818');
    // Server
    rect(S,42,34,15,38,'#3a4466'); rect(S,42,34,15,1,'#7a88b8'); rect(S,42,34,1,38,'#7a88b8'); rect(S,56,34,1,38,'#222a46');
    rect(S,44,36,11,34,'#1c2238');
    const led=['#3cff78','#ff5a4a','#ffc83a'];
    for(let i=0;i<4;i++){ const y=37+i*6; rect(S,44,y,11,5,'#4c587e'); rect(S,44,y,11,1,'#8a98c8'); rect(S,45,y+2,5,1,'#1c2238'); rect(S,45,y+3,5,1,'#1c2238'); rect(S,51,y+2,2,2,led[(i)%3]); put(S,51,y+2,WH); rect(S,54,y+2,1,2,i%2?'#3cff78':'#1c2238'); }
    rect(S,44,61,11,6,'#252c48'); for(let y=62;y<67;y+=2) rect(S,45,y,9,1,'#4c587e');
    rect(S,43,70,3,3,'#222a46'); rect(S,53,70,3,3,'#222a46');
    outline(S,OL);
    // LED-Schein
    put(S,56,40,'#3cff78'); put(S,40,41,'#3cff78'); put(S,41,47,'#ff5a4a'); 
    shine(S,8,49);
  }

  // ---------- 4. Lampenwechsel ----------
  function lampenwechsel(F,S){
    bands(F,4,4,57,78,[[4,'#3a1830'],[24,'#4a2038'],[48,'#5a2a40'],[68,'#2a1426'],[74,'#1c0e1a']]);
    poly(F,[[31,26],[4,68],[58,68]],'#8a4a5a'); poly(F,[[31,26],[12,68],[50,68]],'#b86c68'); poly(F,[[31,26],[20,68],[42,68]],'#e8a470');
    rect(F,4,68,54,1,'#6a3a4a');
    ell(F,31,69,22,2,'#ffd890');
    const ray=(a,r0,r1,c)=>{ line(F,31+Math.cos(a)*r0,21+Math.sin(a)*r0,31+Math.cos(a)*r1,21+Math.sin(a)*r1,c,0); };
    for(let k=0;k<12;k++){ const a=k*Math.PI/6; ray(a,17,k%2?21:25,'#ffe85a'); }
    const T=new Array(62*83).fill(null);
    // Glaskolben
    sell(T,31,24,13,13,['#fff2a8','#ffffff','#ffc83a'],[0.5,-0.2]);
    poly(T,[[21,32],[41,32],[38,42],[24,42]],'#ffd860'); rect(T,24,38,14,4,'#ffc83a');
    ell(T,31,34,9,4,'#ffe27a');
    // Gluehwendel
    rect(T,26,22,1,16,'#7a7a92'); rect(T,36,22,1,16,'#7a7a92'); rect(T,28,34,1,4,'#7a7a92'); rect(T,34,34,1,4,'#7a7a92');
    for(let i=0;i<9;i++){ const x=27+i; rect(T,x,(i%2)?18:21,1,3,'#ff6a1a'); put(T,x,(i%2)?18:21,'#fff0b0'); }
    rect(T,27,21,9,1,'#ff9a2a'); rect(T,26,22,1,1,'#ff6a1a');
    // Fassung / Gewinde
    rect(T,24,42,14,3,'#6a748e'); rect(T,24,42,14,1,'#aab4d0');
    for(let i=0;i<4;i++){ rect(T,23,45+i*3,16,3,i%2?'#8a94b0':'#c8d2ec'); rect(T,23,45+i*3,16,1,WH); rect(T,23,47+i*3,16,1,'#5a6488'); }
    rect(T,25,57,12,2,'#4a5678'); rect(T,27,59,8,2,'#222840');
    for(let y=0;y<83;y++) for(let x=0;x<62;x++){ const c=T[y*62+x]; if(c&&y>=4) S[(y-3)*62+x]=c; }
    // Trittleiter (klein, darunter)
    const lg='#9aa8d0',lgl='#e0e8ff',lgd='#5a6890';
    poly(S,[[17,77],[20,77],[26,66],[23,66]],lg); poly(S,[[44,77],[41,77],[38,66],[41,66]],lg);
    rect(S,22,64,18,3,lgl); rect(S,22,66,18,1,lgd);
    rect(S,19,71,24,2,lgl); rect(S,19,73,24,1,lgd);
    rect(S,16,76,5,2,lgd); rect(S,41,76,5,2,lgd);
    outline(S,OL);
    shine(S,22,11); put(S,24,15,WH);
  }

  // ---------- 5. Tropfender Rohling ----------
  function tropfender_rohling(F,S){
    bands(F,4,4,57,78,[[4,'#5a7a2c'],[20,'#6c8e34'],[40,'#82a43e'],[62,'#4a4a52'],[72,'#34343c']]);
    rect(F,4,62,54,1,'#7a7a88');
    rect(F,8,10,16,2,'#3a5220'); rect(F,8,26,16,2,'#3a5220');
    const FL='#5a6488';
    rect(S,7,10,6,60,'#3c4668'); rect(S,7,10,2,60,FL); rect(S,12,10,1,60,'#1c2238');
    rect(S,49,10,6,60,'#3c4668'); rect(S,49,10,2,60,FL); rect(S,54,10,1,60,'#1c2238');
    rect(S,7,10,48,4,'#3c4668'); rect(S,7,10,48,1,FL);
    rect(S,5,68,52,9,'#2a3048'); rect(S,5,68,52,2,'#5a6488'); rect(S,5,75,52,2,'#161a2c');
    rect(S,13,64,36,4,'#9aa8c8'); rect(S,13,64,36,1,'#e0e8ff'); rect(S,13,67,36,1,'#5a6488');
    // Portalbalken
    rect(S,13,17,36,4,'#7a86a8'); rect(S,13,17,36,1,'#c8d2ec'); rect(S,13,20,36,1,'#4a5678');
    // Druckkopf
    rect(S,22,21,12,9,'#2a3048'); rect(S,22,21,12,1,'#5a6488'); rect(S,22,21,1,9,'#5a6488');
    rect(S,24,23,8,4,'#ff8a1a'); rect(S,24,23,8,1,'#ffc060'); rect(S,26,26,4,1,'#c05a0a');
    poly(S,[[24,30],[32,30],[29,35],[27,35]],'#d8a838'); rect(S,24,30,8,1,'#f8d868'); rect(S,27,35,2,1,'#8a6410');
    // Werkstueck: Schichten, leicht schief, oben unfertig
    const cols=['#38c8f0','#2aa8d8'];
    const sh=[0,0,0,1,1,2,2,3,3];
    for(let i=0;i<9;i++){ const x=13+sh[i], w=i>=7?9:13; rect(S,x,63-i*2-1,w,2,cols[i%2]); rect(S,x,63-i*2-2,w,1,'#8ae8ff'); rect(S,x+w-1,63-i*2-1,1,2,'#1a78a8'); }
    rect(S,17,43,4,1,'#8ae8ff');
    // Tropfen
    const O='#ff8a1a',OL2='#ffc060',OD='#c05a0a';
    rect(S,28,36,2,1,O); rect(S,27,37,4,2,O); rect(S,26,39,6,3,O); rect(S,27,42,4,1,O); rect(S,28,43,2,1,OD);
    put(S,27,38,OL2); put(S,27,39,OL2); put(S,26,40,OL2); rect(S,30,40,2,2,OD);
    // Spaghetti-Schlinge vom Werkstueck zum Knaeuel auf der Platte
    const pts=[[22,47],[28,50],[36,47],[43,50],[41,57],[33,60],[37,53],[46,55],[47,61],[39,63],[32,62],[40,58],[44,62]];
    for(let i=0;i<pts.length-1;i++){ line(S,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],O,0); line(S,pts[i][0],pts[i][1]+1,pts[i+1][0],pts[i+1][1]+1,OD,0); }
    for(let i=0;i<pts.length-1;i+=3) put(S,pts[i][0],pts[i][1]-1,OL2);
    outline(S,OL);
    shine(S,23,22);
  }

  window.JOKER_EXTRA=window.JOKER_EXTRA||{}; Object.assign(window.JOKER_EXTRA,{ruckelschutz,sechs_gigabyte,schlafzimmer_server,lampenwechsel,tropfender_rohling});
})();
