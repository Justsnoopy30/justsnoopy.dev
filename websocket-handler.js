import { Server } from 'socket.io';
import pty from 'node-pty';

/* Terminal Code */
let terminals = {};
/* End Terminal Code */

const countLines = str => str.split('').filter(c => c === '\n').length;

/* Only works in dev rn */
/* See https://dev.to/theether0/sveltekit-with-socketio-and-nodejs-285h */
export default function injectSocketIO(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        /* Chat Page */
        let username = `User ${Math.round(Math.random() * 999999)}`;
        socket.emit('chat:name', username);

        socket.on('chat:message', (message) => {
            io.emit('chat:message', {
                from: username,
                message: message,
                time: new Date().toLocaleString()
            });
        });
        /* End Chat Page */


        /* Terminal Page */
        let terminalId;

        socket.on("terminal:connect", (_terminalId) => {
            if (terminals[_terminalId] != null) {
                terminalId = _terminalId;

                socket.join(terminalId);
                if (terminals[terminalId].output) {
                    socket.emit('terminal:output', terminals[terminalId].output);
                }
            }
        });

        socket.on('terminal:input', (input) => {
            if (terminals[terminalId] != null) {
                terminals[terminalId].process.write(input);
            }
        });

        socket.on('terminal:resize', (cols, rows) => {
            // Stub
        });
        /* End Terminal Page */
    });

    startProcess(io);
}

function startProcess(io) {
    // global.terminal = spawn('docker', ['container', 'exec', '-it', 'hyperhosted-container', '/bin/bash'], { env: {...process.env, FORCE_COLOR: true} });
    // global.terminal = spawn('deno', { env: {...process.env, FORCE_COLOR: true} });
    terminals["default"] = {
        process: pty.spawn('lxc', ['exec', 'hyperhosted-demo', '--', 'sudo', '--login', '--user', 'ubuntu'], {
            name: 'xterm-256color',
            cols: 80,
            rows: 24,
            cwd: process.env.PWD,
            env: process.env
        })
    };

    for (const terminalId in terminals) {
        const terminal = terminals[terminalId];

        terminal.process.on('data', function (output) {
            if (!terminal.output) terminal.output = '';

            terminal.output += output;

            const lineCount = countLines(terminal.output);
            if (lineCount >= 1000) {
                const newLines = terminal.output.split('\n').slice(lineCount - 1000).join('\n');
                terminal.output = newLines;
            }

            io.in(terminalId).emit('terminal:output', output);
        });

        terminal.process.on('exit', function (code) {
            delete (terminals[terminalId]);
            console.log(`Terminal ${terminalId} exited with status code ${code}`);
            console.log('Restarting terminal...');

            io.emit('clear terminal');
            io.emit('terminal output', `Terminal exited with status code ${code}\r\n`);
            io.emit('terminal output', 'Restarting terminal...\r\n');
            if (code === 0) {
                startProcess(io);
            } else {
                setTimeout(function () {
                    startProcess(io);
                }, 5000);
            }
        });
    }
}
