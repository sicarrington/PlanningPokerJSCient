import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'


describe('new session response', function () {
    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeEach(() => {

    });

    // test('subscribesessionSuccessCallback is called when subscribe session is succesful', done => {
    //     var sessionId = "938485";
    //     var userId = "7898";
    //     var userToken = "93848575";
    //     var responeMessage = "PP 1.0\nMessageType:SubscribeSessionResponse\nSuccess:true\nSessionId:" + sessionId;


    //     //Mock item in cache before leaving
    //     const userCache = {
    //         id: userId,
    //         name: "",
    //         isHost: false,
    //         isObserver: false,
    //         token: userToken
    //     }
    //     localStorage.setItem(sessionId, JSON.stringify(userCache));

    //     mockServer.on('connection', socket => {
    //         socket.on('message', () => {
    //             socket.send(responeMessage);
    //         });
    //     });

    //     function callback(callbackSessionId) {
    //         expect(callbackSessionId).toBe(sessionId);
    //         done();
    //     }

    //     var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
    //     pp.startConnection({
    //     });
    //     pp.subscribeSession(sessionId, userId, {
    //         leaveSessionSuccessCallback: callback
    //     });
    // });

    // test('subscribesessionErrorCallback is called when subscribe session errors', done => {
    //     var sessionId = "938485";
    //     var userId = "7898";
    //     var userToken = "93848575";
    //     var responeMessage = "PP 1.0\nMessageType:SubscribeSessionResponse\nSuccess:false\nSessionId:" + sessionId;

    //     mockServer.on('connection', socket => {
    //         socket.on('message', () => {
    //             socket.send(responeMessage);
    //         });
    //     });

    //     function callback(callbackSessionId) {
    //         expect(callbackSessionId).toBe(sessionId);
    //         done();
    //     }

    //     //Mock item in cache before leaving
    //     const userCache = {
    //         id: userId,
    //         name: "",
    //         isHost: false,
    //         isObserver: false,
    //         token: "8392862"
    //     }
    //     localStorage.setItem(sessionId, JSON.stringify(userCache));

    //     var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
    //     pp.startConnection({
    //     });
    //     pp.subscribeSession(sessionId, userId, {
    //         leaveSessionErrorCallback: callback
    //     });
    // });

    // test("session information is refreshed when subscribe session is succesful", done => {
    //     var sessionId = "938485";
    //     var userId = "7898";
    //     var responeMessage = "PP 1.0\nMessageType:SubscribeSessionResponse\nSuccess:true\nSessionId:" + sessionId + "\nUserId:" + userId + "\n";

    //     mockServer.on('connection', socket => {
    //         socket.on('message', message => {
    //             console.log('*****************************');
    //             console.log('Message', message);

    //             socket.send(responeMessage);
    //         });
    //     });

    //     //Mock item in cache before leaving
    //     const userCache = {
    //         id: userId,
    //         name: "",
    //         isHost: false,
    //         isObserver: false,
    //         token: "8392862"
    //     }
    //     localStorage.setItem(sessionId, JSON.stringify(userCache));


    //     function callback(callbackSessionId, callbackUserId) {
    //         expect(callbackSessionId).toBe(sessionId);
    //         expect(callbackUserId).toBe(userId);
    //         expect(localStorage.getItem(sessionId)).toBeNull();
    //         done();
    //     }

    //     var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
    //     pp.startConnection({});
    //     pp.subscribeSession(sessionId, userId, {
    //         leaveSessionSuccessCallback: callback
    //     });
    // });

    test("request message is correctly compiled", done => {
        var sessionId = "938485";
        var userId = "7898";
        var userToken = "09876162";

        var expectedRequestMessage = "PP 1.0\nMessageType:SubscribeMessage\nUserId:" + userId + "\nSessionId:" + sessionId + "\nToken:" + userToken;

        mockServer.on('connection', socket => {
            socket.on('message', message => {
                expect(message).toEqual(expectedRequestMessage);
                done();
            });
        });

        //Mock item in cache before leaving
        const userCache = {
            id: userId,
            name: "",
            isHost: false,
            isObserver: false,
            token: userToken
        }
        localStorage.setItem(sessionId, JSON.stringify(userCache));


        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({});
        pp.subscribeSession(sessionId, userId, {});
    });
});