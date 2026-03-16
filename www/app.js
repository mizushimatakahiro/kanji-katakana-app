/* =========================================================
   小学生の学習アプリ - メインスクリプト
   ========================================================= */

// ===== データ定義 =====

const KATAKANA_LIST = [
  'ア','イ','ウ','エ','オ',
  'カ','キ','ク','ケ','コ',
  'サ','シ','ス','セ','ソ',
  'タ','チ','ツ','テ','ト',
  'ナ','ニ','ヌ','ネ','ノ',
  'ハ','ヒ','フ','ヘ','ホ',
  'マ','ミ','ム','メ','モ',
  'ヤ','ユ','ヨ',
  'ラ','リ','ル','レ','ロ',
  'ワ','ヲ','ン'
];

const KATAKANA_STROKES = {
  'ア':2,'イ':2,'ウ':3,'エ':3,'オ':3,
  'カ':2,'キ':4,'ク':2,'ケ':3,'コ':2,
  'サ':3,'シ':3,'ス':2,'セ':2,'ソ':2,
  'タ':3,'チ':3,'ツ':3,'テ':3,'ト':2,
  'ナ':2,'ニ':2,'ヌ':2,'ネ':4,'ノ':1,
  'ハ':2,'ヒ':2,'フ':1,'ヘ':2,'ホ':4,
  'マ':2,'ミ':3,'ム':2,'メ':2,'モ':3,
  'ヤ':3,'ユ':2,'ヨ':3,
  'ラ':2,'リ':2,'ル':2,'レ':1,'ロ':3,
  'ワ':2,'ヲ':3,'ン':2
};

const KANJI_LIST = [
  {kanji:'一',reading:'いち'},{kanji:'二',reading:'に'},{kanji:'三',reading:'さん'},
  {kanji:'四',reading:'よん'},{kanji:'五',reading:'ご'},{kanji:'六',reading:'ろく'},
  {kanji:'七',reading:'なな'},{kanji:'八',reading:'はち'},{kanji:'九',reading:'きゅう'},
  {kanji:'十',reading:'じゅう'},{kanji:'百',reading:'ひゃく'},{kanji:'千',reading:'せん'},
  {kanji:'上',reading:'うえ'},{kanji:'下',reading:'した'},{kanji:'左',reading:'ひだり'},
  {kanji:'右',reading:'みぎ'},{kanji:'中',reading:'なか'},{kanji:'大',reading:'おおきい'},
  {kanji:'小',reading:'ちいさい'},{kanji:'月',reading:'つき'},{kanji:'日',reading:'ひ'},
  {kanji:'年',reading:'とし'},{kanji:'早',reading:'はやい'},{kanji:'木',reading:'き'},
  {kanji:'林',reading:'はやし'},{kanji:'森',reading:'もり'},{kanji:'山',reading:'やま'},
  {kanji:'川',reading:'かわ'},{kanji:'土',reading:'つち'},{kanji:'空',reading:'そら'},
  {kanji:'田',reading:'た'},{kanji:'天',reading:'てん'},{kanji:'生',reading:'いきる'},
  {kanji:'花',reading:'はな'},{kanji:'草',reading:'くさ'},{kanji:'虫',reading:'むし'},
  {kanji:'犬',reading:'いぬ'},{kanji:'人',reading:'ひと'},{kanji:'名',reading:'なまえ'},
  {kanji:'女',reading:'おんな'},{kanji:'男',reading:'おとこ'},{kanji:'子',reading:'こ'},
  {kanji:'目',reading:'め'},{kanji:'耳',reading:'みみ'},{kanji:'口',reading:'くち'},
  {kanji:'手',reading:'て'},{kanji:'足',reading:'あし'},{kanji:'見',reading:'みる'},
  {kanji:'音',reading:'おと'},{kanji:'力',reading:'ちから'},{kanji:'気',reading:'げんき'},
  {kanji:'円',reading:'えん'},{kanji:'玉',reading:'たま'},{kanji:'王',reading:'おう'},
  {kanji:'正',reading:'ただしい'},{kanji:'出',reading:'でる'},{kanji:'立',reading:'たつ'},
  {kanji:'入',reading:'はいる'},{kanji:'休',reading:'やすむ'},{kanji:'先',reading:'さき'},
  {kanji:'夕',reading:'ゆう'},{kanji:'本',reading:'ほん'},{kanji:'文',reading:'ぶん'},
  {kanji:'字',reading:'じ'},{kanji:'学',reading:'がく'},{kanji:'校',reading:'こう'},
  {kanji:'村',reading:'むら'},{kanji:'町',reading:'まち'},{kanji:'石',reading:'いし'},
  {kanji:'竹',reading:'たけ'},{kanji:'糸',reading:'いと'},{kanji:'貝',reading:'かい'},
  {kanji:'車',reading:'くるま'},{kanji:'金',reading:'きん'},{kanji:'雨',reading:'あめ'},
  {kanji:'赤',reading:'あか'},{kanji:'青',reading:'あお'},{kanji:'白',reading:'しろ'},
  {kanji:'水',reading:'みず'},{kanji:'火',reading:'ひ'},{kanji:'目',reading:'め'},
];

