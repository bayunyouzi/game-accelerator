const fs = require('fs');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 8080);
const publicDir = path.join(__dirname, 'public');

const nodeInfo = {
  id: 'hk-01',
  name: '香港 APEX 节点',
  region: 'Hong Kong',
  city: 'Hong Kong',
  provider: 'Zeabur',
  publicIp: '43.128.8.167',
  host: '43.128.8.167',
  supportedGames: ['APEX'],
  status: 'online'
};

const supportedGames = [
  {
    id: 'apex',
    name: 'APEX Legends',
    processName: 'r5apex.exe',
    platform: 'EA / Steam',
    mode: 'mvp',
    status: 'supported'
  }
];

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(payload, null, 2));
}

function text(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(payload);
}

function serveStaticFile(response, filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8'
    };

    response.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(data);
  } catch (_error) {
    json(response, 404, { ok: false, error: 'File not found' });
  }
}

function getWsUrl(requestHeaders) {
  const protocol = requestHeaders['x-forwarded-proto'] || 'http';
  const wsProtocol = protocol === 'https' ? 'wss' : 'ws';
  const host = requestHeaders.host || `localhost:${PORT}`;
  return `${wsProtocol}://${host}/ws`;
}

function getBaseUrl(requestHeaders) {
  const protocol = requestHeaders['x-forwarded-proto'] || 'http';
  const host = requestHeaders.host || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

function getBasePayload(requestHeaders, clientCount) {
  return {
    ok: true,
    product: 'APEX 游戏加速器',
    version: '0.1.0-mvp',
    stage: 'mvp',
    supportedGames,
    node: nodeInfo,
    websocketUrl: getWsUrl(requestHeaders),
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    websocketClients: clientCount
  };
}

function getApexConfig(requestHeaders) {
  return {
    ok: true,
    game: supportedGames[0],
    node: nodeInfo,
    connection: {
      type: 'websocket-control',
      websocketUrl: getWsUrl(requestHeaders),
      healthUrl: `${getBaseUrl(requestHeaders)}/health`
    },
    clientPlan: {
      nextStep: 'windows-client',
      detectProcess: 'r5apex.exe',
      localProxyRequired: true,
      zeaburOnlyLimit: '当前只有 Zeabur 单节点，先完成控制链路与配置下发，暂不等同 UU/雷神 的完整加速能力'
    }
  };
}

const wss = new WebSocketServer({ noServer: true });

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (request.method === 'GET' && pathname === '/health') {
    return json(response, 200, {
      ok: true,
      service: 'apex-accelerator-mvp',
      node: nodeInfo,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  }

  if (request.method === 'GET' && pathname === '/api/status') {
    return json(response, 200, getBasePayload(request.headers, wss.clients.size));
  }

  if (request.method === 'GET' && pathname === '/api/games') {
    return json(response, 200, {
      ok: true,
      total: supportedGames.length,
      items: supportedGames
    });
  }

  if (request.method === 'GET' && pathname === '/api/nodes') {
    return json(response, 200, {
      ok: true,
      total: 1,
      items: [nodeInfo]
    });
  }

  if (request.method === 'GET' && pathname === '/api/config/apex') {
    return json(response, 200, getApexConfig(request.headers));
  }

  if (request.method === 'GET' && pathname === '/api/ws-info') {
    return json(response, 200, {
      ok: true,
      websocketUrl: getWsUrl(request.headers)
    });
  }

  if (request.method === 'GET' && (pathname === '/' || pathname === '/test')) {
    return serveStaticFile(response, path.join(publicDir, 'index.html'));
  }

  const safePath = path.normalize(path.join(publicDir, pathname));
  if (safePath.startsWith(publicDir) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    return serveStaticFile(response, safePath);
  }

  return text(response, 404, 'Not Found');
});

wss.on('connection', (socket, request) => {
  socket.isAlive = true;

  socket.send(
    JSON.stringify({
      type: 'welcome',
      message: '已连接到 APEX 游戏加速器 MVP 节点',
      node: nodeInfo,
      supportedGames,
      websocketUrl: getWsUrl(request.headers),
      timestamp: Date.now()
    })
  );

  socket.on('pong', () => {
    socket.isAlive = true;
  });

  socket.on('message', (rawMessage) => {
    const messageText = rawMessage.toString();
    let payload;

    try {
      payload = JSON.parse(messageText);
    } catch (_error) {
      socket.send(
        JSON.stringify({
          type: 'echo',
          message: messageText,
          timestamp: Date.now()
        })
      );
      return;
    }

    if (payload.type === 'ping') {
      socket.send(
        JSON.stringify({
          type: 'pong',
          timestamp: Date.now(),
          receivedAt: Date.now()
        })
      );
      return;
    }

    if (payload.type === 'latency_check') {
      socket.send(
        JSON.stringify({
          type: 'latency_result',
          sentAt: payload.timestamp || null,
          receivedAt: Date.now()
        })
      );
      return;
    }

    if (payload.type === 'get_status') {
      socket.send(
        JSON.stringify({
          type: 'status',
          payload: getBasePayload(request.headers, wss.clients.size)
        })
      );
      return;
    }

    if (payload.type === 'get_apex_config') {
      socket.send(
        JSON.stringify({
          type: 'apex_config',
          payload: getApexConfig(request.headers)
        })
      );
      return;
    }

    socket.send(
      JSON.stringify({
        type: 'ack',
        received: payload,
        timestamp: Date.now()
      })
    );
  });
});

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (url.pathname !== '/ws') {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (upgradedSocket) => {
    wss.emit('connection', upgradedSocket, request);
  });
});

const heartbeatInterval = setInterval(() => {
  for (const socket of wss.clients) {
    if (socket.isAlive === false) {
      socket.terminate();
      continue;
    }

    socket.isAlive = false;
    socket.ping();
  }
}, 30000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

server.listen(PORT, HOST, () => {
  console.log(`apex-accelerator-mvp listening on ${HOST}:${PORT}`);
});
