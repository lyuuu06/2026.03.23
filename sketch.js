let grasses = []; // 用來儲存所有水草的陣列
let bubbles = []; // 用來儲存水泡的陣列

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let colors = ["#ff8fab", "#e4c1f9", "#d0f4de", "#fcf6bd", "#57cc99"]; // 指定顏色盤
  for (let i = 0; i < 50; i++) {
    grasses.push({
      x: random(width),           // 改為隨機位置，允許重疊
      color: random(colors),      // 隨機選取顏色
      noiseOffset: random(1000),  // 隨機的 noise 偏移
      w: random(30, 60),          // 線條寬度 30-60
      h: random(height * 0.2, height * 0.66), // 水草的高度
      freq: random(0.005, 0.02)   // 搖晃的頻率
    });
  }
}

function draw() {
  background("#ade8f4");
  blendMode(BLEND); // 設定混合模式，讓顏色自然混合
  noFill();

  for (let g of grasses) {
    strokeWeight(g.w); // 設定該根水草的粗細
    let c = color(g.color); // 將 hex 顏色字串轉換為 p5 顏色物件
    c.setAlpha(200);        // 設定透明度 (0-255)，200 較為不透明
    stroke(c);              // 使用帶有透明度的顏色進行繪製
    beginShape();
    let segments = 50;
    for (let i = 0; i <= segments; i++) {
      let y = map(i, 0, segments, height, height - g.h);
      let n = noise(frameCount * g.freq + i * 0.05 + g.noiseOffset); // 使用個別的頻率與偏移
      let xOffset = map(n, 0, 1, -100, 100) * (i / segments);
      
      if (i === 0) curveVertex(g.x + xOffset, y);
      curveVertex(g.x + xOffset, y);
      if (i === segments) curveVertex(g.x + xOffset, y);
    }
    endShape();
  }

  // ---------------- 水泡邏輯 ----------------
  if (random() < 0.05) { // 每幀約 5% 機率產生新水泡
    bubbles.push(new Bubble());
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].isDead()) {
      bubbles.splice(i, 1);
    }
  }
}

// 定義水泡類別
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + 20; // 從視窗底部下方生成
    this.size = random(10, 20);
    this.speed = random(2, 5);
    this.popY = random(height * 0.2, height * 0.8); // 設定隨機破掉的高度
    this.popping = false;
    this.popTimer = 0;
  }

  update() {
    if (!this.popping) {
      this.y -= this.speed;
      // 讓水泡隨著上升左右搖晃
      this.x += sin(frameCount * 0.1 + this.y * 0.02) * 1.5;
      
      // 當到達特定高度時，狀態設為破掉
      if (this.y < this.popY) {
        this.popping = true;
      }
    } else {
      this.popTimer++;
    }
  }

  display() {
    if (!this.popping) {
      stroke(255);
      strokeWeight(1);
      fill(255, 100);
      circle(this.x, this.y, this.size);
      // 畫高光
      noStroke();
      fill(255, 200);
      circle(this.x + this.size * 0.25, this.y - this.size * 0.25, this.size * 0.3);
    } else {
      // 破掉的效果：變大並淡出
      noFill();
      stroke(255, map(this.popTimer, 0, 10, 255, 0));
      strokeWeight(2);
      circle(this.x, this.y, this.size + this.popTimer * 4);
    }
  }

  isDead() {
    return (this.popping && this.popTimer > 10) || (this.y < -50);
  }
}
