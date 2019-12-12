/**
 * So, in case you wonder why just don't use a setInterval in the questionPage is due to when 
 * the tab is inactive the setInterval is automagically set to 1000 miliseconds instead of the 100 ms
 * that I need, and since this is a separate thread from the one running the page this one is not affected
 */
const workercode = () => {
    let intervalReference;
    let passedTime = 0;

    /**
     * Executed when the main thread sends a start message
     */
    function handleStart() {
        passedTime = 0;
        clearInterval(intervalReference);
        intervalReference = setInterval(() => {
            passedTime += 100;
            let seconds = Math.trunc(20.0 - (passedTime / 1000.0));
            let percentage = 100 - ((passedTime) / (20.0 * 1000.0) * 100);

            if (percentage < 0) {
                percentage = 0;
            }

            if (seconds < 0) {
                seconds = 0
            }


            // Send message to the main thread
            postMessage({ type: 'time', data: {
                seconds,
                percentage
            } });
        }, 100);
    }

    /**
     * Executed when the main thread send a stop message
     */
    function handleStop() {
        clearInterval(intervalReference);
    }

    // Listen for received messages by the main thread
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
    
        if (e.data === 'START')
            handleStart();
        else if (e.data === 'STOP')
            handleStop();
    })
}

// Due to problems with the webpack transpilling
// I convert the code into to a string
let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

// Then convert the string into data (blob)
const blob = new Blob([code], {type: "application/javascript"});
// And create and URL only acessible by this page
const worker_script = URL.createObjectURL(blob);

// And export the blob so I can create a web worker with the blob
module.exports = worker_script;