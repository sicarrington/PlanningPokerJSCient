import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'

describe('start connection', function () {

    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);

    test('successCallback is called when succesful', done => {

        function callback() {
            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
            successCallback: callback
        });

    });

    test('errorCallback is called when error occurs', done => {

        var errorData = "Bad stuff happened";

        mockServer.on('connection', socket => {
            mockServer.emit('error', errorData);
        });

        function callback(data) {
            expect(data).toBe(errorData);
            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
            errorCallback: callback,
        });
    });

    test('closeCallback is called when socket closes', done => {

        mockServer.on('connection', socket => {
            socket.close();
        });

        function callback() {
            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
            closeCallback: callback,
        });
    });

});