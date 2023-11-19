const microphoneButton = document.getElementsByClassName("start-recording-button")[0];
const recordingControlButtonsContainer = document.getElementsByClassName(
  "recording-contorl-buttons-container"
)[0];
const stopRecordingButton = document.getElementsByClassName("stop-recording-button")[0];
const cancelRecordingButton = document.getElementsByClassName("cancel-recording-button")[0];
const elapsedTimeTag = document.getElementsByClassName("elapsed-time")[0];
const closeBrowserNotSupportedBoxButton = document.getElementsByClassName(
  "close-browser-not-supported-box"
)[0];
const overlay = document.getElementsByClassName("overlay")[0];
const audioElement = document.getElementsByClassName("audio-element")[0];
const audioElementSource = document
  .getElementsByClassName("audio-element")[0]
  .getElementsByTagName("source")[0];
const textIndicatorOfAudiPlaying = document.getElementsByClassName(
  "text-indication-of-audio-playing"
)[0];

microphoneButton.onclick = startAudioRecording;
stopRecordingButton.onclick = stopAudioRecording;
cancelRecordingButton.onclick = cancelAudioRecording;
closeBrowserNotSupportedBoxButton.onclick = hideBrowserNotSupportedOverlay;
audioElement.onended = hideTextIndicatorOfAudioPlaying;

/** Displays recording control buttons */
function handleDisplayingRecordingControlButtons() {
  microphoneButton.style.display = "none";
  recordingControlButtonsContainer.classList.remove("hide");
  handleElapsedRecordingTime();
}

/** Hide the displayed recording control buttons */
function handleHidingRecordingControlButtons() {
  microphoneButton.style.display = "block";
  recordingControlButtonsContainer.classList.add("hide");
  clearInterval(elapsedTimeTimer);
}

const displayBrowserNotSupportedOverlay = () => overlay.classList.remove("hide");
const hideBrowserNotSupportedOverlay = () => overlay.classList.add("hide");

/** Creates a source element for the the audio element in the HTML document*/
function createSourceForAudioElement() {
  let sourceElement = document.createElement("source");
  audioElement.appendChild(sourceElement);

  audioElementSource = sourceElement;
}

/** Display the text indicator of the audio being playing in the background */
function displayTextIndicatorOfAudioPlaying() {
  textIndicatorOfAudiPlaying.classList.remove("hide");
}

/** Hide the text indicator of the audio being playing in the background */
function hideTextIndicatorOfAudioPlaying() {
  textIndicatorOfAudiPlaying.classList.add("hide");
}

/** Stores the actual start time when an audio recording begins to take place to ensure elapsed time start time is accurate*/
var audioRecordStartTime;

/** Stores the maximum recording time in hours to stop recording once maximum recording hour has been reached */
var maximumRecordingTimeInHours = 1;

/** Stores the reference of the setInterval function that controls the timer in audio recording*/
let elapsedTimeTimer;

/** Starts the audio recording*/
function startAudioRecording() {
  console.log("Recording Audio...");

  //If a previous audio recording is playing, pause it
  let recorderAudioIsPlaying = !audioElement.paused; // the paused property tells whether the media element is paused or not
  console.log("paused?", !recorderAudioIsPlaying);
  if (recorderAudioIsPlaying) {
    audioElement.pause();
    //also hide the audio playing indicator displayed on the screen
    hideTextIndicatorOfAudioPlaying();
  }

  //start recording using the audio recording API
  audioRecorder
    .start()
    .then(() => {
      //on success

      //store the recording start time to display the elapsed time according to it
      audioRecordStartTime = new Date();

      //display control buttons to offer the functionality of stop and cancel
      handleDisplayingRecordingControlButtons();
    })
    .catch((error) => {
      //on error
      //No Browser Support Error
      if (
        error.message.includes(
          "mediaDevices API or getUserMedia method is not supported in this browser."
        )
      ) {
        console.log("To record audio, use browsers like Chrome and Firefox.");
        displayBrowserNotSupportedOverlay();
      }

      //Error handling structure
      switch (error.name) {
        case "AbortError": //error from navigator.mediaDevices.getUserMedia
          console.log("An AbortError has occured.");
          break;
        case "NotAllowedError": //error from navigator.mediaDevices.getUserMedia
          console.log("A NotAllowedError has occured. User might have denied permission.");
          break;
        case "NotFoundError": //error from navigator.mediaDevices.getUserMedia
          console.log("A NotFoundError has occured.");
          break;
        case "NotReadableError": //error from navigator.mediaDevices.getUserMedia
          console.log("A NotReadableError has occured.");
          break;
        case "SecurityError": //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
          console.log("A SecurityError has occured.");
          break;
        case "TypeError": //error from navigator.mediaDevices.getUserMedia
          console.log("A TypeError has occured.");
          break;
        case "InvalidStateError": //error from the MediaRecorder.start
          console.log("An InvalidStateError has occured.");
          break;
        case "UnknownError": //error from the MediaRecorder.start
          console.log("An UnknownError has occured.");
          break;
        default:
          console.log("An error occured with the error name " + error.name);
      }
    });
}
/** Stop the currently started audio recording & sends it
 */
