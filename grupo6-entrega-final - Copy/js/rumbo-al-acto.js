let puntos = 0;
let vidas = 3;

let tiempoJuego;
let fps;

let minutos = 0;
let segundos = 30;

let canvas;
let ctx;
let fuente= new FontFace('pixel', "url(fuente/PressStart2P-Regular.ttf) format('truetype')");
document.fonts.add(fuente);
fuente.load().then(inicio);

//salto
let velocidad = 7.5;
let gravedad=1;

//fondos
let posFondo1=0;
let posFondo2=0;
let posFondo3=0;

let contador=0;

let iniciar = false;

let colorBoton1= "#1c2280";
let colorBoton2= "#04a4d2"

//variables audios
let audioPerdida1;
let audioPerdida2;
let audioPuntos;
let audioVidas;
let audio;

//variables pj
let alturaInicial=154;
let anchoInicial=109;
let posXPer=70;
let posYPer=270;

//variables elementos
let posXa = 1130;
let posYa = 321;
let posXco = 800;
let posYco = 250;
let posXch = 1050;
let posYch = 140;
let posXe = 300;
let posYe = 220;
let posXe1 = 650;
let posYe1 = 330;
//img 
let imgPersonajeUnoS = new Image();
let imgPersonajeUno = new Image();
let imgAgua = new Image();
let imgConstruccion = new Image();
let imgChori = new Image();
let imgEscudo = new Image();
let imgEscudo1 = new Image();

let escudoIcono=new Escudo(760,10,30,44);
let choriIcono=new Choripan(10,20,50,23);
let personajeUnoS = new Personaje(posXPer,posYPer,anchoInicial,alturaInicial,109,154);
let personajeUno = new Personaje(posXPer,posYPer,anchoInicial,alturaInicial,109,154); 
let agua=new Elemento(imgAgua, posXa,posYa, 178,86,"agua");//imagen, x,y, ancho,alto, tipo
let construccion=new Elemento(imgConstruccion, posXco,posYco, 168,131, "construccion");
let chori=new Elemento(imgChori, posXch,posYch, 50,24, "chori");
let escudo=new Elemento(imgEscudo, posXe,posYe, 30,44, "escudo");
let escudo1=new Elemento(imgEscudo1, posXe1,posYe1, 30,44, "escudo1");

function inicio(){

    canvas=document.getElementById("canvas");
    canvas.style.backgroundImage="url(img/inicio.png)";
    canvas.style.backgroundPosition = "0px 0px";
    ctx=canvas.getContext("2d");
    dibujarTextoInicio();  
}

