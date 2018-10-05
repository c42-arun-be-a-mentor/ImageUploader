$(() => {
    const hasAvatar = $("#hasAvatar").val();
    const currentAvatar = $("#currentAvatar");
    if (hasAvatar === "true") {
        currentAvatar.show();
    }
});


function selectAvatar(event) {
    $('#avatarfile').click();
    //.preventDefault();
}

function newAvatar(event) {
    if (fileChange(event)) {
        currentAvatar.hide();
        $("#avatarInstructions").show();
    }
}

// this is a snippet, before submitting
function OnSubmit() {
    const filename = $("#avatarfile").val();
    if (filename) {
        getValue("base64", value => {
            $("#avatarBase64").val(value);
            $("#submitButton").click();
        });
    }
}