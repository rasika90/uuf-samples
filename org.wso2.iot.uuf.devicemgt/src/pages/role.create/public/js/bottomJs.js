/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Checks if provided input is valid against RegEx input.
 *
 * @param regExp Regular expression
 * @param inputString Input string to check
 * @returns {boolean} Returns true if input matches RegEx
 */
function inputIsValid(regExp, inputString) {
    return regExp.test(inputString);
}
function formatRepo (user) {
    if (user.loading) {
        return user.text
    }
    if (!user.username){
        return;
    }
    var markup = '<div class="clearfix">' +
        '<div clas="col-sm-8">' +
        '<div class="clearfix">' +
        '<div class="col-sm-3">' + user.username + '</div>';
    if (user.firstname) {
        markup +=  '<div class="col-sm-3"><i class="fa fa-code-fork"></i> ' + user.firstname + '</div>';
    }
    if (user.emailAddress) {
        markup += '<div class="col-sm-2"><i class="fa fa-star"></i> ' + user.emailAddress + '</div></div>';
    }
    markup += '</div></div>';
    return markup;
}

function formatRepoSelection (user) {
    return user.username || user.text;;
}

$(document).ready(function () {

    $("#users").select2({
        multiple:true,
        tags: true,
        ajax: {
            url: window.location.origin + "/devicemgt_admin/users",
            method: "POST",
            dataType: 'json',
            contentType: "application/json",
            accept: "application/json",
            delay: 250,
            id: function (user) {
                return user.username;
            },
            headers : {'Authorization' : 'Bearer ' + getToken()},
            data: function (params) {
                var postData = {};
                postData.actionPayload = JSON.stringify({
                    q: params.term, // search term
                    page: params.page
                });

                return JSON.stringify(postData);
            },
            processResults: function (data, page) {
                var newData = [];
                $.each(data.responseContent, function (index, value) {
                    value.id = value.username;
                    newData.push(value);
                });
                return {
                    results: newData
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 1,
        templateResult: formatRepo, // omitted for brevity, see the source of this page
        templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
    });

    /**
     * Following click function would execute
     * when a user clicks on "Add Role" button
     * on Add Role page in WSO2 Devicemgt Console.
     */
    $("button#add-role-btn").click(function() {
        var roleName = $("input#rolename").val();
        var domain = $("#domain").val();
        var users = $("#users").val();

        var errorMsgWrapper = "#role-create-error-msg";
        var errorMsg = "#role-create-error-msg span";
        if (!roleName) {
            $(errorMsg).text("Role name is a required field. It cannot be empty.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!inputIsValid(/^[^~?!#$:;%^*`+={}\[\]\\()|<>,'"" "]{3,30}$/, roleName)) {
            $(errorMsg).text("Provided role name is invalid. Please check.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!domain) {
            $(errorMsg).text("Domain is a required field. It cannot be empty.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!inputIsValid(/^[^~?!#$:;%^*`+={}\[\]\\()|<>,'"0-9]{1,30}$/, domain)) {
            $(errorMsg).text("Provided domain is invalid. Please check.");
            $(errorMsgWrapper).removeClass("hidden");
        } else {
            var addRoleFormData = {};

            addRoleFormData.roleName = roleName;

            if (domain != "PRIMARY"){
                addRoleFormData.roleName = domain + "/" + roleName;
            }
            if (users == null){
                users = [];
            }
            addRoleFormData.users = users;

            var addRoleAPI = "/devicemgt_admin/roles";

            invokerUtil.post(
                addRoleAPI,
                addRoleFormData,
                function (data) {
                        // Clearing user input fields.
                        $("input#rolename").val("");
                        $("#domain").val("");
                        // Refreshing with success message
                        $("#role-create-form").addClass("hidden");
                        $("#role-created-msg").removeClass("hidden");
                }, function () {
                    $(errorMsg).text("An unexpected error occurred. Please try again later.");
                    $(errorMsgWrapper).removeClass("hidden");
                }
            );
        }
    });
});