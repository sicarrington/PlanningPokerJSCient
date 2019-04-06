import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'


describe('new session response', function () {
    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeEach(() => {

    });

    test('joinSessionSuccessCallback is called when join session is succesful', done => {
        var sessionId = "938485";
        var userName = "FatherChristmas";
        var isObserver = false;
        var responeMessage = "PP 1.0\nMessageType:JoinSessionResponse\nSuccess:true\nSessionId:" + sessionId + "\nUserId:7898\nToken:8392862\n";

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(responeMessage);
            });
        });

        function callback(sessionId) {
            expect(sessionId).toBe(sessionId);
            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
        });
        pp.joinSession(sessionId, userName, isObserver, {
            joinSessionSuccessCallback: callback
        });
    });

    test("user information is cached to localsession when join session is succesful", () => {
        var sessionId = "938485";
        var userName = "FatherChristmas";
        var isObserver = false;
        var responeMessage = "PP 1.0\nMessageType:JoinSessionResponse\nSuccess:true\nSessionId:" + sessionId + "\nUserId:7898\nToken:8392862\n";

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(responeMessage);
            });
        });



        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({});
        pp.joinSession(sessionId, userName, isObserver, {});

        const userCache = {
            id: "7898",
            name: "",
            isHost: false,
            isObserver: false,
            token: "8392862"
        }

        expect(localStorage.getItem(sessionId)).toEqual(JSON.stringify(userCache))
    });

    test('joinSessionErrorCallback is called when join session errors', done => {
        var message = "MessageType:JoinSessionResponse\nSuccess:false\n";

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
        pp.joinSession("7898", "Fred", true, {
            joinSessionErrorCallback: callback
        });
    });

    test("request message is correctly compiled", done => {
        var sessionId = "938485";
        var userName = "John";
        var isObserver = true;

        var expectedRequestMessage = "PP 1.0\nMessageType:JoinSession\nUserName:" + userName + "\nSessionId:" + sessionId + "\nIsObserver:" + isObserver;

        mockServer.on('connection', socket => {
            socket.on('message', message => {
                expect(message).toEqual(expectedRequestMessage);
                done();
            });
        });

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({});
        pp.joinSession(sessionId, userName, isObserver, {});
    });
});