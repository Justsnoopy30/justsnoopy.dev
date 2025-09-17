import ioClient from 'socket.io-client';

const ENDPOINT = 'https://justsnoopy.dev';
const socketSingleton = ioClient(ENDPOINT);

export const socket = socketSingleton;
