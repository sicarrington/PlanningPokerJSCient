import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection'


describe('new session response', function () {
    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);


    beforeEach(() => {



    });

    // test('Refresh session callback is called when session information stale notification is received', done => {

    //     var message = "MessageType:RefreshSession\nSuccess:true\nSessionId:12345\n";

    //     mockServer.on('connection', socket => {
    //         socket.on('message', () => {
    //             socket.send(message);
    //         });
    //     });

    //     function callback(sessionInformation) {
    //         console.log("** CALLBACK **");
    //         done();
    //     }

    //     var pp = new PlanningPokerConnection(fakeServerUrl, "", "");
    //     pp.startConnection({
    //     });
    //     pp.createSession("7898", {
    //         createSessionSuccessCallback: callback
    //     });
    // });

    test('TBD', () => {
        expect(true);
    })
});