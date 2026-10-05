/* Joker-Motive (spiel-und-zauber). Jede Funktion malt ein Motiv in 62x83-Karten (F = Hintergrund, S = Vordergrund). */
(function(){ const {put,rect,disc,ell,sell,line,poly,outline,shine,bands,star5,plus,OL,WH}=window.JK;

  // ================= 1. Kartenfaecher =================
  function kartenfaecher(F,S){
    bands(F,4,4,57,78,[[4,'#0d5a34'],[22,'#127a45'],[40,'#18955a'],[58,'#127a45'],[70,'#0d5a34']]);
    // goldene Streifen
    const G1='#f4c030',G2='#a86a0c';
    rect(F,4,12,54,2,G1); rect(F,4,14,54,1,G2);
    rect(F,4,70,54,2,G1); rect(F,4,72,54,1,G2);
    rect(F,8,4,2,75,G1); rect(F,10,4,1,75,G2);
    rect(F,52,4,2,75,G1); rect(F,51,4,1,75,G2);
    // Lichtschein hinter dem Faecher
    ell(F,31,48,20,20,'#1e9e60'); ell(F,31,50,14,14,'#2cb874');
    // gold. Rauten-Deko oben
    [[18,8],[31,8],[44,8]].forEach(p=>{ poly(F,[[p[0],p[1]-3],[p[0]+3,p[1]],[p[0],p[1]+3],[p[0]-3,p[1]]],G1); put(F,p[0],p[1],'#fff2a0'); });
    const PX=31, PY=75;
    function card(ang,hw,hl,tail,pal,round){
      const a=ang*Math.PI/180, sa=Math.sin(a), ca=Math.cos(a), cc=hl-14;
      for(let y=0;y<83;y++) for(let x=0;x<62;x++){
        const dx=x+0.5-PX, dy=y+0.5-PY;
        const al=dx*sa-dy*ca, ac=dx*ca+dy*sa;
        if(Math.abs(ac)>hw||al>hl||al<-tail) continue;
        // abgerundete Ecken
        const ex=hw-Math.abs(ac), ey=Math.min(hl-al,al+tail);
        if(ex<2.5&&ey<2.5){ const q=Math.hypot(2.5-ex,2.5-ey); if(q>2.5) continue; }
        const d=Math.min(ex,ey);
        let c;
        if(d<1) c='#2a1030';
        else if(d<2.4) c='#fdf6e6';
        else {
          const m=al-cc;
          const dd=round? Math.hypot(ac*1.0,m*0.9) : Math.abs(ac)*1.0+Math.abs(m)*0.8;
          if(dd<2.8) c='#ffd84a';
          else if(dd<4.2) c=pal[2];
          else if(dd<6.4) c=pal[0];
          else if(dd<7.6) c=pal[1];
          else c=pal[0];
        }
        put(S,x,y,c);
      }
    }
    const RED=['#d82840','#ff6a7c','#8a1230'], BLU=['#2a56d0','#78a4ff','#14307e'], PUR=['#7a36c8','#bc84f4','#44187e'], IVO=['#fff4dc','#ffffff','#e0a860'];
    card(-31,6.5,46,5,BLU,false);
    card(-15.5,6.5,46,5,RED,false);
    card(0,6.5,46,5,IVO,true);
    card(15.5,6.5,46,5,PUR,false);
    card(31,6.5,46,5,RED,false);
    // goldene Niete
    sell(S,PX,PY-3,4,4,['#f4c030','#fff2a0','#a86a0c']);
    outline(S,OL);
    shine(S,16,40); shine(S,41,32); shine(S,28,31);
  }

  // ================= 2. Wuerfel-Paar =================
  function wuerfel_paar(F,S){
    bands(F,4,4,57,78,[[4,'#c42034'],[18,'#b21a2c'],[34,'#a01626'],[50,'#b21a2c'],[64,'#c42034'],[72,'#8c1220']]);
    // goldene Linien (Tischrand) und Ring
    rect(F,4,76,54,2,'#f4c030'); rect(F,4,75,54,1,'#a86a0c');
    rect(F,4,5,54,2,'#f4c030'); rect(F,4,7,54,1,'#a86a0c');
    for(let y=0;y<83;y++) for(let x=0;x<62;x++){
      const nx=(x+0.5-31)/25, ny=(y+0.5-42)/30, q=nx*nx+ny*ny;
      if(q<1&&q>0.86) put(F,x,y,'#e0a828');
    }
    const FA='#ffffff', FL='#e4e8f2', FR='#a4aeca', EDGE='#8c96b6', PIP='#14121e';
    function die(V,E1,E2,E3,top,left,right){
      const add=(p,q,s,t)=>[p[0]+q[0]*s+t*0,p[1]+q[1]*s];
      const V1=[V[0]+E1[0],V[1]+E1[1]], V2=[V[0]+E2[0],V[1]+E2[1]], V3=[V[0]+E3[0],V[1]+E3[1]];
      const V12=[V1[0]+E2[0],V1[1]+E2[1]], V13=[V1[0]+E3[0],V1[1]+E3[1]], V23=[V2[0]+E3[0],V2[1]+E3[1]];
      poly(S,[V,V1,V12,V2],FA);
      poly(S,[V,V1,V13,V3],FL);
      poly(S,[V,V2,V23,V3],FR);
      // Kanten
      line(S,V[0],V[1],V1[0],V1[1],EDGE); line(S,V[0],V[1],V2[0],V2[1],EDGE); line(S,V[0],V[1],V3[0],V3[1],EDGE);
      const lay={1:[[.5,.5]],2:[[.27,.27],[.73,.73]],3:[[.22,.22],[.5,.5],[.78,.78]],4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]],
        5:[[.23,.23],[.77,.23],[.23,.77],[.77,.77],[.5,.5]],6:[[.27,.2],[.27,.5],[.27,.8],[.73,.2],[.73,.5],[.73,.8]]};
      const pips=(n,A,B,wide)=>lay[n].forEach(p=>{
        const x=V[0]+A[0]*p[0]+B[0]*p[1], y=V[1]+A[1]*p[0]+B[1]*p[1];
        if(wide) rect(S,Math.round(x-1),Math.round(y-1),3,2,PIP); else rect(S,Math.round(x-1),Math.round(y-1),2,2,PIP);
      });
      pips(top,E1,E2,true); pips(left,E1,E3,false); pips(right,E2,E3,false);
      // Glanz Oberkante
      const m=[V1[0]+E2[0]*0.5,V1[1]+E2[1]*0.5];
      return {V,V1,V2,V3,V12,V13,V23};
    }
    // Schatten
    ell(F,27,56,13,3,'#7a0e1c'); ell(F,43,76-3,12,2,'#7a0e1c');
    // Bewegungsstriche
    const MS='#ffe9c8';
    line(F,8,12,17,16,MS); line(F,6,20,14,24,MS); line(F,12,8,20,12,'#ffffff'); line(F,5,28,10,31,MS);
    line(F,28,40,36,44,MS); line(F,24,50,32,54,MS); line(F,33,36,40,40,'#ffffff');
    line(F,9,50,16,54,MS); line(F,6,58,12,61,MS);
    // Wuerfel A (oben links), B (unten rechts)
    die([20,36],[-12,-4],[10,-6],[1,14],6,3,2);
    die([42,62],[-10,-6],[11,-3],[-1,13],3,1,5);
    outline(S,OL);
    // Funkeln
    plus(F,50,16,'#ffffff',true); plus(F,12,44,'#fff2a0',false); plus(F,52,46,'#fff2a0',false); plus(F,26,70,'#ffffff',false);
    shine(S,10,28); shine(S,33,56);
  }

  // ================= 3. Schluessel =================
  function schluessel(F,S){
    bands(F,4,4,57,78,[[4,'#0c1440'],[20,'#121c56'],[38,'#182668'],[56,'#121c56'],[70,'#0c1440']]);
    // Mauerfugen (grosse Bloecke)
    const MJ='#0a1034';
    [[22],[38],[54],[70]].forEach(r=>rect(F,4,r[0],54,1,MJ));
    [[12,4],[44,4],[28,22],[8,38],[50,38],[20,54],[46,54],[36,70],[12,70]].forEach(v=>rect(F,v[0],v[1]===4?4:v[1],1,16,MJ));
    // Steinrahmen (Bogen)
    const arch=(cx,cy,rx,ry,x0,x1,y1,c)=>{ ell(F,cx,cy,rx,ry,c); rect(F,x0,cy,x1-x0+1,y1-cy+1,c); };
    arch(31,31,23,19,8,54,78,'#4a5ca0');
    arch(31,31,20,16,11,51,78,'#2a3a7c');
    // Tuer: Planken
    arch(31,32,18,15,13,49,78,'#1a2a64');
    for(let x=13;x<=49;x++){ const k=(x-13)%9; if(k===8) for(let y=18;y<=78;y++) if(F[y*62+x]==='#1a2a64') put(F,x,y,'#101c4c'); if(k===0) for(let y=18;y<=78;y++) if(F[y*62+x]==='#1a2a64') put(F,x,y,'#24388a'); }
    // Eisenbaender
    rect(F,13,36,37,3,'#c89420'); rect(F,13,36,37,1,'#f4c030'); rect(F,13,38,37,1,'#8a5a0c');
    rect(F,13,62,37,3,'#c89420'); rect(F,13,62,37,1,'#f4c030'); rect(F,13,64,37,1,'#8a5a0c');
    [[17,37],[26,37],[35,37],[44,37],[17,63],[26,63],[35,63],[44,63]].forEach(p=>{ put(F,p[0],p[1],'#fff2a0'); });
    // Schlosskasten
    rect(F,39,29,13,19,'#0a1034'); rect(F,40,30,11,17,'#f4c030'); rect(F,40,30,11,2,'#fff2a0'); rect(F,40,45,11,2,'#a86a0c'); rect(F,49,32,2,13,'#c89420');
    disc(F,45,36,2.5,'#0a1034'); rect(F,44,37,3,6,'#0a1034');
    put(F,41,31,WH); put(F,42,31,WH);
    // Sterne im Gemaeuer
    plus(F,9,14,'#8aa4ff'); plus(F,53,12,'#8aa4ff');

    // Schluessel schraeg
    const P0=[21,22], L=Math.hypot(24,46), d=[24/L,46/L], n=[d[1],-d[0]];
    const GP=['#f4b820','#fff08a','#a86a0c'];
    const pt=(u,v)=>[P0[0]+d[0]*u+n[0]*v, P0[1]+d[1]*u+n[1]*v];
    const tone=(v,lo,hi)=>{ const t=(v-lo)/(hi-lo); return t<0.28?GP[1]:(t>0.7?GP[2]:GP[0]); };
    function loc(x,y){ const dx=x+0.5-P0[0], dy=y+0.5-P0[1]; return [dx*d[0]+dy*d[1], dx*n[0]+dy*n[1]]; }
    for(let y=0;y<83;y++) for(let x=0;x<62;x++){
      const [u,v]=loc(x,y);
      if(u>=9&&u<=55&&Math.abs(v)<=2.6) put(S,x,y,tone(v,-2.6,2.6));
      if(((u>=14&&u<=16.5)||(u>=20&&u<=22.5))&&Math.abs(v)<=4) put(S,x,y,tone(v,-4,4));
      if(u>=41&&u<=55&&v<=-1&&v>=-12){
        const notch=(u>=44.5&&u<=47.5&&v<-5)||(u>=50&&u<=52.5&&v<-8);
        if(!notch) put(S,x,y,tone(v,-12,-1));
      }
    }
    // Kleeblatt-Griff: drei Lappen im Abstand von 120 Grad
    [180,60,-60].forEach(g=>{ const r=g*Math.PI/180, p=pt(Math.cos(r)*8,Math.sin(r)*8); sell(S,p[0],p[1],4.8,4.8,GP); });
    { const p=pt(0,0); sell(S,p[0],p[1],4.4,4.4,GP); }
    { const p=pt(0,0); disc(S,p[0],p[1],2.4,null); }
    { const p=pt(10.5,0); sell(S,p[0],p[1],3.4,3.4,GP); }
    outline(S,OL);
    { const p=pt(-7,0); shine(S,Math.round(p[0])-1,Math.round(p[1])-2); }
    { const p=pt(30,-1); put(S,Math.round(p[0]),Math.round(p[1]),WH); }
    // Funkel
    plus(F,50,26,'#fff2a0'); plus(F,10,66,'#8aa4ff');
  }

  // ================= 4. Kristallkugel =================
  function kristallkugel(F,S){
    bands(F,4,4,57,78,[[4,'#1a0c40'],[18,'#26125a'],[34,'#321a72'],[50,'#26125a'],[64,'#1a0c40']]);
    [[10,10,0],[50,8,1],[14,26,1],[52,28,0],[8,44,0],[53,50,1],[22,8,0],[42,14,0],[10,58,0],[50,62,0]]
      .forEach(s=>{ if(s[2]) plus(F,s[0],s[1],'#f4e0ff'); else { put(F,s[0],s[1],'#d8c0ff'); } });
    star5(F,30,9,3,'#ffe27a'); star5(F,50,40,2,'#a8f4f0');
    const CX=31, CY=34, R=19;
    // Staender (hinter der Kugel)
    const GP=['#f4b820','#fff08a','#a86a0c'];
    poly(S,[[26,56],[36,56],[35,64],[27,64]],GP[0]); rect(S,26,56,2,8,GP[1]); rect(S,34,56,2,8,GP[2]);
    sell(S,31,62,6,2.5,GP);
    poly(S,[[27,64],[35,64],[41,70],[21,70]],GP[0]); poly(S,[[27,64],[29,64],[26,70],[21,70]],GP[1]); poly(S,[[33,64],[35,64],[41,70],[37,70]],GP[2]);
    rect(S,21,70,21,1,GP[2]);
    // Kugel
    for(let y=0;y<83;y++) for(let x=0;x<62;x++){
      const dx=x+0.5-CX, dy=y+0.5-CY, r=Math.hypot(dx,dy);
      if(r>R) continue;
      let th=Math.atan2(dy,dx); if(th<0) th+=Math.PI*2;
      const f=((th/Math.PI)+r/R*1.5)%1;
      let c;
      if(r<3) c='#fff6c8';
      else if(r<5.5) c='#7af4f0';
      else if(f<0.34) c = r<R*0.55 ? '#32d4d8' : '#9a5af0';
      else if(f<0.44) c = r<R*0.55 ? '#1e9aa8' : '#6a38c0';
      else c = r<R*0.6 ? '#3a1c8c' : '#241060';
      if(r>R-2){ const lit=-(dx*0.6+dy*0.8); c = lit>0 ? '#8a6ae8' : '#14083c'; }
      put(S,x,y,c);
    }
    // Sterne in der Kugel
    [[24,24],[40,28],[22,42],[39,46],[31,27],[29,48],[36,36]].forEach(s=>put(S,s[0],s[1],'#ffffff'));
    // Glanz
    for(let a=200;a<=262;a+=4){ const t=a*Math.PI/180; put(S,CX+Math.cos(t)*(R-4),CY+Math.sin(t)*(R-4),WH); }
    shine(S,20,26); put(S,43,50,'#bff8f4'); put(S,44,48,'#bff8f4');
    // Fassung vorn
    for(let x=17;x<=45;x++){ const t=(x-31)/14.5, yy=Math.round(52+Math.sqrt(Math.max(0,1-t*t))*5); put(S,x,yy,GP[0]); put(S,x,yy+1,GP[0]); put(S,x,yy+2,GP[2]); if(x<28) put(S,x,yy,GP[1]); }
    // Samttuch davor
    const CL=['#b02070','#e04a98','#6a1050'];
    for(let x=4;x<=57;x++){
      const top=Math.round(67+2.5*Math.sin(x*0.2+0.6)-((x<14)?(14-x)*0.9:0));
      for(let y=top;y<=78;y++){
        const k=((Math.floor(x+2.5*Math.sin(y*0.1)))%10+10)%10;
        let c = k<2?CL[2]:(k<5?CL[0]:(k<7?CL[1]:CL[0]));
        if(y>=76) c=CL[2];
        put(S,x,y,c);
      }
      put(S,x,top,'#ffd84a'); put(S,x,top+1,'#c89420');
    }
    outline(S,OL);
    shine(S,22,70);
  }

  window.JOKER_EXTRA=window.JOKER_EXTRA||{}; Object.assign(window.JOKER_EXTRA,{kartenfaecher,wuerfel_paar,schluessel,kristallkugel});
})();
