(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

window.extAsyncInit = function () {
    // the Messenger Extensions JS SDK is done loading 

    MessengerExtensions.getContext('544488527636794',
        function success(thread_context) {
            // success
            //set psid to input
            $("#psid").val(thread_context.psid);
            handleClickButtonOrderBook();
        },
        function error(err) {
            // error
            console.log('Error order book MilkyWay bot', err);
        }
    );
};

//validate inputs
function validateInputFields() {
    const EMAIL_REG = /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

    let email = $("#email");
    let phoneNumber = $("#phoneNumber");
    let address = $("#address");

    if (!email.val().match(EMAIL_REG)) {
        email.addClass("is-invalid");
        return true;
    } else {
        email.removeClass("is-invalid");
    }

    if (phoneNumber.val() === "") {
        phoneNumber.addClass("is-invalid");
        return true;
    } else {
        phoneNumber.removeClass("is-invalid");
    }

    if (address.val() === "") {
        address.addClass("is-invalid");
        return true;
    } else {
        address.removeClass("is-invalid");
    }

    return false;
}


function handleClickButtonOrderBook() {
    $("#btnOrderBook").on("click", function (e) {
        let check = validateInputFields(); //return true or false

        let data = {
            psid: $("#psid").val(),
            customerName: $("#customerName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
            address: $("#address").val(),
        };

        if (!check) {
            //close webview
            MessengerExtensions.requestCloseBrowser(function success() {
                // webview closed
                $("#customerInfo").css("display", "none");
                $("#handleError").css("display", "block");
            }, function error(err) {
                // an error occurred
                console.log(err);
                $("#customerInfo").css("display", "none");
                $("#handleError").css("display", "block");
            });
            $.ajax({
                url: `${window.location.origin}/order-book-ajax`,
                method: "POST",
                data: data,
                success: function (data) {
                    console.log(data);
                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    });
}


