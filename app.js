const express = require('express');
const app = express();
const port = 3000;

// 'public' ディレクトリ内の静的ファイル(HTML, CSS, JS, MP3)を配信
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Music Visualizer server running at http://localhost:${port}`);
});
