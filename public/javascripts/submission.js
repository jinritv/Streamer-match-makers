function submitFormEvent(e) {
  e.preventDefault();

  fetch("/submission", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      submitterName: e.target.submitterName.value,
      submitterTwitchUsername: e.target.submitterTwitchUsername.value,
      isFollower: e.target.isFollower.value,
      streamerName: e.target.streamerName.value,
      streamerTwitchUsername: e.target.streamerTwitchUsername.value,
      message: e.target.message.value,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      resetForm();
      alert("Submission successful!");
    })
    .catch((err) => {
      alert("Submission failed!");
    });
}

function resetForm() {
  $('input[name="submitterName"]').val("");
  $('input[name="submitterTwitchUsername"]').val("");
  $('input:radio[name="isFollower"]')
    .filter("[value=yes]")
    .prop("checked", true);
  $('input[name="streamerName"]').val("");
  $('input[name="streamerTwitchUsername"]').val("");
  $('textarea[name="message"]').val("");
}
