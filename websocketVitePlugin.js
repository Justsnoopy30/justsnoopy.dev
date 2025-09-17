import injectSocketIO from './websocket-handler.js';

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server) {
        injectSocketIO(server.httpServer);
    }
};