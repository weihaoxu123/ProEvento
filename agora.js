//<script src="https://cdn.agora.io/sdk/release/AgoraRTCSDK-3.4.0.js"></script>

var appID = "2ad71ba8f058413580c895640cdf0dcb";
var appCertificate = "cbb222cfeca84c4ba0b1cf3304fe47b7"

var channelName = "myChannel"
//implement token server
//testing with temp token
//note that it expires in 24 hours
var apiToken = "0062ad71ba8f058413580c895640cdf0dcbIAC7mjJWdrN21+GE2uWJGVrTAJT9hniKZRpADfLVvos2lkOQEggAAAAAEAC5X9YGKtJaYAEAAQAn0lpg"

// Handle errors.
let handleError = function(err){
        console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId){
        // Creates a new div for every stream
        let streamDiv = document.createElement("div");
        // Assigns the elementId to the div.
        streamDiv.id = elementId;
        // Takes care of the lateral inversion
        streamDiv.style.transform = "rotateY(180deg)";
        // Adds the div to the container.
        remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
        let remoteDiv = document.getElementById(elementId);
        if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};

//leave channel
function leaveChannel() {
    client.leave(function () {
        console.log("Leave channel successfully");
    }, function (err) {
        console.log("Leave channel failed");
    });
}

// Create the client
var client = AgoraRTC.createClient({mode: 'rtc', codec: "vp8"});

client.init(appID, function () {
    console.log("AgoraRTC client initialized");
}, function (err) {
    console.log("AgoraRTC client init failed", err);
});

// Join a channel
client.join(apiToken, channelName, null, function(uid) {
    console.log("User " + uid + " join channel successfully");
}, function(err) {
    console.log("Join channel failed", err);
});

// Create local stream
var localStream = AgoraRTC.createStream({
    audio: true,
    video: true,
});
// Initialize the local stream
localStream.init(()=>{
    // Play the local stream
    localStream.play("me");
    // Publish the local stream
    client.publish(localStream, handleError);
}, handleError);

// Subscribe to the remote stream when it is published
client.on("stream-added", function(evt){
    client.subscribe(evt.stream, handleError);
});
// Play the remote stream when it is subsribed
client.on("stream-subscribed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});

// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});