function dibujar(){
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");

    iniciar=true;
    canvas.style.cursor="";
       
    canvas.style.backgroundImage = "url(img/personas.png), url(img/edificios.png), url(img/fondo.png)";

    imgPersonajeUno.src="img/sprite.png";
    imgPersonajeUno.onload=function(){
        personajeUno.dibujaPj();
    }
    imgEscudo.src="img/escudo.png";
    imgEscudo.onload=function(){
        escudo.dibuja();
        escudoIcono.dibuja();
    }
    imgEscudo1.src="img/escudo.png";
    imgEscudo1.onload=function(){
        escudo1.dibuja();
    }
    imgChori.src= "img/chori.png";
    imgChori.onload = function(){
        chori.dibuja();
        choriIcono.dibuja();
    }
    imgConstruccion.src= "img/construccion.png";
    imgConstruccion.onload = function(){
        construccion.dibuja();
    }
    imgAgua.src= "img/agua-cono.png";
    imgAgua.onload = function(){
        agua.dibuja();
    }

    dibujarTexto();
    
    //inicializar audios
    audioPerdida1 =  new Audio();
	audioPerdida1.src="audios/perdida1.mp3";//construccion
    audioPerdida2 =  new Audio();
	audioPerdida2.src="audios/perdida2.mp3";//agua
	audioPuntos =  new Audio();
	audioPuntos.src="audios/puntos.mp3";
    audioVidas = new Audio();
    audioVidas.src="audios/vidas.mp3";
    audio = new Audio();
    audio.src = "audios/audio.mp3";
    audioFinNo = new Audio();
    audioFinNo.src = "audios/final-no.mp3";
    audioFinSi = new Audio();
    audioFinSi.src = "audios/final-si.mp3";
    perdiste = new Audio();
    perdiste.src = "audios/perdiste.mp3";

    //juego
    fps=setInterval(function(){
        if(vidas>0){
            audio.play();
            
            //que los elementos se muevan lateralmente
            chori.mover();
            escudo.mover();
            escudo1.mover();
            agua.mover();
            construccion.mover();
           //mov fondo
            posFondo1-=3;
            posFondo2-=1;
            posFondo3-=3;
            canvas.style.backgroundPosition = posFondo1+"px 0px,"+posFondo2+"px 0px,"+posFondo3+"px 0px";
            //logica salto
            personajeUno.velocidad+=gravedad;
            personajeUno.y+=personajeUno.velocidad;
            //si el pj esta tocando el piso
            if(personajeUno.y>380-personajeUno.alto){
                personajeUno.velocidad=0;
                personajeUno.y=380-personajeUno.alto;
                personajeUno.saltando=false;
            }
            
            //chequear colision
            chori.colision();
            escudo.colision();
            escudo1.colision();
            agua.colision();
            construccion.colision();

            redibujar();
            //sprite del pj
            contador++;
            if(contador%3==0){
                personajeUno.actualizarCuadro();
            }            
            personajeUno.dibujaPj();
        
        }
    },1000/25);

    //temporizador
    tiempoJuego = setInterval(function(){
        if (minutos==0 && segundos==0){
            terminar("Juntaste "+puntos +" puntos!", 18,115);
            dibujarTextoReinicio();
            if (puntos >= 10 && vidas >= 5){
                canvas.style.backgroundImage = "url(img/final1.png)";
                canvas.style.backgroundPosition = "0px 0px";
                audioFinSi.play();
            }else if (puntos >= 10 && vidas <=4){
                canvas.style.backgroundImage = "url(img/final2.png)";
                canvas.style.backgroundPosition = "0px 0px";
                audioFinNo.play();
            }else{//(puntos < 10 || vidas <=4)
                canvas.style.backgroundImage = "url(img/final3.png)";
                canvas.style.backgroundPosition = "0px 0px";
                audioFinNo.play();
            }

            audio.pause();
            
        }else if (segundos!=0){
            segundos--;
        }else {
            minutos--;
            segundos = 59;
        }
        if (vidas==0){
            //terminar("PERDISTE", 16,140);
            terminar("Juntaste "+puntos +" puntos!", 20,95);
            canvas.style.backgroundImage = "url(img/final4.png)";
            canvas.style.backgroundPosition = "0px 0px";
            audio.pause();
            perdiste.play();

            dibujarTextoReinicio();
        }
        
    }, 25000/25);
}

