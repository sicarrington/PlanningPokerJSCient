import { WebSocket, Server } from 'mock-socket';
import PlanningPokerConnection from '../../src/PlanningPokerConnection';
import PlanningPokerService from '../../src/PlanningPokerService';

describe('start connection', function () {

    jest.mock('../../src/PlanningPokerService');

    // console.log('PPSERVICE***********');
    // console.log(new PlanningPokerService());

    global.WebSocket = WebSocket;

    const fakeServerUrl = 'ws://localhost:8080';
    const mockServer = new Server(fakeServerUrl);
    const mockedMethodImpl = jest.fn();

    beforeAll(() => {

        PlanningPokerService.getSessionDetails = mockedMethodImpl;

        // PlanningPokerService.mockImplementation(() => {
        //     // Replace the class-creation method with this mock version.
        //     return {
        //         getSessionDetails: mockedMethodImpl // Populate the method with a reference to a mock created with jest.fn().
        //     };
        // });
    });

    beforeEach(() => {
        // PlanningPokerService.mockClear();
        mockedMethodImpl.mockClear();
    });

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

        // jest.genMockFromModule('PlanningPokerService');
        // jest.mock('PlanningPokerService');


        // const mockedMethod = jest.fn();


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