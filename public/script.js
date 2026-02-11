const audio = document.getElementById('audio');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// キャンバスサイズ設定
canvas.width = 600;
canvas.height = 300;

let audioContext, analyser, source;

// ユーザーが再生ボタンを押したタイミングでAudioContextを初期化
//(最近のブラウザは自動再生をブロックするため、クリックイベント必須)
audio.addEventListener('play', () => {
  if (!audioContext) {
    setupAudio();
  }
  renderFrame();
});

function setupAudio() {
  // 1. オーディオコンテキスト作成
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // 2. 音源ソースの作成
  source = audioContext.createMediaElementSource(audio);

  // 3. アナライザー(分析機)の作成
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256; // データの細かさ(2の乗数)

  // 4. 配線をつなぐ: 音源 -> アナライザー -> 出力(スピーカー)
  source.connect(analyser);
  analyser.connect(audioContext.destination);
}

function renderFrame() {
  // 次の描画フレームを予約(ループ処理)
  requestAnimationFrame(renderFrame);

  // 周波数データを取得するための配列を準備
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // 現在の音のデータを配列に書き込む(0~255の数値が入る)
  analyser.getByteFrequencyData(dataArray);

  // 画面をクリア(前のフレームの絵を消す)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 棒グラフを描画
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i]; // 音量が大きいほど数値が大きい

    // 色の設定(音の高さiや音量barHeightで色を変える)
    const r = barHeight + (25 * (i/bufferLength));
    const g = 250 * (i/bufferLength);
    const b = 50;
    ctx.fillStyle = `rgb(${r},${g},${b})`;

    // 棒を描く(x, y,幅,高さ)
    // y座標は下から生えるように計算
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1; // 次の棒の位置へ
  }
}
