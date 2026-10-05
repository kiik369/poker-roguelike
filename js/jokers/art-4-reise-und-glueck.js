/* Joker-Motive (reise-und-glueck). Jede Funktion malt ein Motiv in 62x83-Karten (F = Hintergrund, S = Vordergrund). */
(function(){ const {put,rect,disc,ell,sell,line,poly,outline,shine,bands,star5,plus,OL,WH}=window.JK;
  const W=62,H=83;
  const tmp=()=>new Array(W*H).fill(null);
  function merge(S,T){ for(let i=0;i<W*H;i++) if(T[i]) S[i]=T[i]; }

  // ================= MALTA =================
  function reiseziel_malta(F,S){
    bands(F,4,4,57,78,[[4,'#1e8ee0'],[12,'#3aa8ec'],[22,'#62c4f4'],[32,'#96dcfa'],[42,'#c4f0fc'],
      [52,'#14b4bc'],[58,'#22ccc8'],[65,'#18a4b4'],[72,'#1288a0']]);
    disc(F,14,16,7,'#ffd22a'); disc(F,14,16,5,'#ffe872'); disc(F,13,15,3,'#fff6b8');
    ell(F,36,12,6,2,WH); ell(F,32,13,4,2,WH); ell(F,39,10,3,2,WH); rect(F,30,15,14,1,'#d0eefc');
    [[6,56,6],[24,57,5],[8,63,7],[44,62,8],[6,70,8],[26,72,7],[44,71,8]].forEach(w=>rect(F,w[0],w[1],w[2],1,'#7ef0e4'));
    [[30,66,6],[12,59,3],[8,76,6]].forEach(w=>rect(F,w[0],w[1],w[2],1,'#0e7a98'));

    const dy=-8;
    const R=(x,y,w,h,c)=>rect(S,x,y+dy,w,h,c);
    const HN=['#eab668','#f8d894','#b97f3a'];
    // Festungsmauer hinten rechts
    R(30,40,27,18,'#d6a45a'); R(30,40,27,1,'#f0c882'); R(30,56,27,2,'#a8702c');
    for(let x=30;x<57;x+=6){ R(x,35,4,6,'#d6a45a'); R(x,35,4,1,'#f0c882'); R(x+3,36,1,5,'#b07a34'); }
    R(34,46,2,5,'#6a4418'); R(50,46,2,5,'#6a4418');
    for(let y=44;y<56;y+=4) R(30,y,27,1,'#c4924a');
    // Haus links
    R(5,28,24,30,HN[0]); R(5,28,3,30,HN[1]); R(26,28,3,30,HN[2]);
    R(5,25,24,3,HN[1]); R(5,25,24,1,'#fff0c4'); R(5,28,24,1,HN[2]);
    R(5,38,24,1,'#cf9a50'); R(5,48,24,1,'#cf9a50');
    const bal=(x,y,w,h,pal)=>{ y+=dy; rect(S,x,y,w,h,pal[0]); rect(S,x,y,w,2,pal[1]); rect(S,x,y+h-2,w,2,pal[2]);
      for(let i=x+2;i<x+w-1;i+=3) rect(S,i,y+3,1,h-6,pal[2]); rect(S,x-1,y+h,w+2,1,pal[2]); rect(S,x+1,y+h+1,w-2,1,pal[2]); };
    const GR=['#2aa05a','#6ae09a','#146a38'], BL=['#2a6ad8','#6aa8ff','#143e94'];
    bal(8,30,9,7,GR); bal(8,40,9,7,BL); bal(18,30,8,7,BL); bal(18,40,8,7,GR);
    R(9,50,7,8,'#7a4a1e'); R(10,48,5,2,'#7a4a1e'); R(9,50,1,8,'#a8682c'); R(12,51,1,7,'#5a3410');
    R(19,50,6,4,'#3a8ad8'); R(19,50,6,1,'#8ac8ff'); R(21,50,1,4,'#1e5aa8');
    // Haus mitte
    R(29,38,14,20,'#dca652'); R(29,38,2,20,'#f0c882'); R(41,38,2,20,'#a8702c');
    R(29,36,14,2,'#f0c882'); R(29,38,14,1,'#a8702c');
    bal(31,41,10,7,GR);
    R(32,51,8,4,'#a8702c'); R(33,51,2,4,'#3a8ad8'); R(37,51,2,4,'#3a8ad8');
    // Kai
    R(4,58,54,3,'#c08a44'); R(4,58,54,1,'#f0c882'); R(4,60,54,1,'#8c5a1e');
    for(let x=10;x<56;x+=9) R(x,59,1,2,'#8c5a1e');
    // Palme
    for(let y=52;y>=24;y--){ const t=(52-y)/28, cx=Math.round(50+Math.sin(t*2.4)*3.5); rect(S,cx,y,3,1,(y%4<2)?'#9a6a32':'#7a4e20'); put(S,cx,y,'#c4903e'); }
    const px=52,py=23;
    const frond=(dx,lift,droop)=>{ let ox=px,oy=py; for(let k=1;k<=12;k++){ const t=k/12, x=px+dx*t, y=py-lift*Math.sin(t*Math.PI*0.8)+droop*t*t;
      line(S,ox,oy-1,x,y-1,'#2cc050'); line(S,ox,oy,x,y,'#1f9a3e'); line(S,ox,oy+1,x,y+1,'#126a2a'); ox=x; oy=y; } };
    frond(-12,6,9); frond(-6,10,5); frond(2,11,3); frond(5,8,8); frond(-10,2,13);
    disc(S,52,26,1.6,'#6a4018'); disc(S,55,26,1.4,'#7a4a20');

    // Luzzu (gross, vorne)
    const T=tmp();
    poly(T,[[6,60],[9,67],[16,72],[42,72],[50,67],[54,59],[57,52],[53,52],[50,58],[44,61]],'#x');
    for(let y=50;y<=74;y++) for(let x=4;x<=58;x++) if(T[y*W+x]){
      put(S,x,y, y<=62?'#ffd62a': y<=65?'#e83030': y<=68?'#2a6ad8':'#1c8a4c'); }
    for(let x=6;x<=54;x++) if(T[60*W+x]) put(S,x,60,'#ffe888');
    line(S,6,60,44,61,'#a87a0c'); line(S,44,61,53,57,'#a87a0c');
    rect(S,55,50,2,4,'#e83030'); put(S,55,50,'#ff8a7a');
    ell(S,46,64,3.2,2,WH); rect(S,46,63,3,3,'#101830'); put(S,45,63,WH);
    // Schaum an der Wasserlinie
    outline(S,OL);
    shine(S,8,10); shine(S,6,21); shine(S,20,62);
  }

  // ================= GLUECKSKLEE =================
  function gluecksklee(F,S){
    // Strahlenbaender (radial), gruen
    const cx=31,cy=30;
    for(let y=4;y<=78;y++) for(let x=4;x<=57;x++){
      const a=Math.atan2(y-cy,x-cx)*180/Math.PI+360, k=Math.floor(a/18)%2;
      const d=Math.hypot(x-cx,y-cy);
      put(F,x,y,k?(d<30?'#58c860':'#3ea84c'):(d<30?'#7edc72':'#52bc58'));
    }
    // Wiese unten
    bands(F,4,60,57,78,[[60,'#2a9a3a'],[66,'#1e7e2e'],[72,'#166624']]);
    rect(F,4,59,54,1,'#6ae070');
    for(let x=5;x<57;x+=4){ const h=3+((x*7)%3); line(F,x,60,x-1,60-h,'#2a9a3a'); line(F,x+1,60,x+2,60-h+1,'#2a9a3a'); }
    plus(F,10,12,WH); plus(F,52,10,'#e8ffd8'); plus(F,50,24,WH);

    const GP=['#18a83c','#5ee070','#0a6a24'];
    const cx0=31,cy0=38;
    const leaf=(ang)=>{
      const T=tmp(); const ca=Math.cos(ang), sa=Math.sin(ang);
      const lcx=cx0+ca*10.5, lcy=cy0+sa*10.5;
      for(let y=10;y<64;y++) for(let x=10;x<54;x++){
        const dx=x+0.5-cx0-ca*2.2, dy=y+0.5-cy0-sa*2.2;
        // lokal: v = Richtung des Blatts, u = quer
        const v=dx*ca+dy*sa, u=-dx*sa+dy*ca;
        const inD=(Math.hypot(u-4.1,v-9.4)<=4.2)||(Math.hypot(u+4.1,v-9.4)<=4.2);
        const inT=v>=0&&v<=10&&Math.abs(u)<=v*0.82+0.4;
        if(!(inD||inT)) continue;
        const nx=(x+0.5-lcx)/7, ny=(y+0.5-lcy)/7;
        const l=-(nx*0.6+ny*0.8);
        let c=l>0.35?GP[1]:(l<-0.3?GP[2]:GP[0]);
        if(Math.abs(u)<0.8&&v>2&&v<9) c=GP[2];
        T[y*W+x]=c;
      }
      outline(T,'#0a4a1c'); merge(S,T);
    };
    // Stiel zuerst
    for(let y=cy0;y<=66;y++){ const x=Math.round(cx0+Math.sin((y-cy0)/9)*3.2); rect(S,x,y,2,1,'#0e8a30'); put(S,x,y,'#2cc450'); }
    leaf(-Math.PI/4); leaf(Math.PI/4); leaf(-3*Math.PI/4); leaf(3*Math.PI/4);
    disc(S,31,36,1.4,'#8cf09a');
    outline(S,OL);
    // Tautropfen (glaenzende Punkte)
    const dew=(x,y)=>{ rect(S,x,y,2,2,'#bff2ff'); put(S,x,y,WH); put(S,x+1,y+1,'#5ac8e8'); };
    dew(22,23); dew(38,46); dew(14,36); dew(45,33); dew(24,62); dew(42,64); dew(31,28);
    shine(S,28,23); shine(S,36,49);
  }

  // ================= GOLDENE MUENZE =================
  function goldene_muenze(F,S){
    const cx=31,cy=44;
    for(let y=4;y<=78;y++) for(let x=4;x<=57;x++){
      const a=Math.atan2(y-cy,x-cx)*180/Math.PI+360, k=Math.floor(a/15)%2;
      const d=Math.hypot(x-cx,y-cy);
      let c;
      if(d<14) c='#9a58e0'; else if(d<26) c=k?'#6a30b8':'#7a3cca'; else c=k?'#4a1e90':'#5a28a4';
      put(F,x,y,c);
    }
    bands(F,4,72,57,78,[[72,'#38146e'],[75,'#2a0e58']]);
    plus(F,9,14,'#f0d0ff'); plus(F,53,16,WH,true); plus(F,8,60,WH); plus(F,53,50,'#f0d0ff'); plus(F,14,28,WH);

    const G=['#f2b81c','#ffe66a','#a86a0c'];
    const starOn=(sx,sy,rx,ry,col)=>{ const pts=[]; for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?0.42:1; pts.push([sx+0.5+Math.cos(a)*r*rx,sy+0.5+Math.sin(a)*r*ry]);} poly(S,pts,col); };
    // stehende Muenze (hinten rechts)
    ell(S,48,52,7,14,'#a86a0c'); ell(S,45,52,7,14,G[0]); ell(S,45,52,5,11,G[2]); ell(S,45,52,4.2,10,G[0]);
    ell(S,44,52,3.5,9,G[1]); ell(S,45,53,3,8,G[0]);
    starOn(45,52,3.6,4.4,'#c88410');
    rect(S,39,45,1,4,WH);
    // Stapel: 3 Muenzen
    const coin=(cy,top)=>{
      for(let y=cy;y<=cy+6;y++){ ell(S,22,y,17,7,y>=cy+5?G[2]:'#d89812'); }
      for(let y=cy+1;y<=cy+5;y++) put(S,6,y,G[1]);
      ell(S,22,cy,17,7,G[0]); ell(S,22,cy,14,5.2,G[2]); ell(S,22,cy,13,4.4,G[0]);
      ell(S,20,cy-1,10,3,G[1]); ell(S,22,cy,12,4,G[0]);
      // Praegering-Kontrast
      rect(S,6,cy+3,34,1,'#d89812');
    };
    coin(66,0); coin(58,0); coin(50,1);
    // Stern-Praegung auf oberster Muenze
    starOn(22,51,9,4.2,'#8c5208'); starOn(22,50,8,3.6,'#fff0a0'); starOn(22,50,4.5,2,G[0]);
    outline(S,OL);
    shine(S,10,46); shine(S,34,49); shine(S,12,62); plus(S,40,60,WH); plus(S,25,41,WH); plus(S,50,40,WH);
  }

  // ================= SANDUHR =================
  function sanduhr(F,S){
    bands(F,4,4,57,78,[[4,'#2a1264'],[20,'#3c1c88'],[36,'#31509f'],[50,'#1e7aa8'],[62,'#1ca4b4'],[72,'#1486a0']]);
    ell(F,31,42,25,32,'#4a2aa4'); ell(F,31,42,20,26,'#5a3ac0'); ell(F,31,42,14,19,'#2a8ec4');
    star5(F,7,27,3.5,'#ffe66a'); star5(F,54,57,3.5,'#ffe66a'); 
    plus(F,53,22,WH); plus(F,8,56,'#9af0ec'); plus(F,54,40,'#9af0ec');

    const WD=['#a8642c','#e0985a','#6a3a14'];
    const cy=42, cxm=31;
    // Glas
    const hw=(y)=>{ const t=Math.abs(y-cy)/24.5; return 1.2+12.8*Math.sin(Math.min(t/0.92,1)*Math.PI/2); };
    // Pfosten (hinter dem Glas)
    rect(S,14,14,3,56,WD[0]); rect(S,14,14,1,56,WD[1]); rect(S,16,14,1,56,WD[2]);
    rect(S,46,14,3,56,WD[0]); rect(S,46,14,1,56,WD[1]); rect(S,48,14,1,56,WD[2]);
    for(let y=17;y<=67;y++){
      const h=Math.round(hw(y-0.5+ (y>cy?1:0)) );
      rect(S,cxm-h,y,2*h+1,1,'#b8ecf4');
      put(S,cxm-h,y,'#5ab0cc'); put(S,cxm+h,y,'#5ab0cc');
      put(S,cxm-h+1,y,WH);
      put(S,cxm+h-1,y,'#86cce0');
    }
    // oberer Sand (Oberflaeche leicht trichterfoermig)
    const SD=['#f0b838','#ffe27a','#b8780c'];
    for(let y=28;y<=41;y++){
      const h=Math.round(hw(y))-1; const dip=(y===28)?0:0;
      for(let x=cxm-h;x<=cxm+h;x++){ let c=SD[0]; if(x<cxm-h+2) c=SD[1]; else if(x>cxm+h-3) c=SD[2]; put(S,x,y,c); }
    }
    // Trichter oben (Mulde)
    for(let x=24;x<=38;x++){ const d=Math.abs(x-cxm); put(S,x,28+Math.floor(d/3.5)*0,SD[2]); }
    rect(S,cxm-1,29,3,1,SD[2]); rect(S,cxm-2,28,5,1,'#d89a20');
    // Sandstrahl
    rect(S,cxm,43,1,15,'#ffd24a'); put(S,cxm,43,WH);
    // unterer Haufen (symmetrisch)
    for(let y=57;y<=66;y++){
      const t=(y-57); const h=Math.min(Math.round(hw(y)-1),1+t*1.6|0);
      for(let x=cxm-h;x<=cxm+h;x++){ let c=SD[0]; if(x<=cxm-h+1) c=SD[1]; else if(x>=cxm+h-2) c=SD[2]; put(S,x,y,c); }
    }
    put(S,cxm,57,'#ffd24a');
    // Rahmen oben/unten
    const plate=(y)=>{ rect(S,11,y,41,6,WD[0]); rect(S,11,y,41,1,WD[1]); rect(S,11,y+1,41,1,WD[1]); rect(S,11,y+5,41,1,WD[2]); rect(S,11,y,1,6,WD[1]); rect(S,51,y,1,6,WD[2]);
      rect(S,15,y+3,3,1,WD[2]); rect(S,44,y+3,3,1,WD[2]); };
    plate(11); plate(68);
    rect(S,13,9,37,2,WD[1]); rect(S,13,9,37,1,'#f6c888'); rect(S,13,74,37,2,WD[2]);
    // Glasglanz
    rect(S,19,20,1,6,WH); put(S,19,27,WH); rect(S,22,56,1,3,WH);
    outline(S,OL);
    shine(S,36,20); shine(S,38,60);
  }

  window.JOKER_EXTRA=window.JOKER_EXTRA||{}; Object.assign(window.JOKER_EXTRA,{reiseziel_malta,gluecksklee,goldene_muenze,sanduhr});
})();
