'use strict';

import { $, jQuery } from 'jquery';

export default class PlanningPokerConnection {

    constructor(connectionUrl, apiUrl, apiKey) {
        this.connectionUrl = connectionUrl;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;

        this.createSessionSuccessCallback = null;
        this.createSessionErrorCallback = null;

        this.joinSessionSuccessCallback = null;
        this.joinSessionErrorCallback = null;

        this.subscribeSuccessCallback = null;
        this.subscribeErrorCallback = null;

        this.leaveSessionSuccessCallback = null;
        this.leaveSessionErrorCallback = null;
    }

    cacheUserDetail(sessionId, userId, userName, isHost, isObserver, token) {
        const userCache = {
            id: userId,
            name: userName,
            isHost: isHost,
            isObserver: isObserver,
            token: token
        }
        localStorage.setItem(sessionId, JSON.stringify(userCache));
    }
    getUserToken(sessionId) {
        const userCache = localStorage.getItem(sessionId);
        return JSON.parse(userCache).token;
    }
    sessionWasRefreshed(sessionInformation) {
        const userCache = JSON.parse(localStorage.getItem(sessionInformation.sessionId));
        const userDetail = sessionInformation.participants.filter(function (a) {
            if (a.id == userCache.id) return a
        })[0];
        cacheUserDetail(sessionInformation.sessionId, userDetail.id, userDetail.name, userDetail.isHost, userDetail.isObserver, userCache.token);
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

                            self.cacheUserDetail(sessionId, userId, '', true, false, token);

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

                        if (sessionStaleCallback !== null) {
                        }
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