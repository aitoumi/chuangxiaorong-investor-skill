'use strict';

const createApp = require('./src/app');

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`创小融投资人Skill 服务已启动，监听端口 ${PORT}`);
});
