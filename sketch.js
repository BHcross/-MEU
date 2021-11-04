var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var imgReset, reset
var imgGameover,gameOver

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem, mecanica;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var musicaCheck,musicaDie, musicaJump

var pontuacao, resultado;


function preload(){
  
  imgReset = loadImage("restart.png");
  imgGameover = loadImage("gameOver.png");
  
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  musicaDie = loadSound("die.mp3");
  musicaCheck = loadSound("checkPoint.mp3");
  musicaJump = loadSound("jump.mp3");
  
  imagemdosolo = loadImage("ground2.png");
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -4;
  
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  pontuacao = 0;
    
  reset = createSprite(300,130,50,50);
  reset.addImage("chatchau", imgReset);
  reset.scale = 0.4;
  
  gameOver = createSprite(300,100,50,50);
  gameOver.addImage("oque eu quiser", imgGameover);
  gameOver.scale = 0.5;
}

function draw() {
  background(180);
  text("Pontuação: "+ pontuacao, 480,50);
  
  gerarNuvens();
  gerarObstaculos();
  trex.velocityY = trex.velocityY + 0.8

   
  if(estadoJogo === JOGAR){
    pontuacao = pontuacao + Math.round(frameCount/60);
    solo.velocityX = -(6+pontuacao/1000);
    reset.visible = false;
    gameOver.visible = false;
    
    if (grupodeobstaculos.isTouching(trex)){
     estadoJogo = ENCERRAR;
     console.log("Trex foi extinto")
     musicaDie.play();
     reset.visible = true;
     gameOver.visible = true;
     trex.changeAnimation("collided" , trex_colidiu);
     grupodeobstaculos.setLifetimeEach(-1);
     grupodenuvens.setLifetimeEach(-1); 

    }
    if(keyDown("space")&& trex.y >= 160) {
       trex.velocityY = -15;
       musicaJump.play();
    }
    if (solo.x < 0){
       solo.x = solo.width/2;
    }
  }
  
  else if(estadoJogo === ENCERRAR){  
    solo.velocityX = 0;
    trex.velocityY = 0; 
    grupodeobstaculos.setVelocityXEach(0);
    grupodenuvens.setVelocityXEach(0);


    if(mousePressedOver(reset)){
     voltar();
    }
  }

  if(keyDown("space")&& trex.y >= 170) {
     trex.velocityY = -15;
  }
  if (solo.x < 0){
     solo.x = solo.width/2;
  }
  trex.collide(soloinvisivel);
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
  var obstaculo = createSprite(650,165,10,40);
  obstaculo.velocityX = -(6+pontuacao/1000);
  var rand = Math.round(random(1,6));
  switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }   
  obstaculo.scale = 0.5;
  obstaculo.lifetime = 300;
  grupodeobstaculos.add(obstaculo); 
 }
}

function gerarNuvens() {
  if (frameCount % 60 === 0) {
    nuvem = createSprite(650,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    nuvem.lifetime = 230;
    nuvem.depth = trex.depth - 2;        
    grupodenuvens.add(nuvem);
  }
}

function voltar(){
  estadoJogo = JOGAR;
  reset.visible = false;
  gameOver.visible = false;
  grupodenuvens.destroyEach();
  grupodeobstaculos.destroyEach();
  trex.changeAnimation("running" , trex_correndo);
  pontuacao=0;
}