function stopAudioRecording() {
  console.log("Stopping Audio Recording...");

  //stop the recording using the audio recording API
  audioRecorder
    .stop()
    .then((audioAsblob) => {
      //Play recorder audio
      playAudio(audioAsblob);

      //hide recording control button & return record icon
      handleHidingRecordingControlButtons();
    })
    .catch((error) => {
      //Error handling structure
      switch (error.name) {
        case "InvalidStateError": //error from the MediaRecorder.stop
          console.log("An InvalidStateError has occured.");
          break;
        default:
          console.log("An error occured with the error name " + error.name);
      }
    });
}

/** Cancel the currently started audio recording */
function cancelAudioRecording() {
  console.log("Canceling audio...");

  //cancel the recording using the audio recording API
  audioRecorder.cancel();

  //hide recording control button & return record icon
  handleHidingRecordingControlButtons();
}

/** Plays recorded audio using the audio element in the HTML document
 * @param {Blob} recorderAudioAsBlob - recorded audio as a Blob Object
 */
function playAudio(recorderAudioAsBlob) {
  const name = prompt("Enter a name", "");

  const file = new File([recorderAudioAsBlob], name, { type: recorderAudioAsBlob.type });

  const formData = new FormData();
  formData.append("files", file);

  fetch("https://vr.underpass.clb.li/upload", { method: "post", body: formData })
    .then((res) => console.log(res))
    .catch((err) => ("Error occurred", err));

  //read content of files (Blobs) asynchronously
  // let reader = new FileReader();

  //once content has been read
  // reader.onload = (e) => {
  //   //store the base64 URL that represents the URL of the recording audio
  //   let base64URL = e.target.result;

  //   //If this is the first audio playing, create a source element
  //   //as pre populating the HTML with a source of empty src causes error
  //   if (!audioElementSource)
  //     //if its not defined create it (happens first time only)
  //     createSourceForAudioElement();

  //   //set the audio element's source using the base64 URL
  //   audioElementSource.src = base64URL;

  //   //set the type of the audio element based on the recorded audio's Blob type
  //   let BlobType = recorderAudioAsBlob.type.includes(";")
  //     ? recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(";"))
  //     : recorderAudioAsBlob.type;
  //   audioElementSource.type = BlobType;

  //   //call the load method as it is used to update the audio element after changing the source or other settings
  //   audioElement.load();

  //   //play the audio after successfully setting new src and type that corresponds to the recorded audio
  //   console.log("Playing audio...");
  //   audioElement.play();

  //   //Display text indicator of having the audio play in the background
  //   displayTextIndicatorOfAudioPlaying();
  // };

  // //read content and convert it to a URL (base64)
  // reader.readAsDataURL(recorderAudioAsBlob);
}

function handleElapsedRecordingTime() {
  displayElapsedTimeDuringAudioRecording("00:00");

  elapsedTimeTimer = setInterval(() => {
    let elapsedTime = computeElapsedTime(audioRecordStartTime);

    displayElapsedTimeDuringAudioRecording(elapsedTime);
  }, 1000);
}

/** Display elapsed time during audio recording
 * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss
 */
function displayElapsedTimeDuringAudioRecording(elapsedTime) {
  elapsedTimeTag.innerHTML = elapsedTime;

  if (elapsedTimeReachedMaximumNumberOfHours(elapsedTime)) {
    stopAudioRecording();
  }
}

/**
 * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss
 * @returns {Boolean} whether the elapsed time reached the maximum number of hours or not
 */
function elapsedTimeReachedMaximumNumberOfHours(elapsedTime) {
  let elapsedTimeSplitted = elapsedTime.split(":");

  let maximumRecordingTimeInHoursAsString =
    maximumRecordingTimeInHours < 10
      ? "0" + maximumRecordingTimeInHours
      : maximumRecordingTimeInHours.toString();

  if (
    elapsedTimeSplitted.length === 3 &&
    elapsedTimeSplitted[0] === maximumRecordingTimeInHoursAsString
  )
    return true;
  else return false;
}

/** Computes the elapsedTime since the moment the function is called in the format mm:ss or hh:mm:ss
 * @param {String} startTime - start time to compute the elapsed time since
 * @returns {String} elapsed time in mm:ss format or hh:mm:ss format, if elapsed hours are 0.
 */
function computeElapsedTime(startTime) {
  let endTime = new Date();

  let timeDiff = endTime - startTime;

  timeDiff = timeDiff / 1000;

  let seconds = Math.floor(timeDiff % 60);

  seconds = seconds < 10 ? "0" + seconds : seconds;

  timeDiff = Math.floor(timeDiff / 60);

  let minutes = timeDiff % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  timeDiff = Math.floor(timeDiff / 60);

  let hours = timeDiff % 24;

  timeDiff = Math.floor(timeDiff / 24);

  let days = timeDiff;

  let totalHours = hours + days * 24;
  totalHours = totalHours < 10 ? "0" + totalHours : totalHours;

  if (totalHours === "00") {
    return minutes + ":" + seconds;
  } else {
    return totalHours + ":" + minutes + ":" + seconds;
  }
}
