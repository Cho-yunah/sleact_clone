import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const backUrl = 'http://localhost:3095';
const sockets: { [key: string]: Socket } = {};

const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'], // 처음에 연결을 할 때 웹소켓만 사용하라고 지시할 수 있다.
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
