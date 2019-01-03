import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'


describe('new session response', function () {
    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeEach(() => {

    });

    test('createSessionSuccessCallback is called when new session is succesful', done => {

        var message = "MessageType:NewSessionResponse\nSuccess:true\nSessionId:12345\nUserId:7898\nToken:098765\n";

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(message);
            });
        });

        function callback(sessionId) {
            expect(sessionId).toBe("12345");
            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
        });
        pp.createSession("7898", {
            createSessionSuccessCallback: callback
        });
    });

    test("user information is cached to localsession when session is succesful", () => {
        var message = "MessageType:NewSessionResponse\nSuccess:true\nSessionId:12345\nUserId:7898\nToken:098765\n";

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(message);
            });
        });



        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
        });
        pp.createSession("7898", {
            //createSessionSuccessCallback: callback
        });

        const userCache = {
            id: "7898",
            name: "",
            isHost: true,
            isObserver: false,
            token: "098765"
        }

        expect(localStorage.getItem("12345")).toEqual(JSON.stringify(userCache))
    });

    test('createSessionErrorCallback is called when session creation errors', done => {
        var message = "MessageType:NewSessionResponse\nSuccess:false\n";

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(message);

            });
        });

        function callback() {
            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
        });
        pp.createSession("7898", {
            createSessionErrorCallback: callback
        });
    });
});