function terminar(texto,x,y){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font = "20px pixel";
    ctx.fillStyle = colorBoton1;
    ctx.fillText(texto,x,y);
    
    clearInterval(fps);
    clearInterval(tiempoJuego);
    iniciar=false;
}
//textos
function dibujarTexto(){
    ctx.font = "14px pixel";
    ctx.fillStyle= colorBoton1;
    ctx.fillText(" "+puntos, 710,40);
    ctx.fillText(" x"+vidas,55,40);

    if (segundos<=9 && segundos>=0){
        ctx.fillText(minutos +":0" +segundos,380,35);
    }else {
        ctx.fillText(minutos +":" +segundos,380,35);
    }
}
function dibujarTextoInicio(){
    borrar();
    ctx.font= "40px pixel";
    ctx.fillStyle=colorBoton2;
    ctx.fillText( 'INICIAR', 250,410);
}
function dibujarTextoReinicio(){
    //borrar();
    ctx.font= "40px pixel";
    ctx.fillStyle=colorBoton2;
    ctx.fillText( 'REINICIAR', 200,430);
}
//iconos
function Choripan(x,y,ancho,alto){
    this.x=x;
    this.y=y;
    this.ancho=ancho;
    this.alto=alto;
    this.img=imgChori;

    this.dibuja=function(){
        ctx.drawImage(this.img,this.x,this.y,this.ancho,this.alto); 
    }
}
function Escudo(x,y,ancho,alto){
    this.x=x;
    this.y=y;
    this.ancho=ancho;
    this.alto=alto;
    this.img=imgEscudo;

    this.dibuja=function(){
        ctx.drawImage(this.img,this.x,this.y,this.ancho,this.alto); 
    }
}
//personaje
function Personaje(x,y, ancho,alto, anchoRecorte, altoRecorte){
    //atributos
    this.x=x;
    this.y=y;
    this.ancho=ancho;
    this.alto=alto;
    this.anchoRecorte=anchoRecorte;
    this.altoRecorte=altoRecorte;
    this.posicion=0;
    this.cuadrosTotales=8;
    
    
    this.saltando=false;
    this.velocidad=0;

    //metodos
    this.actualizarCuadro=function(){
        if(this.saltando){
            this.posicion=8;

        }else{
            if(this.posicion<this.cuadrosTotales-1){
                this.posicion++;
            }else{
            this.posicion=0;
            }
        }
    }
    this.dibujaPj=function(){
       
        ctx.drawImage(
        imgPersonajeUno, 
        this.posicion * this.anchoRecorte, 
        0,
        this.anchoRecorte,
        this.altoRecorte,
        this.x, 
        this.y, 
        this.ancho, 
        this.alto
        );   
    }
    this.saltar=function(){
        if(this.saltando==false){
            this.saltando=true;
            this.velocidad-=velocidad*3;
            //this.posicion=8;
        }else{
            if(this.y==380){
                this.saltando=false;
                this.velocidad=0;
                this.posicion=0;  
            }
        }
    }
    this.agacharse=function(){
         
        personajeUno.y=posYPer;
        personajeUno.alto=154;
        personajeUno.ancho=109;
        imgPersonajeUno.onload=function(){
            personajeUno.dibujaPj();
        }
    }
    this.izquierda=function(){
        if(this.x>0){
        this.x-=10;
        }
    }   
    
    this.derecha=function(){
        if(this.x<699){
        this.x+=10;  
        }
    }
}
//objetos
function Elemento(img, x,y, ancho,alto, tipo){
    this.x=x;
    this.y=y;
    this.ancho=ancho;
    this.alto=alto;
    this.img=img;
    this.tipo=tipo;

    //metodos
    this.dibuja=function(){
        ctx.drawImage(this.img,this.x,this.y,this.ancho,this.alto);
    }
    this.mover=function(){
        if(this.x>-50){
            this.x-=14;
        }else{ //sortear segun tipo
          switch(this.tipo){
            case "construccion":
                this.sortearConstruccion();
            break;
            case "agua":
                this.sortearAgua();
            break;
            default:
                this.sortear();
                this.sortearChori();
            break;
          }
        }
    }
    //sortear segun tipo
    this.sortear=function(){
        this.x=Math.floor(Math.random()*(1500 - 850 + 1))+850;
        this.y=Math.floor(Math.random()*(260 - 150 + 1))+150;
    }
    this.sortearChori=function(){
        this.x=2500; 
        this.y=Math.floor(Math.random()*(140 - 200 + 1))+200;
    }

    let posicionesX = [800,900,1000,1130,1250,1370,1460];
    this.sortearConstruccion=function(){
        let x = posicionesX[Math.floor(Math.random() * 7)];
        // ver superposicion con agua
        if (this.superposicion(x, y, agua.x, agua.y)) {
            this.sortearConstruccion();
        } else {
            this.x = x;
            this.y = y;
        }
    }
    this.sortearAgua=function(){
        let x = posicionesX[Math.floor(Math.random() * 7)];
        // ver superposicion con construccion
        if (this.superposicion(x, y, construccion.x, construccion.y)) {
        this.sortearAgua();
        } else {
        this.x = x;
        this.y = y;
        }
    }
    //espacio entre objetos para que no se superpongan
    this.superposicion = function(x1, y1, x2, y2) {
        let espacio = 330;
    
        return Math.abs(x1 - x2) < espacio && Math.abs(y1 - y2) < espacio;
    }

    this.colision=function(){
        if(
            (this.x<personajeUno.x+personajeUno.ancho)
            &&(this.x>personajeUno.x-this.ancho)
            &&(this.y>personajeUno.y-this.alto)
            &&(this.y<personajeUno.y+personajeUno.alto)
        ){
            
            switch(this.tipo){
                case "escudo":
                    puntos++;
                    this.sortear();
                    audioPuntos.play();
                break;
                case "escudo1":
                    puntos++;
                    this.sortear();
                    audioPuntos.play();
                break;
                case "chori":
                    vidas++;
                    this.sortearChori();
                    audioVidas.play();
                break;
                case "construccion":
                    vidas--;
                    this.sortearConstruccion();
                    audioPerdida1.play();
                break;
                case "agua":
                    vidas--;
                    this.sortearAgua();
                    audioPerdida2.play();
                break;
            }   
        }
    }
}

