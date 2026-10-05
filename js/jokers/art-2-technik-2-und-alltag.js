/* Joker-Motive (technik-2-und-alltag). Jede Funktion malt ein Motiv in 62x83-Karten (F = Hintergrund, S = Vordergrund). */
(function(){ const {put,rect,disc,ell,sell,line,poly,outline,shine,bands,star5,plus,OL,WH}=window.JK;
  const mask=(L,rows,x0,y0,pal)=>{ rows.forEach((r,j)=>{ for(let i=0;i<r.length;i++){ const ch=r[i]; if(ch!=='.'&&pal[ch]) put(L,x0+i,y0+j,pal[ch]); } }); };
  const HEART=['.aa.aa.','abbabaa','abbbbba','.abbba.','..aba..','...a...'];
  function heart(L,x,y,c,l,d){ mask(L,['.dd.dd.','dccdccd','dcccccd','.dcccd.','..ddd..'],x,y,{d:d,c:c}); put(L,x+1,y+1,l); }

  // ---------------- 1. Reaktorkuehler ----------------
  function reaktorkuehler(F,S){
    bands(F,4,4,57,78,[[4,'#0c1630'],[18,'#122448'],[34,'#1a3562'],[52,'#3a2a48'],[62,'#7a3418'],[70,'#c8541a']]);
    // Gehaeuse-Innenraster (Lueftungsschlitze)
    for(let i=0;i<4;i++){ rect(F,5,8+i*3,3,1,'#2c4a80'); rect(F,54,8+i*3,3,1,'#2c4a80'); }
    plus(F,10,30,'#5a86c8'); plus(F,52,22,'#5a86c8'); plus(F,52,46,'#3a5a9a');
    // Hauptplatine
    rect(S,4,70,54,9,'#1c6a48'); rect(S,4,70,54,1,'#38b878'); rect(S,4,73,54,1,'#144c36');
    rect(S,8,75,4,2,'#d8b840'); rect(S,14,75,4,2,'#d8b840'); rect(S,44,75,4,2,'#d8b840'); rect(S,50,75,4,2,'#d8b840');
    // gluehender Prozessor
    rect(S,11,66,40,5,'#ff7a1c'); rect(S,11,66,40,1,'#ffd25a'); rect(S,11,70,40,1,'#b8340c'); rect(S,13,68,36,1,'#ffb040');
    rect(S,7,67,4,3,'#e8561a'); rect(S,51,67,4,3,'#e8561a');
    // Bodenplatte Kupfer
    rect(S,13,61,36,5,'#d88a4c'); rect(S,13,61,36,1,'#ffd09a'); rect(S,13,65,36,1,'#8a4a24');
    // Heatpipes: Kupferrohre ragen oben aus dem Turm, Fuesse unten an der Bodenplatte
    [18,25,35,42].forEach(x=>{
      rect(S,x,20,4,41,'#d88a4c'); rect(S,x,20,1,41,'#ffd09a'); rect(S,x+3,20,1,41,'#8a4a24');
      rect(S,x,19,4,2,'#ffd09a'); rect(S,x+3,19,1,2,'#8a4a24'); });
    // Lamellenblock mit Luecken
    for(let y=30;y<60;y+=3){ rect(S,14,y,34,2,'#c8d6ee'); rect(S,14,y,34,1,'#f4f8ff'); rect(S,14,y+2,34,1,'#3a4a78'); }
    rect(S,14,30,1,30,'#f4f8ff'); rect(S,47,30,1,30,'#5a6e9a');
    rect(S,13,28,36,2,'#8a98c0'); rect(S,13,28,36,1,WH);
    // Luefter vorne
    rect(S,19,33,24,24,'#2c3a60'); rect(S,19,33,24,1,'#7a92d0'); rect(S,19,33,1,24,'#7a92d0'); rect(S,42,33,1,24,'#161e3a'); rect(S,19,56,24,1,'#161e3a');
    disc(S,31,45,10.5,'#101830');
    poly(S,[[31,45],[27,35],[36,35]],'#7ad2ff'); poly(S,[[31,45],[41,41],[41,50]],'#4aa8e8');
    poly(S,[[31,45],[35,55],[26,55]],'#7ad2ff'); poly(S,[[31,45],[21,49],[21,40]],'#4aa8e8');
    disc(S,31,45,2.5,'#e8f4ff'); put(S,31,45,'#4aa8e8');
    [[21,34],[40,34],[21,55],[40,55]].forEach(p=>put(S,p[0],p[1],'#b8c8f0'));
    // Frost-Dampf: Strom ueber den Rohrenden, fliesst seitlich herab
    const FR='#e6f6ff',FB='#a6dcff',FD='#6ab4f0';
    ell(S,22,15,6,3,FR); ell(S,34,13,7,3,FR); ell(S,44,16,5,3,FB); ell(S,12,19,5,3,FB); ell(S,52,21,4,3,FR);
    ell(S,10,27,4,4,FR); ell(S,8,35,3,4,FB); ell(S,7,43,2,3,FR);
    ell(S,53,29,4,4,FB); ell(S,55,37,3,4,FR); ell(S,55,45,2,3,FB);
    rect(S,18,17,28,2,FB); rect(S,18,18,28,1,FD);
    plus(F,30,9,'#a6dcff',1); plus(F,44,8,'#e6f6ff'); plus(F,9,13,'#a6dcff');
    outline(S,OL);
    shine(S,15,31); shine(S,13,62); shine(S,20,12); put(S,36,11,WH);
  }

  // ---------------- 2. Rosa Theme ----------------
  function rosa_theme(F,S){
    bands(F,4,4,57,78,[[4,'#b890f0'],[20,'#cfa4f6'],[40,'#e6b8f8'],[58,'#f8b4e0'],[70,'#ff8cc8']]);
    heart(F,6,6,'#ff5eb0','#ffc4e4','#a0286e'); heart(F,21,54,'#ff5eb0','#ffc4e4','#a0286e'); heart(F,47,6,'#ff5eb0','#ffc4e4','#a0286e');
    star5(F,52,52,3,'#fff2a0'); star5(F,10,48,3,'#fff2a0'); plus(F,54,12,WH); plus(F,30,8,'#fff0fa'); plus(F,16,52,'#fff0fa');
    // Fenster
    rect(S,10,14,42,34,'#f6e4fa'); rect(S,10,14,42,7,'#ff5eb0'); rect(S,10,14,42,1,'#ffa6d6'); rect(S,10,20,42,1,'#b02878');
    disc(S,15,17,1.6,'#fff2a0'); disc(S,21,17,1.6,'#a8f0c8'); disc(S,27,17,1.6,WH);
    rect(S,41,16,8,3,'#fff0fa'); rect(S,42,17,6,1,'#ff5eb0');
    rect(S,12,23,9,23,'#d8b4f4'); rect(S,12,23,9,1,'#ecd0fc'); rect(S,12,29,9,2,'#b078e8'); rect(S,12,34,9,2,'#b078e8'); rect(S,12,39,9,2,'#b078e8');
    rect(S,24,23,26,5,'#ff8cc8'); rect(S,24,23,26,1,'#ffc4e4');
    rect(S,24,30,26,2,'#c090f0'); rect(S,24,34,20,2,'#c090f0'); rect(S,24,38,23,2,'#c090f0'); rect(S,24,42,12,2,'#c090f0');
    rect(S,10,47,42,1,'#b078e8');
    // Farbeimer (rechts unten): Henkel, flieder Eimer, rosa Farbe laeuft ueber
    line(S,31,60,35,50,'#9aa6c4'); line(S,35,50,51,50,'#9aa6c4'); line(S,51,50,55,60,'#9aa6c4');
    poly(S,[[31,60],[55,60],[52,77],[34,77]],'#8a5ad8'); rect(S,33,61,2,15,'#b890f8'); rect(S,50,61,3,16,'#5a2ea8');
    ell(S,43,60,12,3,'#c8a4f8'); ell(S,43,59,10,2,'#ff5eb0'); rect(S,36,58,8,1,'#ffb0dc');
    rect(S,34,60,4,10,'#ff5eb0'); ell(S,36,70,2,2,'#ff5eb0'); rect(S,34,60,1,9,'#ffb0dc');
    rect(S,46,60,3,6,'#ff5eb0'); ell(S,47,66,2,2,'#ff5eb0'); rect(S,46,60,1,5,'#ffb0dc');
    rect(S,39,68,8,1,'#5a2ea8');
    // Pinsel (links unten)
    line(S,6,56,16,66,'#e8a84c',1); line(S,6,55,15,64,'#ffe08a');
    line(S,17,67,20,70,'#c8c8e0',2); line(S,16,66,19,69,'#f4f6fa');
    line(S,21,71,24,74,'#ff3c9c',2); put(S,24,75,'#ff3c9c'); put(S,22,70,'#ffa6d6'); put(S,21,71,'#ffa6d6');
    outline(S,OL);
    shine(S,12,15); shine(S,34,60); put(S,55,59,WH); put(S,16,67,WH);
  }

  // ---------------- 3. Denoising-Regler ----------------
  function denoising_regler(F,S){
    bands(F,4,4,57,78,[[4,'#0e5a64'],[22,'#14707a'],[44,'#1a8a90'],[64,'#0c4a54']]);
    plus(F,48,10,'#7ae8e0'); plus(F,10,10,'#7ae8e0'); plus(F,52,70,'#7ae8e0'); rect(F,4,64,54,1,'#2ab0a8');
    // Mischpult-Block
    rect(S,5,18,19,56,'#3c4260'); rect(S,5,18,19,2,'#7a86b4'); rect(S,5,18,1,56,'#6a78a8'); rect(S,23,18,1,56,'#222640'); rect(S,5,73,19,1,'#222640');
    const kn=[28,50,22]; // Knopfhoehen: Regler 3 ganz oben
    kn[0]=44; kn[1]=58; kn[2]=22;
    [9,14,19].forEach((x,i)=>{
      rect(S,x,22,3,48,'#12162a'); rect(S,x+1,22,1,48,'#080a16');
      for(let y=24;y<70;y+=6) rect(S,x-2,y,1,1,'#9aa6c8');
      const ky=kn[i]; rect(S,x-2,ky,7,6,['#ff5a4a','#ffd23a','#5ae85a'][i]); rect(S,x-2,ky,7,1,WH); rect(S,x-2,ky+5,7,1,'#6a1e18'); rect(S,x+1,ky+1,1,4,'#3a1010');
    });
    rect(S,10,22,1,1,WH);
    // Bild-Vorschau-Fenster
    const X0=27,Y0=26,PW=30,PH=42;
    rect(S,X0-1,Y0-6,PW+2,PH+7,'#e8ecf8'); rect(S,X0-1,Y0-6,PW+2,6,'#4a58a0'); rect(S,X0-1,Y0-6,PW+2,1,'#8a98e0');
    disc(S,X0+3,Y0-3,1.3,'#ff6a5a'); disc(S,X0+8,Y0-3,1.3,'#ffd23a');
    // scharfe Szene
    const scene=(L)=>{
      rect(L,X0,Y0,PW,PH,'#7cc8f8'); rect(L,X0,Y0+8,PW,8,'#a4daf8'); rect(L,X0,Y0+16,PW,6,'#cceafc');
      disc(L,X0+23,Y0+8,4,'#ffe23a');
      poly(L,[[X0,Y0+26],[X0+8,Y0+12],[X0+18,Y0+26]],'#6a78a8'); poly(L,[[X0+8,Y0+12],[X0+12,Y0+18],[X0+8,Y0+20],[X0+5,Y0+18]],'#ffffff');
      poly(L,[[X0+10,Y0+26],[X0+22,Y0+8],[X0+PW,Y0+22],[X0+PW,Y0+26]],'#4a5890'); poly(L,[[X0+22,Y0+8],[X0+26,Y0+14],[X0+22,Y0+15],[X0+18,Y0+13]],'#ffffff');
      rect(L,X0,Y0+26,PW,PH-26,'#3cb85a'); rect(L,X0,Y0+26,PW,1,'#78e88a'); rect(L,X0,Y0+32,PW,PH-32,'#26904a');
      poly(L,[[X0+6,Y0+34],[X0+9,Y0+24],[X0+12,Y0+34]],'#1a6a38'); poly(L,[[X0+20,Y0+36],[X0+23,Y0+25],[X0+26,Y0+36]],'#1a6a38');
    };
    const T=new Array(S.length).fill(null); scene(T);
    for(let y=0;y<PH;y++)for(let x=0;x<PW;x++){
      const right=x>=17;
      let c;
      if(right) c=T[(Y0+y)*62+X0+x]; else { const bx=Math.floor(x/5)*5+2, by=Math.floor(y/5)*5+2; c=T[(Y0+Math.min(by,PH-1))*62+X0+Math.min(bx,PW-1)]; }
      put(S,X0+x,Y0+y,c);
    }
    // Block-Raster-Kanten der linken Haelfte (klare Block-Anmutung)
    // Trennlinie
    rect(S,X0+15,Y0,2,PH,'#ffffff');
    outline(S,OL);
    shine(S,7,20);
  }

  // ---------------- 4. Zwei-Naechte-Regel ----------------
  function zwei_naechte_regel(F,S){
    bands(F,4,4,57,78,[[4,'#0a1038'],[20,'#141c52'],[36,'#1e2c72'],[50,'#2c3c88'],[60,'#3a2a3c'],[66,'#241c2c']]);
    [[8,30],[20,36],[30,24],[44,34],[54,44],[12,44],[36,44],[50,24]].forEach(p=>put(F,p[0],p[1],'#d8e6ff'));
    plus(F,28,18,WH); plus(F,46,16,'#fff2b8',1); plus(F,10,22,'#fff2b8'); plus(F,52,32,WH);
    // zwei Mondsicheln
    const moon=(cx,cy,r)=>{ disc(F,cx,cy,r,'#ffe88a'); disc(F,cx+r*0.55,cy-r*0.2,r*0.85,F[(cy)*62+cx+r+2]||'#1e2c72'); };
    disc(F,14,12,6,'#ffe88a'); disc(F,17,10,5.4,'#0a1038'); disc(F,13,12,3,'#fff6c8'); disc(F,17,10,5.4,'#0a1038');
    disc(F,28,12,6,'#ffe88a'); disc(F,31,10,5.4,'#0a1038'); disc(F,27,12,3,'#fff6c8'); disc(F,31,10,5.4,'#0a1038');
    rect(F,11,9,1,1,WH); rect(F,25,9,1,1,WH);
    // Berge hinten
    poly(F,[[4,60],[4,50],[12,40],[20,52],[30,36],[42,54],[50,44],[57,52],[57,60]],'#2a3a82');
    poly(F,[[30,36],[34,43],[30,42],[27,44]],'#c8d8ff');
    poly(F,[[4,66],[4,56],[14,50],[26,60],[38,52],[48,58],[57,50],[57,66]],'#1a2258');
    rect(F,4,66,54,13,'#1c2a30'); rect(F,4,66,54,1,'#2c4a40');
    // Zelt
    poly(S,[[8,72],[30,32],[52,72]],'#e8761c'); 
    poly(S,[[30,32],[52,72],[34,72]],'#b8481a'); poly(S,[[30,32],[8,72],[16,72]],'#ff9a38');
    rect(S,30,32,1,6,'#fff0b8'); 
    // Eingang offen
    poly(S,[[30,46],[38,72],[22,72]],'#2a1020'); poly(S,[[30,52],[34,72],[26,72]],'#ffb040');
    poly(S,[[30,46],[22,72],[18,72]],'#d86a1c'); poly(S,[[30,46],[38,72],[42,72]],'#8a3414');
    rect(S,8,72,44,2,'#3a2a24');
    line(S,8,72,4,76,'#d8c8a0'); line(S,52,72,57,76,'#d8c8a0');
    // Lagerfeuer
    rect(S,38,68,16,3,'#6a3a20'); line(S,38,76,54,70,'#8a4a24',1); line(S,38,70,54,76,'#6a3a20',1);
    poly(S,[[41,70],[44,56],[46,64],[49,52],[51,64],[54,70]],'#ff4a1a');
    poly(S,[[43,70],[46,60],[48,66],[50,58],[52,70]],'#ff9a1c'); poly(S,[[46,70],[48,64],[50,70]],'#ffe23a');
    outline(S,OL);
    shine(S,16,40); put(S,45,57,WH);
  }

  // ---------------- 5. Gelenkte Demokratie ----------------
  function gelenkte_demokratie(F,S){
    bands(F,4,4,57,78,[[4,'#4a1a58'],[24,'#5c2268'],[46,'#6c2a74'],[62,'#7a4a2a'],[66,'#5a3420'],[74,'#3a2214']]);
    for(let x=6;x<57;x+=10){ rect(F,x,4,3,58,'#5a2064'); rect(F,x,4,1,58,'#7a3a88'); }
    rect(F,4,62,54,1,'#a0703c');
    // Faeden (hinter Urne)
    const C='#fff0c0';
    line(F,11,18,19,50,C); line(F,22,18,24,50,C); line(F,40,18,38,50,C); line(F,51,18,43,50,C); line(F,31,18,31,48,C);
    // Kreuzstange (Holz)
    rect(S,6,15,50,4,'#b8783a'); rect(S,6,15,50,1,'#e8a864'); rect(S,6,18,50,1,'#6a3a1a');
    rect(S,29,13,4,19,'#a86a30'); rect(S,29,13,1,19,'#e8a864'); rect(S,32,13,1,19,'#6a3a1a');
    rect(S,10,18,3,1,'#6a3a1a');
    // Handschuh-Faust (oben) mit Stulpe, greift den Griff
    const GL=['#f4f6fa','#ffffff','#a9b6d4'];
    rect(S,25,4,12,3,'#3a4a8a'); rect(S,25,4,12,1,'#6a7ac8'); rect(S,25,6,12,1,'#1c2450');
    rect(S,24,7,14,7,GL[0]); rect(S,24,7,14,1,GL[1]); rect(S,24,13,14,1,GL[2]);
    [24,28,32,36].forEach((x,i)=>{ if(i) rect(S,x-1,9,1,5,'#7a86b4'); });
    rect(S,38,9,1,5,GL[2]); rect(S,23,9,1,4,GL[1]); put(S,22,10,GL[0]); put(S,22,11,GL[0]); put(S,23,13,GL[2]);
    rect(S,24,12,14,1,GL[0]);
    // Wahlurne
    const UX=15,UY=46,UW=32,UH=26;
    rect(S,UX,UY,UW,UH,'#2a7ae0'); rect(S,UX,UY,3,UH,'#5aa4f8'); rect(S,UX+UW-3,UY,3,UH,'#1a4a9c'); rect(S,UX,UY+UH-3,UW,3,'#1a4a9c');
    poly(S,[[UX-2,UY],[UX+UW+2,UY],[UX+UW-1,UY-5],[UX+1,UY-5]],'#6ab4ff'); rect(S,UX-2,UY,UW+4,2,'#1a5ac0');
    rect(S,UX+8,UY-4,16,2,'#0a1230');
    // Stimmzettel
    rect(S,UX+11,UY-10,10,8,'#ffffff'); rect(S,UX+11,UY-10,10,1,'#e0e8f8'); rect(S,UX+21,UY-9,1,7,'#a9b6d4');
    rect(S,UX+8,UY-4,16,1,'#0a1230'); rect(S,UX+11,UY-8,6,1,'#c8d0e8'); rect(S,UX+11,UY-6,8,1,'#c8d0e8');
    // Haekchen-Tafel
    rect(S,UX+8,UY+6,16,13,'#f4f6fa'); rect(S,UX+8,UY+6,16,1,WH); rect(S,UX+8,UY+18,16,1,'#a9b6d4'); rect(S,UX+23,UY+6,1,13,'#a9b6d4');
    line(S,UX+11,UY+12,UX+14,UY+16,'#1ea84a',0); line(S,UX+14,UY+16,UX+21,UY+8,'#1ea84a',0);
    line(S,UX+11,UY+13,UX+14,UY+17,'#1ea84a'); line(S,UX+14,UY+17,UX+21,UY+9,'#1ea84a');
    // Fadenoesen
    [[UX,UY-3],[UX+UW-1,UY-3],[UX+10,UY-5],[UX+22,UY-5]].forEach(p=>rect(S,p[0],p[1]-1,2,2,'#ffe08a'));
    // Schatten am Boden
    ell(F,31,76,18,2,'#241408');
    outline(S,OL);
    shine(S,UX+1,UY+3); shine(S,8,16); put(S,25,8,'#ffffff');
  }
  window.JOKER_EXTRA=window.JOKER_EXTRA||{}; Object.assign(window.JOKER_EXTRA,{reaktorkuehler,rosa_theme,denoising_regler,zwei_naechte_regel,gelenkte_demokratie});
})();
