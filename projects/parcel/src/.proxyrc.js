const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const createMockMiddleware = () => {
  const mockPath = path.join(__dirname, 'mock.json');
  const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
  
  return (req, res, next) => {
    const key = `${req.method.toLowerCase()} ${req.url ?? ''}`;
    
    if (mockData[key]) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(mockData[key]));
    } else {
      next();
    }
  };
};

module.exports = function (app) {
  app.use(
    '/postman',
    createProxyMiddleware({
      target: 'https://postman-echo.com/',
      pathRewrite: {
        '^/postman': ''
      }
    })
  );

  // 添加 mock 数据的路由中间件
  app.use(createMockMiddleware());
}; 