//acciones
document.addEventListener("keydown",function(e){
    switch (e.key){
        case "ArrowUp":
        personajeUno.saltar();
        break;
        case "ArrowDown":
        personajeUno.agacharse();        
        break;
    }
});
document.addEventListener("keydown",function(e){
 
    switch(e.code){
        case "ArrowLeft":
            personajeUno.izquierda();
        break;
        case "ArrowRight":
            personajeUno.derecha();
        break;
    }
});

//reinicio de juego
document.addEventListener("click", function(e){
    if(iniciar == false){
        if(e.x>250&&e.x<500&&e.y>370&&e.y<440){
            
            vidas=3;
            puntos=0;
            segundos=30;
            //pos inicial pj
            personajeUno.x=posXPer;
            personajeUno.y=posYPer;
            //pos inicial elementos
            agua.x=posXa;
            agua.y=posYa;
            construccion.x=posXco;
            construccion.y=posYco;
            chori.x=posXch;
            chori.y=posYch;
            escudo.x=posXe;
            escudo.y=posYe;
            escudo1.xposXe1;
            escudo1.yposYe1;   
        }else{
            return;
        }
        dibujar();
    }
});
document.addEventListener("keydown", function(e){
    if(iniciar == false){        
        switch(e.key) {   
            case " ":
                vidas=3;
                puntos=0;
                segundos=30;
                //pos inicial pj
                personajeUno.x=posXPer;
                personajeUno.y=posYPer;
                //pos inicial elementos
                agua.x=posXa;
                agua.y=posYa;
                construccion.x=posXco;
                construccion.y=posYco;
                chori.x=posXch;
                chori.y=posYch;
                escudo.x=posXe;
                escudo.y=posYe;
                escudo1.xposXe1;
                escudo1.yposYe1;
                dibujar();   
            default:
                return;
        }
    }
});

document.addEventListener("mousemove", function(e){

    if(vidas==0 || iniciar == false || segundos == 0){
		if(e.x>200&&e.x<560&&e.y>370&&e.y<440){
			canvas.style.cursor="pointer";
        } else {
            canvas.style.cursor=""; 
        }
    }
}); 

function redibujar(){
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    dibujarTexto();
    chori.dibuja();
    escudo.dibuja();
    escudo1.dibuja();
    agua.dibuja();
    construccion.dibuja();
    choriIcono.dibuja();
    escudoIcono.dibuja();
}

function borrar(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
}