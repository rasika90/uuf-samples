/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

function onRequest(context) {

    context.handlebars.registerHelper('concat', function(a, b, c) {
        return a + b + c;
    });

    var userModule = require("/app/modules/user.js")["userModule"];
    var userName = request.getParameter("username");
    var user, userRoles, devices;

    if (userName) {
        var response = userModule.getUser(userName);

        if (response["status"] == "success") {
            user = response["content"];
            user.domain = response["userDomain"];
        }

        response = userModule.getRolesByUsername(userName);
        if (response["status"] == "success") {
            userRoles = response["content"];
        }

        var deviceModule = require("/app/modules/device.js").deviceModule;
        devices = deviceModule.listDevicesForUser(userName);
    }
    return {"user": user, "userRoles": userRoles, "devices": devices};
}