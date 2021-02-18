# Build and deploy on OpenShift Container Platform

The loopback4-example-shopping/openshift directory contains Dockerfiles for
building container images suitable for running on OpenShift Container Platform
and yaml files for creating build configurations for building the images. They
have been tested on OCP 4.6.9.

The Dockerfiles in the loopback4-example-shopping/openshift directory differs
from the Docker files in the root dirctory by using nodejs images based on ubi
(Red Hat Universal Base Image) as base image, and by not using a hardcoded user
named node. The node applications in the resulting images will be able to run
using any userid.

## First build and deploy

The instructions here are intended to be used for a quick and easy installation
for test and demo purposes only - not as an example of best practices for
production use.

The databases are set up without password protection. They will use emptyDir
volumes for persistance, meaning that data will be lost if the pods are deleted
or moved to an other node. Skip the `oc new-app mongo` and `oc new-app redis` if
you want to set up databases in a different way.

The application is exposed using http rather than https. No resource limits are
set, which may inpact performance and ability to deploy to a cluster or project
with enforced resource quotas.

After logging in to your cluster using the `oc login` command and changing to
the loopback4-example-shopping/openshift directory, run the commands below to
create a new project called shoppy and to install the application and databases
in the new project.

```
oc new-project shoppy
oc new-app mongo --name shopping-app-mongodb
oc new-app redis --name shopping-app-redis-master
oc create imagestream shopping-base
oc create imagestream shopping
oc create imagestream recommender
oc apply -f base.yaml
oc apply -f recommender.yaml
oc apply -f shopping.yaml
```

Wait for tag latest to be created for recommender and shopping. Use
`oc get imagestreams` to see TAGS for imagestreams. Then run these commands:

```
oc new-app recommender --name recommender-rest
oc new-app shopping
oc expose svc shopping
```

Run `oc get route shopping` to get the hostname assigned to the application.

## Start a new build and deploy

If you want to do a new build and deploy after the repo has been updated, run:

```
oc start-build shopping-base-image
```

## Use your forked repo as source

If you fork the strongloop/loopback4-example-shopping repo and want to use your
own repo as source instead, you should edit base.yaml and change uri and ref:

1. Change uri `https://github.com/strongloop/loopback4-example-shopping.git` to
   the uri of your git repository.
2. Change ref `master` to the branch of your repo that you want to build from.
3. Then run these commands to update the buildconfig and start a new build:

```
oc apply -f base.yaml
oc start-build shopping-base-image
```

## Configure SMTP-server and JWT_SECRET

You can use environment variables to configure the SMTP server to be used for
sending password reset emails and to set the secret to be used for generating
JWTs. Example on how to set the environment variables is below. See root
[README.md](../README.md) for details about each variable.

```
oc set env dc/shopping SMTP_PORT=587 \
SMTP_SERVER=smtp.example.com \
APPLICATION_URL=http://shopping-shoppy.mystack.example.com/ \
SMTP_USERNAME=john@example.com \
SMTP_PASSWORD=secret \
PASSWORD_RESET_EMAIL_LIMIT=2 \
JWT_SECRET=my-secret-is-exactly-32-bytes-lo
```

## Setting resource limits and node options

You can set resource limits using the `oc set resources command`, e.g:

```
oc set resources dc shopping --limits=cpu=2000m,memory=2Gi \
  --requests=cpu=500m,memory=1Gi`
```

To set options for node, you can set the NODE_OPTIONS environment variable, e.g:

```
oc set env dc/shopping NODE_OPTIONS=--max-old-space-size=1024
```

## Changing database connection details

The databases created using the instructions under "First build and deploy" are
not suitable for production. Creating databases in a more advanced way is
outside the scope of this README.

If you want to use databases that are password protected or set up with
different names, in different projects or outside the cluster, you will have to
fork strongloop/loopback4-example-shopping and change the mongo.datasource.ts
and/or redis.datasource.ts in the packages/shopping/src/datasources directory.

## Exposing the application over https instead of http

Run these commands to delete the old route and recreate it to use https:

```
oc delete route shopping
oc create route edge --service=shopping
```
