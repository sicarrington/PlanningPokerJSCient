# Planning Poker JS Cient

Javascript library for planning poker.

[![Build status](https://ci.appveyor.com/api/projects/status/xqx2pdc9lfqgw8wj?svg=true)](https://ci.appveyor.com/project/sicarrington/planningpokerjscient)

[![npm version](https://badge.fury.io/js/planningpoker.svg)](https://badge.fury.io/js/planningpoker)

## Example usage
Contact me for access details

``` javascript

var planningPokerConnection = new PlanningPokerConnection(
    [websocketaddress],
    [apiaddress],
    [apikey]);

planningPokerController.startConnection({
    successCallback: webSocketOpenSuccessCallback,
    errorCallback: webSocketErrorCallback
});

```