// Simple constraints object, for more advanced features see https://addpipe.com/blog/audio-constraints-getusermedia/

var constraints = {
    audio: true,
    video: false
}
/* We're using the standard promise based getUserMedia() https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */
navigator.mediaDevices.getUserMedia(constraints).then(
    function(stream) {
        __log("getUserMedia() success, stream created, initializing WebAudioRecorder...");
        //assign to gumStream for later use 
        gumStream = stream;
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        //stop the input from playing back through the speakers 
        input.connect(audioContext.destination)
        //get the encoding 
        encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
        //disable the encoding selector 
        encodingTypeSelect.disabled = true;
        recorder = new WebAudioRecorder(input, {
            workerDir: "js/",
            encoding: encodingType,
            onEncoderLoading: function(recorder, encoding) {
                // show "loading encoder..." display 
                __log("Loading " + encoding + " encoder...");
            },
            onEncoderLoaded: function(recorder, encoding) {
                // hide "loading encoder..." display 
                __log(encoding + " encoder loaded");
            }
        });
        recorder.onComplete = function(recorder, blob) {
            __log("Encoding complete");
            createDownloadLink(blob, recorder.encoding);
            encodingTypeSelect.disabled = false;
        }
        recorder.setOptions({
            timeLimit: 120,
            encodeAfterRecord: encodeAfterRecord,
            ogg: {
                quality: 0.5
            },
            mp3: {
                bitRate: 160
            }
        });
        //start the recording process 
        recorder.startRecording();
        __log("Recording started");
    }).catch(function(err) { //enable the record button if getUSerMedia() fails 
    recordButton.disabled = false;
    stopButton.disabled = true;
}); 
//disable the record button 
recordButton.disabled = true;
stopButton.disabled = false;

