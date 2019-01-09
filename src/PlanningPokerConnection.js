'use strict';

import { $, jQuery } from 'jquery';
import UserDetailCache from './UserDetailCache';
import PlanningPokerService from './PlanningPokerService';

export default class PlanningPokerConnection {

    constructor(connectionUrl, apiUrl, apiKey) {
        this.connectionUrl = connectionUrl;
        this.planningPokerService = new PlanningPokerService(apiUrl);
        this.apiKey = apiKey;

        this.createSessionSuccessCallback = null;
        this.createSessionErrorCallback = null;

        this.joinSessionSuccessCallback = null;
        this.joinSessionErrorCallback = null;

        this.subscribeSuccessCallback = null;
        this.subscribeErrorCallback = null;

        this.leaveSessionSuccessCallback = null;
        this.leaveSessionErrorCallback = null;

        this.userDetailCache = new UserDetailCache();
    }

    startConnection({
        successCallback = null,
        errorCallback = null,
        closeCallback = null,
        // messageCallback = null,
        sessionStaleCallback = null,
        sessionEndedCallback = null
    } = {}) {
        if ('WebSocket' in window) {
            var self = this;
            this._connection = new WebSocket(this.connectionUrl);
            this._connection.onopen = function () {
                if (successCallback !== null) {
                    successCallback();
                }
            }
            this._connection.onerror = function (error) {
                if (errorCallback !== null) {
                    errorCallback(error.data);
                }
            }
            this._connection.onclose = function () {
                if (closeCallback !== null) {
                    closeCallback();
                }
            },
                this._connection.onmessage = function (e) {
                    var server_message = e.data;

                    var match = server_message.match(/MessageType:(.*)$/im);
                    var messageType = match[1];

                    if (messageType === "NewSessionResponse") {
                        var successMatch = server_message.match(/Success:(.*)$/im);
                        var success = successMatch[1];
                        if (success === "true") {
                            var sessionIdMatch = server_message.match(/SessionId:(.*)$/im);
                            var sessionId = sessionIdMatch[1];

                            var userIdMatch = server_message.match(/UserId:(.*)$/im);
                            var userId = userIdMatch[1];
                            userId = userId.replace(/"/g, "");

                            var tokenMatch = server_message.match(/Token:(.*)$/im);
                            var token = tokenMatch[1];
                            token = token.replace(/"/g, "");

                            self.userDetailCache.cacheUserDetail(sessionId, userId, '', true, false, token);

                            if (self.createSessionSuccessCallback !== null) {
                                self.createSessionSuccessCallback(sessionId);
                            }
                        } else {
                            if (self.createSessionErrorCallback !== null) {
                                self.createSessionErrorCallback();
                            }
                        }
                    } else if (messageType === "RefreshSession") {
                        var sessionIdMatch = server_message.match(/SessionId:(.*)$/im);
                        var sId = sessionIdMatch[1];


                        self.planningPokerService.getSessionDetails(sId)
                            .then(response => {
                                self.userDetailCache.sessionWasRefreshed(response);
                                if (sessionStaleCallback !== null) {
                                    sessionStaleCallback(response);
                                }
                            });
                    }
                }
        }
    }

    createSession(userName, {
        createSessionSuccessCallback = null,
        createSessionErrorCallback = null
    } = {}) {

        this.createSessionSuccessCallback = createSessionSuccessCallback;
        this.createSessionErrorCallback = createSessionErrorCallback;

        var message = "PP 1.0\nMessageType:NewSession\nUserName:" + userName;
        this._connection.send(message);
    }

}