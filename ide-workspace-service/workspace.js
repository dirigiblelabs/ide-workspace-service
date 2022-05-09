angular.module('ideWorkspace', [])
    .provider('workspaceApi', function WorkspaceApiProvider() {
        this.workspacesServiceUrl = '';
        this.workspaceManagerServiceUrl = '';
        this.$get = ['$http', function workspaceApiFactory($http) {
            let listWorkspaceNames = function () {
                return $http.get(this.workspacesServiceUrl)
                    .then(function (response) {
                        return response.data;
                    });
            }.bind(this);

            let load = function (wsResourcePath) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(wsResourcePath.split('/')).build();
                return $http.get(url, { headers: { 'describe': 'application/json' } })
                    .then(function (response) {
                        return response.data;
                    });
            }.bind(this);

            let rename = function (oldName, newName, path) {
                let pathSegments = path.split('/');
                if (pathSegments.length > 2) {
                    let workspaceName = path.split('/')[1];
                    let url = new UriBuilder().path(this.workspaceManagerServiceUrl.split('/')).path(workspaceName).path('rename').build();
                    let parent = pathSegments.slice(2, -1);
                    let sourcepath = new UriBuilder().path(parent).path(oldName).build();
                    let targetpath = new UriBuilder().path(parent).path(newName).build();
                    return $http.post(url, {
                        source: sourcepath,
                        target: targetpath
                    }).then(function successCallback(response) {
                        return response.data;
                    }, function errorCallback(response) {
                        console.error(`Workspace service: ${response.data}`);
                        return response.data;
                    });
                }
            }.bind(this);

            let remove = function (filepath) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(filepath.split('/')).build();
                return $http['delete'](url, { headers: { 'Dirigible-Editor': 'Workspace' } });
            }.bind(this);

            return {
                listWorkspaceNames: listWorkspaceNames,
                load: load,
                rename: rename,
                remove: remove,
            };
        }];
    });