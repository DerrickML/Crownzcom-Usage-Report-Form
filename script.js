// A simple simulation of user email and total frames in the presentation
const userEmail = 'user@example.com';
const totalFrames = 20; // Change this to the total number of frames in the actual presentation
let framesViewedCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.slide').forEach(function(slideButton) {
        slideButton.addEventListener('click', function() {
            framesViewedCount++;
            let frameNumber = this.dataset.frameNumber;
            logFrameView(userEmail, frameNumber, framesViewedCount, totalFrames);
        });
    });
});

function logFrameView(email, frameNumber, framesViewed, totalFrames) {
    var payload = {
        email_address: email,
        frame_viewed: `Frame ${frameNumber}`,
        no_frames_viewed: framesViewed,
        total_no_frames: totalFrames
    };

    fetch('https://usage-report.derrickmal123.workers.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'Success') {
            console.log('Frame logged successfully!');
        } else {
            console.error('Error logging frame:', data.message);
        }
    })
    .catch((error) => {
        console.error('An error occurred while logging the frame:', error);
    });
}