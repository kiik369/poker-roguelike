/* Joker-Motive (musik-und-buero). Jede Funktion malt ein Motiv in 62x83-Karten (F = Hintergrund, S = Vordergrund). */
(function(){ const {put,rect,disc,ell,sell,line,poly,outline,shine,bands,star5,plus,OL,WH}=window.JK;

  // Achtelnote: Kopf bei (x,y), Hals nach oben, Fahne
  function note8(L,x,y,c,c2){
    ell(L,x,y,2,1.4,c); rect(L,x+2,y-8,1,8,c2||c); rect(L,x+3,y-8,2,1,c2||c); rect(L,x+4,y-7,1,2,c2||c); put(L,x+5,y-5,c2||c);
  }
  function note4(L,x,y,c){ ell(L,x,y,2,1.4,c); rect(L,x+2,y-8,1,9,c); }

  function neusprech(F,S){
    bands(F,4,4,57,78,[[4,'#6c7658'],[18,'#7e8866'],[32,'#8f9570'],[46,'#a49c62'],[62,'#b4a458'],[72,'#8a7a40']]);
    // Jalousie-Fenster oben links
    rect(F,6,7,16,16,'#4c5640'); for(let i=0;i<4;i++){ rect(F,7,8+i*4,14,3,'#a8b088'); rect(F,7,8+i*4,14,1,'#d0d6b0'); }
    // Aktenschrank rechts unten
    rect(F,44,52,13,24,'#5c6650'); rect(F,44,52,13,1,'#8c9672'); rect(F,46,55,9,8,'#6e785e'); rect(F,46,66,9,8,'#6e785e');
    rect(F,49,58,3,1,'#2c3426'); rect(F,49,69,3,1,'#2c3426');
    // Aktenstapel unten
    rect(F,30,72,24,3,'#e0d8b0'); rect(F,32,69,20,3,'#cfc695'); rect(F,4,75,54,4,'#5e5226');
    rect(F,4,75,54,1,'#8a7a3a');

    // Megafon: Trichter nach rechts, Mundstueck links, Griff unten
    const RD=['#e8452c','#ff8a5c','#9a1e22'];
    poly(S,[[14,66],[20,66],[20,76],[14,76]],'#3a3248'); rect(S,15,67,2,8,'#6a6088');
    poly(S,[[5,50],[9,48],[26,38],[26,70],[9,60],[5,58]],RD[0]);
    poly(S,[[9,48],[26,38],[26,46],[9,52]],RD[1]);
    poly(S,[[9,60],[26,62],[26,70]],RD[2]); poly(S,[[9,58],[26,56],[26,62],[9,60]],RD[2]);
    rect(S,5,50,4,8,'#3a3248'); rect(S,5,50,1,8,'#6a6088');
    // heller Ring
    rect(S,13,50,3,10,'#ffe27a'); rect(S,13,50,1,10,WH); rect(S,15,50,1,10,'#c8902a');
    // Trichteroeffnung
    ell(S,27,54,4,16,'#ffd070'); ell(S,28,54,3,14,'#7a1420'); ell(S,28,54,2,11,'#3a0a14');
    put(S,26,40,WH); put(S,26,41,WH);

    // Sprechblasen
    const bub=(x,y,w,h,tx,ty)=>{
      poly(S,[[x+3,y+h-1],[x+9,y+h-1],[tx,ty]],WH);
      rect(S,x+1,y,w-2,h,WH); rect(S,x,y+1,w,h-2,WH);
      rect(S,x+1,y+h-1,w-2,1,'#cfd2c4'); rect(S,x,y+h-2,1,1,'#cfd2c4'); rect(S,x+w-1,y+h-2,1,1,'#cfd2c4');
    };
    bub(28,8,28,15,31,36);
    bub(38,27,18,12,34,44);
    bub(37,44,19,11,32,50);
    const BK='#0c0a12';
    rect(S,30,10,24,4,BK); rect(S,30,16,12,3,BK);
    rect(S,40,30,14,4,BK);
    rect(S,39,46,15,3,BK); rect(S,39,50,8,3,BK);
    outline(S,OL);
    shine(S,8,52); shine(S,30,10);
  }

  function pixel_orchester(F,S){
    // Buehnenhintergrund
    bands(F,4,4,57,78,[[4,'#2a1a3e'],[20,'#3a2450'],[40,'#4c2e5e'],[58,'#5e3868'],[66,'#7a4a20']]);
    // Vorhaenge
    const cur=(x0,x1)=>{ for(let x=x0;x<=x1;x++){ const f=(x-x0)%4; const c=f===0?'#ff5a4a':(f===3?'#8a1428':'#d82840'); rect(F,x,4,1,40,c); } };
    cur(4,11); cur(50,57);
    poly(F,[[12,4],[24,4],[12,22]],'#c01e38'); poly(F,[[49,4],[37,4],[49,22]],'#c01e38');
    poly(F,[[12,4],[19,4],[12,13]],'#ff5a4a'); poly(F,[[49,4],[42,4],[49,13]],'#ff5a4a');
    rect(F,4,4,54,3,'#e8a820'); rect(F,4,4,54,1,'#ffe27a'); rect(F,4,6,54,1,'#9a6a10');
    // Buehne (goldene Kante)
    rect(F,4,66,54,2,'#ffd44a'); rect(F,4,66,54,1,'#fff0a0'); rect(F,4,68,54,1,'#b87a14');
    rect(F,4,69,54,10,'#7a4a20'); for(let x=4;x<58;x+=9) rect(F,x,69,1,10,'#5a3410');
    rect(F,4,72,54,1,'#8e5a28');
    // Spot-Kegel
    poly(F,[[24,7],[38,7],[48,66],[14,66]],'#5c3a70');

    // Notenpult (Mitte)
    const MT='#c8ccd8';
    rect(S,30,56,2,12,'#8890a8'); rect(S,24,66,14,2,'#6a7088'); rect(S,26,64,10,2,'#8890a8'); rect(S,30,56,1,12,MT);
    poly(S,[[20,28],[43,28],[41,50],[22,50]],'#b8c0d4'); poly(S,[[20,28],[43,28],[43,31],[20,31]],'#e8ecf6');
    poly(S,[[22,32],[41,32],[40,48],[23,48]],'#f6f4ea');
    for(let i=0;i<4;i++) rect(S,24,35+i*3,15,1,'#2c2a40');
    rect(S,21,49,21,2,'#8890a8'); rect(S,21,49,21,1,'#c8ccd8');
    // Noten auf dem Pult
    ell(S,27,41,1.4,1,'#d82840'); rect(S,28,34,1,7,'#d82840'); ell(S,34,38,1.4,1,'#2840c8'); rect(S,35,32,1,6,'#2840c8'); rect(S,28,34,7,1,'#2c2a40'); 

    // Geige links (schwebend)
    const VB=['#c8641c','#f0a050','#7a3010'];
    rect(S,13,17,3,12,'#3a2410'); rect(S,13,17,1,12,'#6a4420');
    sell(S,14,14,3,3,VB); put(S,14,13,'#3a2410'); 
    sell(S,14,50,8,9,VB); sell(S,14,38,6,6,VB); rect(S,8,43,12,2,VB[0]);
    ell(S,14,44,3,1.2,VB[2]); 
    rect(S,11,40,1,6,'#2c1408'); rect(S,16,40,1,6,'#2c1408'); put(S,11,39,'#2c1408'); put(S,16,39,'#2c1408'); put(S,11,46,'#2c1408'); put(S,16,46,'#2c1408');
    rect(S,12,53,5,1,'#f4e2b0'); rect(S,12,55,5,1,'#2c1408');
    rect(S,13,29,1,24,'#e8e2c8'); rect(S,15,29,1,24,'#e8e2c8');
    // Bogen
    line(S,6,62,24,36,'#f0d8a8'); line(S,7,62,25,36,'#8a5a28');

    // Trompete rechts (schwebend, nach rechts oben)
    const BR=['#e8b020','#fff0a0','#9a6a10'];
    rect(S,34,58,18,3,BR[0]); rect(S,34,58,18,1,BR[1]); rect(S,34,60,18,1,BR[2]);
    poly(S,[[50,56],[56,52],[56,66],[50,61]],BR[0]); poly(S,[[50,56],[56,52],[56,55],[50,58]],BR[1]);
    rect(S,32,59,3,1,'#c8ccd8'); rect(S,30,58,2,3,'#c8ccd8');
    rect(S,34,50,16,2,BR[0]); rect(S,34,50,16,1,BR[1]); rect(S,33,51,2,9,BR[0]); rect(S,49,51,2,5,BR[0]);
    [38,42,46].forEach(x=>{ rect(S,x,45,3,6,BR[2]); rect(S,x,44,3,2,'#e8ecf6'); });

    outline(S,OL);
    // fliegende Noten
    note8(S,28,20,'#ffe23a'); note8(S,42,16,WH); note4(S,50,36,'#7af0ff'); note8(S,8,70,'#ffe23a');
    outline(S,OL);
    shine(S,12,47); shine(S,40,59);
  }

  function chip_melodie(F,S){
    bands(F,4,4,57,78,[[4,'#0a2c2c'],[22,'#0e3c38'],[40,'#12503f'],[58,'#186a4c'],[70,'#0c3a30']]);
    const tr='#2ea878';
    rect(F,4,12,18,1,tr); rect(F,22,12,1,6,tr); rect(F,22,18,10,1,tr); disc(F,32,18,1,'#7af0b0');
    rect(F,4,76,12,1,tr); rect(F,16,72,1,5,tr); rect(F,16,72,8,1,tr); disc(F,24,72,1,'#7af0b0');
    rect(F,48,8,10,1,tr); rect(F,48,8,1,8,tr); disc(F,48,16,1,'#7af0b0');
    rect(F,50,75,8,1,tr);
    // Mini-Oszilloskop links
    rect(S,5,50,21,18,'#2a4a5a'); rect(S,5,50,21,1,'#5a8aa0'); rect(S,6,51,19,16,'#04140e');
    rect(S,6,59,19,1,'#1e5a40'); rect(S,15,51,1,16,'#123a2c'); rect(S,10,51,1,16,'#0c2a20'); rect(S,20,51,1,16,'#0c2a20');
    const G='#58ff8a', y1=55, y2=63;
    rect(S,7,y2,3,1,G); rect(S,9,y1,1,9,G); rect(S,9,y1,5,1,G); rect(S,13,y1,1,9,G); rect(S,13,y2,5,1,G); rect(S,17,y1,1,9,G); rect(S,17,y1,4,1,G); rect(S,20,y1,1,9,G); rect(S,20,y2,4,1,G);
    // Beinchen
    const LG='#d8dce8', LS='#7a8298';
    for(let i=0;i<6;i++){
      const p=3+i*4;
      rect(S,28-3,46+p,4,2,LG); rect(S,25,46+p+1,4,1,LS);
      rect(S,53,46+p,4,2,LG); rect(S,53,46+p+1,4,1,LS);
      rect(S,29+p,43,2,3,LG); rect(S,30+p,43,1,3,LS);
      rect(S,29+p,70,2,3,LG); rect(S,30+p,70,1,3,LS);
    }
    // Gehaeuse 29..52 x 46..69
    rect(S,29,46,24,24,'#2a2e3e'); rect(S,29,46,24,2,'#4a5068'); rect(S,29,46,2,24,'#4a5068'); rect(S,51,48,2,22,'#14182a'); rect(S,31,68,22,2,'#14182a');
    rect(S,33,50,16,16,'#1c2030');
    // Die-Flaeche mit Leuchtkern
    rect(S,36,53,10,10,'#2c8a6a'); rect(S,36,53,10,1,'#7af0b0'); rect(S,36,53,1,10,'#7af0b0'); rect(S,45,54,1,9,'#145a44'); rect(S,37,62,9,1,'#145a44');
    rect(S,39,56,4,4,'#a8ffd0'); rect(S,39,56,2,2,WH);
    // Kerbe oben + Punkt
    disc(S,41,46,2,'#14182a'); rect(S,39,46,5,1,'#14182a'); put(S,32,49,'#a8b0c8'); put(S,33,49,'#a8b0c8');
    // aufsteigende Noten (Viertel / Achtel)
    note4(S,35,38,'#ffe23a');
    note8(S,43,28,'#ff7ad8');
    note8(S,34,16,'#7af0ff');
    outline(S,OL);
    shine(S,31,48);
  }

  function schlafen_mit_musik(F,S){
    bands(F,4,4,57,78,[[4,'#141a4a'],[18,'#1e2a68'],[32,'#2a3a88'],[44,'#3a2c70'],[60,'#2a1e58'],[72,'#1c1440']]);
    // Fensterrahmen
    rect(F,7,7,48,34,'#6a4a2a'); rect(F,9,9,44,30,'#0e1450'); rect(F,9,9,44,10,'#10185a'); rect(F,9,19,44,10,'#182470'); rect(F,9,29,44,10,'#22308c');
    rect(F,30,9,2,30,'#6a4a2a'); rect(F,9,24,44,2,'#6a4a2a'); rect(F,7,7,48,1,'#a07a4a'); rect(F,7,41,48,2,'#a07a4a');
    // Mond (Sichel) im linken Fensterflügel
    disc(F,20,17,6,'#ffe88a'); disc(F,20,17,5,'#fff4b8'); disc(F,23,15,5,'#10185a'); disc(F,24,15,4,'#10185a');
    // Sterne im Fenster
    plus(F,40,14,WH); plus(F,47,31,'#fff4b8'); plus(F,14,33,'#fff4b8',0); put(F,36,32,WH); put(F,50,13,WH); put(F,26,34,WH); put(F,43,22,'#c8d4ff');
    // Sterne aussen
    plus(F,6,52,'#fff4b8'); put(F,56,50,WH); put(F,6,72,WH); plus(F,55,74,'#c8d4ff');
    // Kissen (Wolkenform)
    const PL=['#f4f0ff','#ffffff','#a8a0d8'];
    sell(S,18,62,13,8,PL,[0.55,-0.35]); sell(S,30,60,10,8,PL,[0.55,-0.35]); sell(S,10,59,7,7,PL,[0.55,-0.35]); sell(S,22,56,9,6,PL,[0.55,-0.35]);
    rect(S,6,64,32,7,PL[0]); rect(S,6,70,32,2,PL[2]); rect(S,8,72,28,1,PL[2]);
    sell(S,12,70,6,3,PL,[0.55,-0.35]); sell(S,25,71,7,3,PL,[0.55,-0.35]); sell(S,34,69,5,4,PL,[0.55,-0.35]);
    // Naht
    rect(S,10,66,24,1,'#c8c0ee');
    // Kopfhoerer: Buegel + 2 Muscheln
    const HP=['#e8452c','#ff8a5c','#9a1e22'];
    for(let a=0;a<=20;a++){ const t=Math.PI*(1-a/20); const x=19+Math.cos(t)*11, y=54-Math.sin(t)*14; disc(S,x,y,1.8,'#3a3a54'); }
    for(let a=0;a<=20;a++){ const t=Math.PI*(1-a/20); const x=19+Math.cos(t)*11, y=54-Math.sin(t)*14; put(S,x-1,y-1,'#9a9ac0'); }
    sell(S,8,55,5,6,HP,[0.5,-0.3]); sell(S,30,55,5,6,HP,[0.5,-0.3]);
    rect(S,6,53,2,5,HP[2]);rect(S,31,53,2,5,HP[2]);
    // Smartphone rechts
    rect(S,39,36,16,34,'#2a2e44'); rect(S,39,36,16,1,'#5a6088'); rect(S,39,36,1,34,'#5a6088'); rect(S,54,36,1,34,'#14182a'); rect(S,39,69,16,1,'#14182a');
    rect(S,41,40,12,25,'#1a1048'); rect(S,41,40,12,2,'#2a1c70');
    poly(S,[[44,44],[44,52],[51,48]],'#58ff8a'); poly(S,[[44,44],[44,47],[47,45]],'#c8ffd8');
    // Equalizer-Balken
    const eq=[[42,5,'#ff7ad8'],[44,8,'#ffe23a'],[46,11,'#58ff8a'],[48,7,'#7af0ff'],[50,10,'#ffe23a']];
    eq.forEach(e=>{ rect(S,e[0],64-e[1],2,e[1],e[2]); rect(S,e[0],64-e[1],2,1,WH); });
    rect(S,45,38,5,1,'#14182a');
    // Noten ueber den Kopfhoerern
    note8(S,34,38,'#ffe23a'); note4(S,20,36,'#7af0ff'); note8(S,50,30,'#ff7ad8');
    outline(S,OL);
    shine(S,10,52); shine(S,41,38);
  }
  window.JOKER_EXTRA=window.JOKER_EXTRA||{}; Object.assign(window.JOKER_EXTRA,{neusprech,pixel_orchester,chip_melodie,schlafen_mit_musik});
})();
