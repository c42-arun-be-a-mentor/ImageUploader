var croppie;

function fileChange(event) {
    if (!event.files || event.files.length < 1) {
        return false;
    }

    const file = event.files[0];
    getOrientation(file, orientation => {
        makeCroppie(file, orientation);
    });
    return true;
}

function makeCroppie(file, orientation) {
    if (croppie) {
        croppie.destroy();
    }
    orientation = orientation ? orientation : 1;
    const reader = new FileReader();
    reader.onload = event => {
        const img = event.currentTarget.result;
        const element = document.getElementById("image");
        croppie = new Croppie(element, {
            boundary: { width: 400, height: 400 },
            viewport: { width: 300, height: 300 },
            showZoomer: true,
            enableExif: true,
            enableOrientation: true,
            enableZoom: true,
            mouseWheelZoom: true,
            customClass: "avatar"
        });
        croppie.bind({
            url: img,
            orientation: orientation
        });
    };
    reader.readAsDataURL(file);
}

function getValue(type, callback) {
    croppie.result(type, "viewport", "jpeg").then(value => {
        if (callback) {
            callback(value);
        }
    });
}

function getOrientation(file, callback) {
    var reader = new FileReader();
    reader.onload = event => {

        var view = new DataView(event.target.result);
        if (view.getUint16(0, false) != 0xFFD8) {
            return callback(-2);
        }
        var length = view.byteLength, offset = 2;
        while (offset < length) {
            if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) {
                    return callback(-1);
                }

                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++) {
                    if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
                    }
                }
            }
            else if ((marker & 0xFF00) != 0xFF00) {
                break;
            }
            else {
                offset += view.getUint16(offset, false);
            }
        }
        return callback(-1);
    };
    reader.readAsArrayBuffer(file);
}

// NOT IN USE - keeping as an example of uploading a binary blob
//function sendBlob(blob, url, callback) {
//    const formData = new FormData();
//    formData.append("avatar", blob);
//
//    const request = new XMLHttpRequest();
//    request.open("POST", url);
//    request.onload = event => {
//        if (request.status === 200) {
//            callback(true);
//        } else {
//            callback(false);
//        }
//    };
//    request.send(formData);
//}
