import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection';

import UserDetailCache from '../../src/UserDetailCache';
import PlanningPokerService from '../../src/PlanningPokerService';

const apiResponse = {
    "sessionId": "728526",
    "storyPointType": 2,
    "participants": [
        {
            "id": "210330a6-78d8-4ff2-8f84-cc078b4f7b25",
            "name": "Simon",
            "currentVote": 0,
            "sessionId": "728526",
            "isHost": true,
            "isObserver": false,
            "currentVoteDescription": "Not Voted"
        }
    ],
    "votingComplete": false
};

const mockGetSessionDetails = jest.fn();
mockGetSessionDetails.mockReturnValue(new Promise((resolve, reject) => {
    resolve(apiResponse);
}));
jest.mock('../../src/PlanningPokerService', () => {
    return jest.fn().mockImplementation(() => {
        return { getSessionDetails: mockGetSessionDetails };
    });
});

jest.mock('../../src/UserDetailCache');

describe('new session response', function () {


    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeAll(() => {

    });

    beforeEach(() => {

        mockGetSessionDetails.mockClear();
        PlanningPokerService.mockClear();
    });


    test('Session stale callback is called when session information stale notification is received', done => {

        var message = "MessageType:RefreshSession\nSuccess:true\nSessionId:12345\n";

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(message);
            });
        });

        function callback(sessionInformation) {
            expect(sessionInformation).toEqual(sessionInformation);
            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
            sessionStaleCallback: callback
        });
        pp.createSession("7898", {
        });
    });

    test('Planning poker service is called when session stale notification is received', done => {
        var expectedSessionId = "12345";
        var message = `MessageType:RefreshSession\nSuccess:true\nSessionId:${expectedSessionId}\n`;

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(message);
            });
        });

        function callback(sessionInformation) {

            expect(mockGetSessionDetails).toHaveBeenCalled();
            expect(mockGetSessionDetails.mock.calls[0][0]).toEqual(expectedSessionId);

            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
            sessionStaleCallback: callback
        });
        pp.createSession("7898", {
        });
    });



    test('User details are updated when session stale notification is received', done => {
        var expectedSessionId = "12345";
        var message = `MessageType:RefreshSession\nSuccess:true\nSessionId:${expectedSessionId}\n`;

        mockServer.on('connection', socket => {
            socket.on('message', () => {
                socket.send(message);
            });
        });

        function callback(sessionInformation) {

            const mockUserDetailCacheInstance = UserDetailCache.mock.instances[0];
            const mockSessionWasRefreshed = mockUserDetailCacheInstance.sessionWasRefreshed;

            expect(mockSessionWasRefreshed).toHaveBeenCalledTimes(1);
            expect(mockSessionWasRefreshed.mock.calls[0][0]).toEqual(apiResponse);

            done();
        }

        var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
        pp.startConnection({
            sessionStaleCallback: callback
        });
        pp.createSession("7898", {
        });
    });
});