var confetti = null;

function MakeConfetti() {
    if (confetti == null) {
        var confettiSettings = { target: 'confetti-canvas' };
        confetti = new ConfettiGenerator(confettiSettings);
    }
    confetti.render();
}
  
function RemoveConfetti() {
    if (confetti != null)
        confetti.clear();
}