function onRequest(context) {
    var userModule = require("/app/modules/user.js")["userModule"];
    var response = userModule.getUsers();
    var users = {};
    context["permissions"] = userModule.getUIPermissions();
    if (response["status"] == "success") {
        context["users"] = response["content"];
        context["userListingStatusMsg"] = "Total number of Users found : " + context["users"].length;
    } else {
        context["users"] = [];
        context["userListingStatusMsg"] = "Error in retrieving user list.";
    }
    return context;
}