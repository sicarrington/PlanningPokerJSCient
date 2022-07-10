import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'


describe('session ended', function () {
    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeEach(() => {

    });

    test("session ended callback is invoked when session is ended", done => {
        var sessionId = "938485";
        var responeMessage = "PP 1.0\nMessageType:SessionEndedMessage\nSessionId:" + sessionId;

        mockServer.on('connection', socket => {
            socket.on('message', message => {
                socket.send(responeMessage);
            });
        });

        //Mock item in cache before leaving
        const userCache = {
            id: 12345,
            name: "",
            isHost: false,
            isObserver: false,
            token: "8392862"
        }
        localStorage.setItem(sessionId, JSON.stringify(userCache));


        function callback(callbackSessionId) {
            expect(callbackSessionId).toBe(sessionId);

            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");

        pp.startConnection({
            sessionEndedCallback: callback
        });
        pp.createSession("john");
    });


    test("user information is cleared from localsession when session is ended", done => {
        var sessionId = "938485";
        var responeMessage = "PP 1.0\nMessageType:SessionEndedMessage\nSessionId:" + sessionId;

        mockServer.on('connection', socket => {
            socket.on('message', message => {
                socket.send(responeMessage);
            });
        });

        //Mock item in cache before leaving
        const userCache = {
            id: 12345,
            name: "",
            isHost: false,
            isObserver: false,
            token: "8392862"
        }
        localStorage.setItem(sessionId, JSON.stringify(userCache));

        var callbackCount = 0;

        function callback(callbackSessionId) {
            pp.sessionEndedCallback = null;
            callbackCount++;
            if(callbackCount > 1){
                return;
            }

            expect(localStorage.getItem(sessionId)).toBeNull();

            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");

        pp.startConnection({
            sessionEndedCallback: callback
        });
        pp.createSession("john");
    });
});