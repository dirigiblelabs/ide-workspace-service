angular.module('ideWorkspace', [])
    .provider('workspaceApi', function WorkspaceApiProvider() {
        this.workspacesServiceUrl = '/services/v4/ide/workspaces';
        this.workspaceManagerServiceUrl = '/services/v4/ide/workspace';
        this.$get = ['$http', function workspaceApiFactory($http) {
            let listWorkspaceNames = function () {
                return $http.get(this.workspacesServiceUrl)
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let load = function (resourcePath) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(resourcePath.split('/')).build();
                return $http.get(url, { headers: { 'describe': 'application/json' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let rename = function (oldName, newName, path, workspaceName) {
                let pathSegments = path.split('/');
                pathSegments = pathSegments.slice(1, -1);
                if (pathSegments.length >= 1) {
                    let url = new UriBuilder().path(this.workspaceManagerServiceUrl.split('/')).path(workspaceName).path('rename').build();
                    return $http.post(url, {
                        source: new UriBuilder().path(pathSegments).path(oldName).build(),
                        target: new UriBuilder().path(pathSegments).path(newName).build()
                    }).then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
                }
            }.bind(this);

            let remove = function (filepath) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(filepath.split('/')).build();
                return $http.delete(url, { headers: { 'Dirigible-Editor': 'Workspace' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let copy = function (sourcePath, targetPath, sourceWorkspace, targetWorkspace) {
                let url = new UriBuilder().path(this.workspaceManagerServiceUrl.split('/')).path(targetWorkspace).path('copy').build();
                return $http.post(url, {
                    sourceWorkspace: sourceWorkspace,
                    source: sourcePath,
                    targetWorkspace: targetWorkspace,
                    target: (targetPath.endsWith('/') ? targetPath : targetPath + '/'),
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Workspace service:', response);
                    return { status: response.status };
                });
            }.bind(this);

            let move = function (sourcePath, targetPath, sourceWorkspace, targetWorkspace) {
                // TODO: Move to another workspace
                let url = new UriBuilder().path(this.workspaceManagerServiceUrl.split('/')).path(sourceWorkspace).path('move').build();
                return $http.post(url, {
                    source: sourcePath,
                    target: targetPath,
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Workspace service:', response);
                    return { status: response.status };
                });
            }.bind(this);

            let createNode = function (name, targetPath, isDirectory, content = '') {
                let url = new UriBuilder().path((this.workspacesServiceUrl + targetPath).split('/')).path(name).build();
                if (isDirectory)
                    url += "/";
                return $http.post(url, JSON.stringify(content), { headers: { 'Dirigible-Editor': 'Workspace' } })
                    .then(function successCallback(response) {
                        return {
                            status: response.status,
                            // data: $http.get(response.config.url, { headers: { 'describe': 'application/json' } }) // This isn't ok
                            //     .then(function (response) { return response.data; }),
                        };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let createWorkspace = function (workspace) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(workspace).build();
                return $http.post(url, {})
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let deleteWorkspace = function (workspace) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(workspace).build();
                return $http.delete(url, { headers: { 'Dirigible-Editor': 'Workspace' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let createProject = function (workspace, projectName) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(workspace).path(projectName).build();
                return $http.post(url, {})
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let linkProject = function (workspace, projectName, path) {
                let url = new UriBuilder().path(this.workspaceManagerServiceUrl.split('/')).path(workspace).path('linkProject').build();
                return $http.post(url, {
                    source: projectName,
                    target: path
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Workspace service:', response);
                    return { status: response.status };
                });
            }.bind(this);

            let deleteProject = function (workspace, projectName) {
                let url = new UriBuilder().path(this.workspacesServiceUrl.split('/')).path(workspace).path(projectName).build();
                return $http.delete(url, { headers: { 'Dirigible-Editor': 'Workspace' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            return {
                listWorkspaceNames: listWorkspaceNames,
                load: load,
                rename: rename,
                remove: remove,
                copy: copy,
                move: move,
                createNode: createNode,
                createWorkspace: createWorkspace,
                deleteWorkspace: deleteWorkspace,
                createProject: createProject,
                linkProject: linkProject,
                deleteProject: deleteProject,
            };
        }];
    });