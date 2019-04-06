import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'


describe('cast vote', function () {
    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeEach(() => {

    });

    test("request message is correctly compiled", done => {
        var sessionId = "938485";
        var userId = "7898";
        var userToken = "09876162";
        var isObserver = false;
        var userName = "John";
        var isHost = true;
        var vote = 1;

        var expectedRequestMessage = "PP 1.0\nMessageType:UpdateSessionMemberMessage\nSessionId:" + sessionId + "\nUserToUpdateId:" +
            userId + "\nUserId:" + userId + "\nUserName:" + userName + "\nVote:" + vote + "\nIsHost:" + isHost +
            "\nIsObserver:" + isObserver + "\nToken:" + userToken;

        mockServer.on('connection', socket => {
            socket.on('message', message => {
                expect(message).toEqual(expectedRequestMessage);
                done();
            });
        });

        //Mock item in cache before leaving
        const userCache = {
            id: userId,
            name: userName,
            isHost: isHost,
            isObserver: isObserver,
            token: userToken
        }
        localStorage.setItem(sessionId, JSON.stringify(userCache));


        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({});
        pp.castVote(sessionId, userId, userName, vote); ``
    });
});