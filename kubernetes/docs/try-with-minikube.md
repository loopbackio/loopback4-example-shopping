# Try with Minikube

## Prerequisites

- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Minikube](https://github.com/kubernetes/minikube)
- [Helm](https://helm.sh/)

Please follow
[instructions](https://kubernetes.io/docs/tasks/tools/install-minikube/) to
install Minikube.

## Create/start a minikube cluster

```sh
minikube start -p shopping-cluster
```

Please wait patiently until you see messages as follows:

```sh
😄  [shopping-cluster] minikube v1.4.0 on Darwin 10.14.5
🔥  Creating virtualbox VM (CPUs=2, Memory=2000MB, Disk=20000MB) ...
🐳  Preparing Kubernetes v1.16.0 on Docker 18.09.9 ...
🚜  Pulling images ...
🚀  Launching Kubernetes ...
⌛  Waiting for: apiserver proxy etcd scheduler controller dns
🏄  Done! kubectl is now configured to use "shopping-cluster"
```

## Build docker images for shopping and recommender for the minikube cluster

```sh
eval $(minikube -p shopping-cluster docker-env)
npm run docker:build
```

## Configure kubectl

```sh
kubectl config use-context shopping-cluster
```

## Set up helm

https://helm.sh/docs/using_helm/

```sh
kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
helm init --service-account tiller
```

## Build docker images

Before we rebuild docker images, consider to bump the project to the next
version:

```sh
npm run docker:version
```

To specify the exact version:

```sh
npm run docker:version -- <version>
```

Run the the following command to build docker images:

```sh
npm run docker:build
```

## Install the shopping app

```sh
helm dependency build kubernetes/shopping-app
helm install --name shopping-app --debug kubernetes/shopping-app
```

## Start Minikube dashboard

```sh
minikube dashboard -p shopping-cluster
```

## Open the home page

```sh
minikube service shopping-app -p shopping-cluster
```
