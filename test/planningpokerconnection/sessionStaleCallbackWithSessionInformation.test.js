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

const sessionInformationBase64Encoded = "eyJTZXNzaW9uSWQiOiJTZXNzaW9uSWRjMDAzYjY0MS1hMzhjLTQ5ZDYtYWFhNC1jMjAwZTVjYTc1ZDUiLCJTdG9yeVBvaW50VHlwZSI6NTksIlBhcnRpY2lwYW50cyI6W3siSWQiOiJJZDhhZjA2NjYxLWViZTUtNDRlZS1hOTQ4LTg5ZDI0MWExYTUzYSIsIk5hbWUiOiJOYW1lYTJkZWI5ZTEtZmQ0Zi00OTI4LWJkYjItOTYyNGE0YmY4NzVjIiwiQ3VycmVudFZvdGUiOjMsIlNlc3Npb25JZCI6IlNlc3Npb25JZDg5YTE4OTg1LWNjZTMtNGEwMS04OGMyLTUzYjVhMjlkMTA5NiIsIkN1cnJlbnRWb3RlRGVzY3JpcHRpb24iOiJDdXJyZW50Vm90ZURlc2NyaXB0aW9uOGM3MGY5MTItMDFmMC00ZWZmLThmYzctZjY5ODE3MzdhZDY1IiwiSXNIb3N0Ijp0cnVlLCJJc09ic2VydmVyIjpmYWxzZX0seyJJZCI6IklkMDdkMjc2ZWYtZGU4MS00MDE2LTg2YTMtMzBiYTI0NTVjYTEzIiwiTmFtZSI6Ik5hbWUxZDM1NTc0Yi1lZDFmLTQyNjYtOGU0Ny1iMDZiMGM0OTUxMmUiLCJDdXJyZW50Vm90ZSI6NCwiU2Vzc2lvbklkIjoiU2Vzc2lvbklkZTE0YTcwMjItYmJkYi00MjVhLWIxMTUtODU2ZDdlOGIyZjE5IiwiQ3VycmVudFZvdGVEZXNjcmlwdGlvbiI6IkN1cnJlbnRWb3RlRGVzY3JpcHRpb244OGQ2MjQ1NS1mZmMwLTQzZTYtYjllOC03MWJkOWZiYTA1Y2QiLCJJc0hvc3QiOnRydWUsIklzT2JzZXJ2ZXIiOmZhbHNlfSx7IklkIjoiSWQwMjFiZTZlOC01OTI3LTRkZTgtOGJkMi1hYzEyZjU1NzVhMjYiLCJOYW1lIjoiTmFtZTM1MTlhNGE0LWNiNGMtNGNhMi04MDllLTQ2M2IzNzllMDhmNyIsIkN1cnJlbnRWb3RlIjo1LCJTZXNzaW9uSWQiOiJTZXNzaW9uSWQwY2ZmZDk2NS02NmE1LTQyMTctOGJlYy1jOWM2NDI4NzI5ODgiLCJDdXJyZW50Vm90ZURlc2NyaXB0aW9uIjoiQ3VycmVudFZvdGVEZXNjcmlwdGlvbmI1ZDBiNGIyLTliOTAtNDU5Mi05ZGU0LTBkZjM4YWZiYjY2NyIsIklzSG9zdCI6dHJ1ZSwiSXNPYnNlcnZlciI6ZmFsc2V9XX0=";
const sessionInformationInMessageAsJson = {
    "SessionId":"SessionIdc003b641-a38c-49d6-aaa4-c200e5ca75d5",
    "StoryPointType":59,
    "Participants":[
       {
          "Id":"Id8af06661-ebe5-44ee-a948-89d241a1a53a",
          "Name":"Namea2deb9e1-fd4f-4928-bdb2-9624a4bf875c",
          "CurrentVote":3,
          "SessionId":"SessionId89a18985-cce3-4a01-88c2-53b5a29d1096",
          "CurrentVoteDescription":"CurrentVoteDescription8c70f912-01f0-4eff-8fc7-f6981737ad65",
          "IsHost":true,
          "IsObserver":false
       },
       {
          "Id":"Id07d276ef-de81-4016-86a3-30ba2455ca13",
          "Name":"Name1d35574b-ed1f-4266-8e47-b06b0c49512e",
          "CurrentVote":4,
          "SessionId":"SessionIde14a7022-bbdb-425a-b115-856d7e8b2f19",
          "CurrentVoteDescription":"CurrentVoteDescription88d62455-ffc0-43e6-b9e8-71bd9fba05cd",
          "IsHost":true,
          "IsObserver":false
       },
       {
          "Id":"Id021be6e8-5927-4de8-8bd2-ac12f5575a26",
          "Name":"Name3519a4a4-cb4c-4ca2-809e-463b379e08f7",
          "CurrentVote":5,
          "SessionId":"SessionId0cffd965-66a5-4217-8bec-c9c642872988",
          "CurrentVoteDescription":"CurrentVoteDescriptionb5d0b4b2-9b90-4592-9de4-0df38afbb667",
          "IsHost":true,
          "IsObserver":false
       }
    ]
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
   
    
    describe('when session stale message does include session information', function() {

        beforeAll(() => {

        });
    
        beforeEach(() => {
    
            mockGetSessionDetails.mockClear();
            PlanningPokerService.mockClear();
        });

        test('Session stale callback is called when session information stale notification is received', done => {

            var message = `MessageType:RefreshSession\nSuccess:true\nSessionId:12345\nSessionInformation:${sessionInformationBase64Encoded}\n`;

            mockServer.on('connection', socket => {
                socket.on('message', () => {
                    socket.send(message);
                });
            });

            function callback(sessionInformation) {
                expect(sessionInformation).toEqual(sessionInformationInMessageAsJson);
                done();
            }

            var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
            pp.startConnection({
                sessionStaleCallback: callback
            });
            pp.createSession("7898", {
            });
        });

        test('Planning poker service is not called when session stale notification is received', done => {
            var expectedSessionId = "12345";
            var message = `MessageType:RefreshSession\nSuccess:true\nSessionId:${expectedSessionId}\nSessionInformation:${sessionInformationBase64Encoded}\n`;

            mockServer.on('connection', socket => {
                socket.on('message', () => {
                    socket.send(message);
                });
            });

            function callback(sessionInformation) {

                expect(mockGetSessionDetails).toHaveBeenCalledTimes(0);

                done();
            }

            var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
            pp.startConnection({
                sessionStaleCallback: callback
            });
            pp.createSession("7898", {
            });
        });

        test('User details are updated from message when session stale notification is received', done => {
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
                expect(mockSessionWasRefreshed.mock.calls[0][0]).toEqual(sessionInformationInMessageAsJson);

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
});