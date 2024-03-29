'use strict';

import UserDetailCache from './UserDetailCache';
import PlanningPokerService from './PlanningPokerService';

export default class PlanningPokerConnection {

    constructor(connectionUrl, apiUrl, apiKey) {
        this.connectionUrl = connectionUrl;
        this.planningPokerService = new PlanningPokerService(apiUrl, apiKey);
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
                    } else if (messageType === "JoinSessionResponse") {

                        var successMatch = server_message.match(/Success:(.*)$/im);
                        var success = successMatch[1];
                        if (success === "true") {

                            var sessionIdMatch = server_message.match(/SessionId:(.*)$/im);
                            sessionId = sessionIdMatch[1];

                            var userIdMatch = server_message.match(/UserId:(.*)$/im);
                            userId = userIdMatch[1];
                            userId = userId.replace(/"/g, "");

                            var tokenMatch = server_message.match(/Token:(.*)$/im);
                            token = tokenMatch[1];
                            token = token.replace(/"/g, "");

                            self.userDetailCache.cacheUserDetail(sessionId, userId, '', false, false, token);

                            if (self.joinSessionSuccessCallback !== null) {
                                self.joinSessionSuccessCallback(sessionId);
                            }
                        } else {
                            if (self.joinSessionErrorCallback !== null) {
                                self.joinSessionErrorCallback(sessionId);
                            }
                        }
                    } else if (messageType === "RefreshSession") {
                        var sessionIdMatch = server_message.match(/SessionId:(.*)$/im);
                        var sId = sessionIdMatch[1];

                        var sessionInformationMatch = server_message.match(/SessionInformation:(.*)$/im);
                        if (!sessionInformationMatch || sessionInformationMatch.length == 0) {
                            self.planningPokerService.getSessionDetails(sId)
                                .then(response => {
                                    self.userDetailCache.sessionWasRefreshed(response);

                                    if (sessionStaleCallback !== null) {
                                        sessionStaleCallback(response);
                                    }
                                });
                        } else {
                            var sessionInformation = JSON.parse(atob(sessionInformationMatch[1]));
                            self.userDetailCache.sessionWasRefreshed(sessionInformation);
                            if (sessionStaleCallback !== null) {
                                sessionStaleCallback(sessionInformation);
                            }
                        }
                    } else if (messageType === "LeaveSessionResponse") {
                        var successMatch = server_message.match(/Success:(.*)$/im);
                        var success = successMatch[1];

                        var sessionIdMatch = server_message.match(/SessionId:(.*)$/im);
                        sessionId = sessionIdMatch[1];

                        var userIdMatch = server_message.match(/UserId:(.*)$/im);
                        userId = userIdMatch[1];
                        userId = userId.replace(/"/g, "");

                        if (success === "true") {

                            self.userDetailCache.removeUserToken(sessionId);

                            if (self.leaveSessionSuccessCallback !== null) {
                                self.leaveSessionSuccessCallback(sessionId, userId);
                            }
                        } else {
                            if (self.leaveSessionErrorCallback !== null) {
                                self.leaveSessionErrorCallback(sessionId, userId);
                            }
                        }
                    } else if (messageType === "SubscribeSessionResponse") {
                        var successMatch = server_message.match(/Success:(.*)$/im);
                        var success = successMatch[1];

                        var sessionIdMatch = server_message.match(/SessionId:(.*)$/im);
                        var sId = sessionIdMatch[1];

                        if (success === "true") {
                            if (self.subscribeSuccessCallback != null) {
                                self.subscribeSuccessCallback(sessionId);
                            }

                            self.planningPokerService.getSessionDetails(sId)
                                .then(response => {
                                    self.userDetailCache.sessionWasRefreshed(response);
                                    if (sessionStaleCallback !== null) {
                                        sessionStaleCallback(response);
                                    }
                                });
                        } else {
                            if (self.subscribeErrorCallback != null) {
                                self.subscribeErrorCallback(sessionId);
                            }
                        }
                    } else if (messageType === "SessionEndedMessage") {
                        if (sessionEndedCallback !== null) {
                            if (this._connection) {
                                this._connection.onclose = function () { };
                                this._connection.close();
                            }

                            var sessionIdMatch = server_message.match(/SessionId:(.*)$/im);
                            var sId = sessionIdMatch[1];
                            localStorage.removeItem(sId);

                            setTimeout(function () {
                                x = x * 3 + 2;
                                y = x / 2;
                            }, 100);

                            sessionEndedCallback(sId);
                        } else if (messageType === "InvalidMessage") {
                            if (errorCallback !== null) {
                                errorCallback("Invalid message");
                            }
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

    joinSession(sessionId, userName, isObserver, {
        joinSessionSuccessCallback = null,
        joinSessionErrorCallback = null
    } = {}) {
        this.joinSessionSuccessCallback = joinSessionSuccessCallback;
        this.joinSessionErrorCallback = joinSessionErrorCallback;

        var message = "PP 1.0\nMessageType:JoinSession\nUserName:" + userName + "\nSessionId:" + sessionId + "\nIsObserver:" + isObserver;
        this._connection.send(message);
    }
    leaveSession(sessionId, userId, {
        leaveSessionSuccessCallback = null,
        leaveSessionErrorCallback = null
    } = {}) {
        this.leaveSessionSuccessCallback = leaveSessionSuccessCallback;
        this.leaveSessionErrorCallback = leaveSessionErrorCallback;

        this._connection.onclose = function () { };

        var message = "PP 1.0\nMessageType:LeaveSessionMessage\nUserId:" + userId + "\nSessionId:" + sessionId + "\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    subscribeSession(sessionId, userId, {
        subscribeSuccessCallback = null,
        subscribeErrorCallback = null
    } = {}) {
        this.subscribeSuccessCallback = subscribeSuccessCallback;
        this.subscribeErrorCallback = subscribeErrorCallback;

        var message = "PP 1.0\nMessageType:SubscribeMessage\nUserId:" + userId + "\nSessionId:" + sessionId + "\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    castVote(sessionId, userId, userName, vote) {
        var userCache = this.userDetailCache.getUserDetail(sessionId);

        var message = "PP 1.0\nMessageType:UpdateSessionMemberMessage\nSessionId:" + sessionId + "\nUserToUpdateId:" + userId + "\nUserId:" + userId + "\nUserName:" + userName + "\nVote:" + vote + "\nIsHost:" + userCache.isHost + "\nIsObserver:" + userCache.isObserver + "\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    becomeVoter(sessionId, userId) {
        var userCache = this.userDetailCache.getUserDetail(sessionId);

        var message = "PP 1.0\nMessageType:UpdateSessionMemberMessage\nSessionId:" + sessionId + "\nUserToUpdateId:" + userId + "\nUserId:" + userId + "\nUserName:" + userCache.name + "\nVote:0\nIsHost:" + userCache.isHost + "\nIsObserver:false\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    becomeObserver(sessionId, userId) {
        var userCache = this.userDetailCache.getUserDetail(sessionId);

        var message = "PP 1.0\nMessageType:UpdateSessionMemberMessage\nSessionId:" + sessionId + "\nUserToUpdateId:" + userId + "\nUserId:" + userId + "\nUserName:" + userCache.name + "\nVote:0\nIsHost:" + userCache.isHost + "\nIsObserver:true\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    resetVote(sessionId, userId) {
        var message = "PP 1.0\nMessageType:ResetVotesMessage\nSessionId:" + sessionId + "\nUserId:" + userId + "\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    updateSessionProperties(sessionId, userId, storyPointType) {
        var message = "PP 1.0\nMessageType:UpdateSessionPropertiesMessage\nStoryPointType:" + storyPointType + "\nSessionId:" + sessionId + "\nUserId:" + userId + "\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    endSession(sessionId, userId) {
        var message = "PP 1.0\nMessageType:EndSessionMessage\nSessionId:" + sessionId + "\nUserId:" + userId + "\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    removeUserFromSession(sessionId, userId, userToRemoveId) {
        var message = "PP 1.0\nMessageType:RemoveUserFromSessionMessage\nSessionId:" + sessionId + "\nUserId:" + userId + "\nUserToRemoveId:" + userToRemoveId + "\nToken:" + this.userDetailCache.getUserToken(sessionId);
        this._connection.send(message);
    }
    close() {
        this._connection.onclose = function () { };
        this._connection.close();
    }
    getSessionDetails(sessionId, {
        resultsSuccessCallback = null,
        errorCallback = null
    } = {}) {
        this.planningPokerService.getSessionDetails(sessionId)
            .then(response => {
                resultsSuccessCallback(response);
            });
    }
}