// ===== ユーティリティ =====

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWrongKanji() {
  try {
    return JSON.parse(localStorage.getItem('wrongKanji') || '{}');
  } catch { return {}; }
}

function saveWrongKanji(data) {
  localStorage.setItem('wrongKanji', JSON.stringify(data));
}

// ===== Canvas描画ヘルパー =====

function setupCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);
  return ctx;
}

function drawGuideLines(ctx, w, h) {
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  // 十字のガイド線
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawBgChar(ctx, char, w, h) {
  ctx.fillStyle = 'rgba(200, 200, 200, 0.25)';
  ctx.font = `bold ${w * 0.75}px 'Zen Maru Gothic', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, w / 2, h / 2);
}

function initDrawing(canvas, ctx) {
  let drawing = false;
  const w = parseFloat(canvas.style.width);
  const h = parseFloat(canvas.style.height);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = '#4a1464';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  function draw(e) {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw(e) {
    e.preventDefault();
    drawing = false;
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', endDraw, { passive: false });

  return { w, h };
}

// ===== 紙吹雪 & 祝福 =====

function celebrate(callback) {
  const overlay = document.getElementById('celebration-overlay');
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  overlay.classList.remove('hidden');

  // 紙吹雪を生成
  const colors = ['#e91e9b','#ce93d8','#f48fb1','#b39ddb','#ffab91','#f06292','#9c27b0','#7e57c2'];
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = Math.random() * 300 - 50 + 'px';
    conf.style.top = Math.random() * -50 + 'px';
    conf.style.animationDelay = Math.random() * 0.5 + 's';
    conf.style.width = (6 + Math.random() * 8) + 'px';
    conf.style.height = (6 + Math.random() * 8) + 'px';
    container.appendChild(conf);
  }

  setTimeout(() => {
    overlay.classList.add('hidden');
    if (callback) callback();
  }, 2000);
}

// ===== アプリ本体 =====

const App = {
  currentScreen: 'home',

  goTo(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(screen + '-screen');
    if (el) {
      el.classList.add('active');
      this.currentScreen = screen;
    }

    // 画面初期化
    if (screen === 'katakana') this.katakana.init();
    if (screen === 'kanji') this.kanji.init();
    if (screen === 'test') this.test.init();
    if (screen === 'wrong') this.wrong.init();
  },

  // ===== カタカナモード =====
  katakana: {
    current: null,
    ctx: null,
    canvas: null,
    canvasW: 300,
    canvasH: 300,
    queue: [],

    init() {
      this.queue = shuffle(KATAKANA_LIST);
      this.canvas = document.getElementById('katakana-canvas');
      this.ctx = setupCanvas(this.canvas);
      const dims = initDrawing(this.canvas, this.ctx);
      this.canvasW = dims.w;
      this.canvasH = dims.h;
      this.showNext();
    },

    showNext() {
      if (this.queue.length === 0) {
        this.queue = shuffle(KATAKANA_LIST);
      }
      this.current = this.queue.pop();
      document.getElementById('katakana-display').textContent = this.current;
      const strokes = KATAKANA_STROKES[this.current] || '?';
      document.getElementById('katakana-stroke-info').textContent = `かくすう: ${strokes}かく`;
      document.getElementById('katakana-hint').classList.remove('hidden');
      this.clearCanvas();
    },

    clearCanvas() {
      const ctx = this.ctx;
      const w = this.canvasW;
      const h = this.canvasH;
      ctx.clearRect(0, 0, w * 2, h * 2);
      drawGuideLines(ctx, w, h);
      drawBgChar(ctx, this.current, w, h);
    },

    check() {
      // ピクセルカバレッジで簡易チェック
      const ctx = this.ctx;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(this.canvasW * dpr);
      const h = Math.floor(this.canvasH * dpr);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      let drawnPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        // 黒っぽいピクセル（ユーザーの描画）をカウント
        if (data[i] < 80 && data[i+1] < 80 && data[i+2] < 80 && data[i+3] > 200) {
          drawnPixels++;
        }
      }

      const totalPixels = w * h;
      const coverage = drawnPixels / totalPixels;

      if (coverage > 0.005) {
        // 少しでも書いていたらOK（子供向けなので寛大に）
        document.getElementById('katakana-hint').classList.add('hidden');
        celebrate();
      } else {
        document.getElementById('katakana-hint').textContent = 'もっと かいてみよう！';
      }
    },

    next() {
      this.showNext();
    }
  },

  // ===== 漢字モード =====
  kanji: {
    current: null,
    writer: null,
    queue: [],

    init() {
      this.queue = shuffle([...KANJI_LIST]);
      this.showNext();
    },

    showNext() {
      if (this.queue.length === 0) {
        this.queue = shuffle([...KANJI_LIST]);
      }
      this.current = this.queue.pop();
      document.getElementById('kanji-reading').textContent = this.current.reading;

      // HanziWriter を初期化
      const container = document.getElementById('kanji-writer-container');
      container.innerHTML = '';

      try {
        this.writer = HanziWriter.create(container, this.current.kanji, {
          width: 280,
          height: 280,
          padding: 10,
          showOutline: true,
          showCharacter: false,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 300,
          strokeColor: '#333',
          outlineColor: '#ddd',
          highlightColor: '#9c27b0',
          drawingColor: '#4a1464',
          drawingWidth: 6,
          showHintAfterMisses: 2,
          highlightOnComplete: true,
          charDataLoader: function(char, onLoad, onError) {
            const url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' +
                        encodeURIComponent(char) + '.json';
            fetch(url)
              .then(r => r.json())
              .then(onLoad)
              .catch(onError);
          }
        });

        // クイズモードで開始
        this.writer.quiz({
          onComplete: (summaryData) => {
            celebrate();
          }
        });
      } catch (err) {
        container.innerHTML = `
          <div style="text-align:center;padding:20px;">
            <div style="font-size:5em;font-weight:900;">${this.current.kanji}</div>
            <p style="color:#999;margin-top:10px;">このかんじは れんしゅうモードに たいおうしていません</p>
          </div>`;
      }
    },

    reset() {
      if (this.writer) {
        const container = document.getElementById('kanji-writer-container');
        container.innerHTML = '';
        this.writer = HanziWriter.create(container, this.current.kanji, {
          width: 280,
          height: 280,
          padding: 10,
          showOutline: true,
          showCharacter: false,
          strokeColor: '#333',
          outlineColor: '#ddd',
          highlightColor: '#9c27b0',
          drawingColor: '#4a1464',
          drawingWidth: 6,
          showHintAfterMisses: 2,
          highlightOnComplete: true,
          charDataLoader: function(char, onLoad, onError) {
            const url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' +
                        encodeURIComponent(char) + '.json';
            fetch(url)
              .then(r => r.json())
              .then(onLoad)
              .catch(onError);
          }
        });
        this.writer.quiz({
          onComplete: () => celebrate()
        });
      }
    },

    showHint() {
      if (this.writer) {
        // アニメーション表示してからクイズに戻る
        const container = document.getElementById('kanji-writer-container');
        container.innerHTML = '';
        this.writer = HanziWriter.create(container, this.current.kanji, {
          width: 280,
          height: 280,
          padding: 10,
          showOutline: true,
          showCharacter: false,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 400,
          strokeColor: '#9c27b0',
          outlineColor: '#e1bee7',
          charDataLoader: function(char, onLoad, onError) {
            const url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' +
                        encodeURIComponent(char) + '.json';
            fetch(url)
              .then(r => r.json())
              .then(onLoad)
              .catch(onError);
          }
        });
        this.writer.animateCharacter({
          onComplete: () => {
            setTimeout(() => this.reset(), 800);
          }
        });
      }
    },

    next() {
      this.showNext();
    }
  },

  // ===== テストモード =====
  test: {
    questions: [],
    currentIndex: 0,
    score: 0,
    wrongList: [],
    ctx: null,
    canvas: null,
    canvasW: 300,
    canvasH: 300,

    init() {
      // 重複を除いたリストから20問選ぶ
      const unique = [];
      const seen = new Set();
      for (const item of KANJI_LIST) {
        if (!seen.has(item.kanji)) {
          seen.add(item.kanji);
          unique.push(item);
        }
      }
      this.questions = shuffle(unique).slice(0, 20);
      this.currentIndex = 0;
      this.score = 0;
      this.wrongList = [];

      this.canvas = document.getElementById('test-canvas');
      this.ctx = setupCanvas(this.canvas);
      const dims = initDrawing(this.canvas, this.ctx);
      this.canvasW = dims.w;
      this.canvasH = dims.h;

      this.showQuestion();
    },

    showQuestion() {
      const q = this.questions[this.currentIndex];
      document.getElementById('test-progress').textContent =
        `${this.currentIndex + 1} / ${this.questions.length}`;
      document.getElementById('test-reading').textContent = q.reading;
      document.getElementById('test-answer-area').classList.add('hidden');
      this.clearCanvas();
    },

    clearCanvas() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvasW * 2, this.canvasH * 2);
      drawGuideLines(ctx, this.canvasW, this.canvasH);
    },

    showAnswer() {
      const q = this.questions[this.currentIndex];
      document.getElementById('test-answer-kanji').textContent = q.kanji;
      document.getElementById('test-answer-area').classList.remove('hidden');
    },

    answer(correct) {
      const q = this.questions[this.currentIndex];

      if (correct) {
        this.score++;
      } else {
        this.wrongList.push(q);
        // 間違えた漢字をlocalStorageに保存
        const wrong = getWrongKanji();
        const key = q.kanji;
        wrong[key] = {
          reading: q.reading,
          count: (wrong[key]?.count || 0) + 1
        };
        saveWrongKanji(wrong);
      }

      this.currentIndex++;
      if (this.currentIndex < this.questions.length) {
        this.showQuestion();
      } else {
        this.showResult();
      }
    },

    showResult() {
      App.goTo('result');
      const scoreEl = document.getElementById('result-score');
      const msgEl = document.getElementById('result-message');
      const detailsEl = document.getElementById('result-details');

      scoreEl.textContent = `${this.score} / ${this.questions.length}`;

      if (this.score === this.questions.length) {
        msgEl.textContent = 'すごい！ かんぺき！🎉';
      } else if (this.score >= this.questions.length * 0.8) {
        msgEl.textContent = 'とても よく できました！';
      } else if (this.score >= this.questions.length * 0.5) {
        msgEl.textContent = 'がんばったね！';
      } else {
        msgEl.textContent = 'つぎは もっと がんばろう！';
      }

      // 結果詳細
      let html = '';
      for (const q of this.questions) {
        const isWrong = this.wrongList.some(w => w.kanji === q.kanji);
        html += `<div class="result-item ${isWrong ? 'wrong' : 'correct'}">
          <span>${isWrong ? '❌' : '⭕'} ${q.kanji}（${q.reading}）</span>
        </div>`;
      }
      detailsEl.innerHTML = html;

      if (this.score === this.questions.length) {
        celebrate();
      }
    }
  },

  // ===== 間違えた漢字 =====
  wrong: {
    init() {
      const wrong = getWrongKanji();
      const listEl = document.getElementById('wrong-list');
      const clearBtn = document.getElementById('clear-wrong-btn');
      const entries = Object.entries(wrong);

      if (entries.length === 0) {
        listEl.innerHTML = '<p class="empty-message">まちがえた かんじは まだ ないよ！</p>';
        clearBtn.style.display = 'none';
        return;
      }

      clearBtn.style.display = 'block';

      // 間違い回数でソート（多い順）
      entries.sort((a, b) => b[1].count - a[1].count);

      let html = '';
      for (const [kanji, data] of entries) {
        html += `<div class="wrong-item">
          <span class="wrong-kanji">${kanji}</span>
          <span class="wrong-reading">${data.reading}</span>
          <span class="wrong-count">${data.count}かい</span>
          <button class="wrong-practice-btn" onclick="App.wrong.practice('${kanji}')">れんしゅう</button>
        </div>`;
      }
      listEl.innerHTML = html;
    },

    practice(kanji) {
      // 漢字モードに移動して特定の漢字を練習
      const item = KANJI_LIST.find(k => k.kanji === kanji);
      if (item) {
        App.goTo('kanji');
        App.kanji.queue = [item];
        App.kanji.showNext();
      }
    },

    clearAll() {
      if (confirm('ほんとうに リセット しますか？')) {
        localStorage.removeItem('wrongKanji');
        this.init();
      }
    }
  }
};

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  // スクロール防止（描画中）
  document.body.addEventListener('touchmove', (e) => {
    if (e.target.tagName === 'CANVAS') {
      e.preventDefault();
    }
  }, { passive: false });
});
