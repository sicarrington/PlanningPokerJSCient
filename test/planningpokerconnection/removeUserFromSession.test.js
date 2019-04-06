import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'


describe('remove user from session', function () {
    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeEach(() => {

    });

    test("request message is correctly compiled", done => {
        var sessionId = "938485";
        var userId = "7898";
        var userToRemoveId = "8385755";
        var userToken = "09876162";

        var expectedRequestMessage = "PP 1.0\nMessageType:RemoveUserFromSessionMessage\nSessionId:" + sessionId +
            "\nUserId:" + userId + "\nUserToRemoveId:" + userToRemoveId + "\nToken:" + userToken;

        mockServer.on('connection', socket => {
            socket.on('message', message => {
                expect(message).toEqual(expectedRequestMessage);
                done();
            });
        });

        //Mock item in cache before leaving
        const userCache = {
            id: userId,
            name: "john",
            isHost: true,
            isObserver: false,
            token: userToken
        }
        localStorage.setItem(sessionId, JSON.stringify(userCache));


        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({});
        pp.removeUserFromSession(sessionId, userId, userToRemoveId);
    });
});