//Variáveis

var trex, trex_running,trex_colided;
var edges;
var ground, groundImage;
var InvisibleGround;
var cloud, cloudImage;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var Score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameover , gameoverI;
var restart,restatI;

//var mensagem="esta e uma mensagem";

var check ,die,jump;
//Pre carregamento de imagens para criar uma animação em sprites
function preload() {
  //trex
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  
  trex_colided = loadAnimation("trex_collided.png");
  //chão
  groundImage = loadImage("ground2.png");

  //nuvem
  cloudImage = loadImage("cloud.png");

  //obstaculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  restartI = loadImage("restart.png");

  gameoverI = loadImage("gameOver.png");

  die =loadSound("die.mp3");
  check =loadSound("checkPoint.mp3");
  jump =loadSound("jump.mp3");
}


//Configuração
function setup() {
  //Criando a área do jogo
  createCanvas(windowWidth,windowHeight);
  
  //console.log (mensagem);
  //chão invisivel 
  InvisibleGround = createSprite(width/2, height-10, width, 10);
  InvisibleGround.visible = false;

  //criando grupos de obstáculos e nuvens
  obstaculoG = new Group();
  nuvenG = new Group();

  //console.log("olá" + 5);

  //criando o trex
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trex_running);

  trex.addAnimation("collided",trex_colided);
  trex.scale = 0.5;

  //Criando as bordas para a área do jogo
  edges = createEdgeSprites();

  //CRIANDO UM SOLO
  ground = createSprite(width/2, height-20,width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

 gameover = createSprite(width/2,height/2);
 gameover.addImage(gameoverI);
 gameover.scale = 0.5;
 gameover.visible = false;

 restart = createSprite(width/2,height/2+40);
 restart.addImage(restartI);
 restart.scale = 0.5;
 restart.visible = false;
  //números aleatórios
  //var teste = Math.round(random(1, 100));
  //console.log(teste);
 trex.setCollider("circle",0,0,40);
 //trex.debug = true;
}


function draw() {

  background("white");
textSize(20);
  //console.log (mensagem);
  //como exibir texto para jogadores 
  //para aparecer o tempo todo tem que deixar dentro de function draw
  text("pontuação: " + Score, width-200, 50);
  //console.log("isto e",gameState);

  if (gameState === PLAY) {
    //mover o solo 
    ground.velocityX = -(6+Score/1000);

    //pontuação
    Score = Score + Math.round(getFrameRate() / 60);

    if(Score>0&&Score%100===0){
      check.play();
    }
    //Recarregando o chão
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //Fazer o trex pular e voltar (resolução do bug)
    if (touches.length>0|| keyDown("space")) {
      if(trex.y>=height-40){
      trex.velocityY = -10;
      jump.play();
      touches=[];
    }
    }
    //Gravidade
    trex.velocityY = trex.velocityY + 0.5;
    //chamando as funções para ter nuvens e cactus
    criarNuvem();
    criarobstaculos();

    if (obstaculoG.isTouching(trex)) {
    //trex.velocityY = -10;
    //jump.play();
    gameState = END;
     die.play();
    }
    }

    else if (gameState === END) {
    //parar o solo
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_colided);
    //zerar a velocidade do grupo 
    obstaculoG.setVelocityXEach(0);
    nuvenG.setVelocityXEach(0);

 obstaculoG.setLifetimeEach(-1);
 nuvenG.setLifetimeEach(-1);

 restart.visible = true;
 gameover.visible = true;

 if(mousePressedOver(restart)||touches.length>0){
   touches = [];
   gamereset();
 }
  }

  trex.collide(InvisibleGround);
  drawSprites();
}

function gamereset(){
  gameState = PLAY;
  restart.visible = false;
  gameover.visible = false;
  nuvenG.destroyEach();
  obstaculoG.destroyEach();
  trex.changeAnimation("running",trex_running);
  Score = 0;
}



function criarobstaculos() {
  //a cada 60 quadros cria-se um cactu
  if (frameCount % 60 == 0) {
    //criando o cactu (sprite)
    var obstaculo = createSprite(width+10, height-35, 10, 40);
    //velocidade
    obstaculo.velocityX = -(6+Score/1000);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));

    switch (rand) {
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
    //atribuir dimensão e tempo de vida ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width+10;

    //adicione cada obstáculo ao grupo
    obstaculoG.add(obstaculo);
  }
}

function criarNuvem() {
   //a cada 60 quadros cria-se uma nuvem 
  if (frameCount % 60 == 0) {
    //sprite nuvem
    cloud = createSprite(width+10, height-100, 10, 10);
    //aleatoriedade da altura da nuvem
    cloud.y = Math.round(random(height-150, height-100));
    //imagem, scale, velocidade
    cloud.addImage("nuvem", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //tempo de vida 
    cloud.lifetime = width+10;

    //profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //consoles para exibir velocidade
    // console.log(cloud.depth);
    // console.log(trex.depth);

    //adicionar nuvem ao grupo
    nuvenG.add(cloud);

  }
}
