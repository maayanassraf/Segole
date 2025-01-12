# Segole Service - Capitolis Home Assignment

This project uses the code from this [Segole React App](https://github.com/LiorZinger123/Segole).

## Background

### About The App
The Segole App is a web application that shows the current Ethereum (cryptocurrency) value in dollars.
It shows a graph with the change in value in last 24 hours and offers a convertor between dollars to Ethereum.

### About The Implementation
I've run this project in VirtualBox machine, using Ubuntu Distro.

The application is containerized with new Dockerfile added to the `app` directory.

The Application runs as a pod in minikube environment (based on docker).

I have used a NodePort service to expose the application locally 
(by using `minikube service 'service-name' --url` - which runs as a process and creating a tunnel to the cluster).

## Step by Step for running the app

For running this app using the ansible deployment you need to have **Ubuntu** operating system.
Follow the below steps for running the app in an Ubuntu machine:

1. Clone this project using the command `git clone 'repo-url'`.
2. Install ansible (if not already installed) by `sudo apt install ansible`.
3. Enter the project's locally created folder.
4. Change in the `main.yaml` file, under the `deployment` folder, the `tag` variable to the desired version for running the app
   (you can keep the current configuration- already the valued version of latest image, or you can look for existing images in [Segole Docker Hub repo](https://hub.docker.com/repository/docker/maayanassraf/segole/general)). 
5. Change in the `main.yaml` file, under the `deployment` folder, the `ansible_become_user` to desired local admin user for running specific tasks as admin.
6. Create your own encrypted `ansible_become_password` using the command `ansible-vault encrypt_string ''your-encripted-password'' --name 'ansible_become_password'`
for using the become method for running specific tasks as root. 
7. While running this command you will be asked to enter a vault password - saves this password locally in a file named
`vault_password.txt`, under the `deployment` directory and set this file in the `.gitignore` files. 
8. Take the output from the above `ansible-vault` command and replace the `ansible_become_password` variable 
under the `main.yaml` file with your own generated value. 
9. Run in your terminal the command: `ansible-playbook deployment/main.yaml --vault-password-file deployment/vault_password.txt`. 
10. Enter to the generated url that will appear in the stdout when ansible ends running. 
11. Explore The app!

For using non-ubuntu operating system you can install all needed dependencies (docker, kubectl, minikube and ansible), 
edit the `main.yaml` file under the `deployment` folder and remove the task `'Include dependencies install in playbook'`
and then follow the above steps.

For adding the monitoring implementation follow the below steps:
1. Remove from the `main.yaml` file, under the `deployment` folder, the hashtags (#) 
from last two lines (will enable the calling for additional file - for implementing the monitoring stack).
2. Run again the command: `ansible-playbook deployment/main.yaml --vault-password-file deployment/vault_password.txt`

## CI Process

The CI process uses **Github Actions** as a CI tool.

- The workflow triggers automatically when pushing changes to the `app` folder to github (in Branch `master`).
- The workflow pulls from Docker Hub the application `latest` image and with using `docker inspect` 
retrieves his 'true version' (which represented by a `LABEL` instruction in the Dockerfile when building the image).
- The workflow takes the current version and increment his `patch version` by one 
(e.g. when the latest version was 1.2.3 it will increment to 1.2.4). 
- The workflow edits the Dockerfile - changes in the `LABEL` instruction the version to the new incremented version.
- The workflow builds new image version (tagged as the new incremented version and latest) and pushes it to Docker Hub.
- The workflow changes in the `main.yaml` file, under the `deployment` directory, the `tag` variable to the new tag version generated 
& commit the changes to Github for later use (when running ansible) in the deployment phase.

For pushing new images to Docker Hub I have used my Docker Hub username & password as repository secret saved manually in the Github Repository configuration. 

> Note:    
> I chose to implement a CI workflow for creating new patch versions only (and not minor/major version) 
> in thought that minor and major versions should be built and pushed to Docker Hub with more consideration and manually involvement.

## Deployment

The Deployment process for the app uses **Ansible**, everything implemented is under the `deployment` directory.

The deployment includes 2 main parts: 
1. Install required dependencies.
2. Run the app using Minikube.

Those 2 part separated to 2 different files for convenience.

The first part (the `install_dependencies.yaml` file under the `deployment` folder), 
includes:

- Installs dependencies for installing docker. 
- Installs docker. 
- Adds the local user that running ansible to the docker group.
- Installs kubectl.
- Installs minikube.

The second part (the `deploy_to_minikube.yaml` file under the `deployment` folder), includes:

- Starts minikube. 
- Changes the tag version in the deployment file.
- Applies the deployment & service files using kubectl. 
- Exposes the service using the `minikube service 'service-name' --url` command - which runs as a process and creating a tunnel 
to the cluster and generates a local url for use.
- Shows the url in the stdout for easy access to the web page.

I have used ansible vault for encrypting my `ansible_become_password` for running commands needed to be run as root.

## Monitoring

I have implemented another part in the ansible deployment, in the file `apply_monitoring.yaml` under the `deployment` directory.
This file includes the following steps:
- Installs Helm.
- Gets Prometheus repository info.
- Install Prometheus helm chart.
- Get Grafana repository info.
- Install Grafana Helm chart.

Applying Grafana helm chart uses the `grafana_values.yaml`, under the `deployment/k8s` folder.
Those values implementing persistence storage for grafana, `Prometheus` local server (which already implemented by helm) as a datasource,
and defining an already existing dashboard from grafana as a dashboard for cluster monitoring.

Watch the above `Step by Step Guide` section for adding the automated ansible implementation for the monitoring.

For watching the monitoring implemented in Grafana, run the below commands:
1. Get the Grafana 'admin' user password, by running the command: 
`kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo`
2. Access locally to Grafana UI by runnig the commands:

`export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")`

`kubectl --namespace default port-forward $POD_NAME 3000`

3. Enter your web browser and search for the url: `localhost:3000`.
4. Login with the password from step 1 and the username: admin.
5. In the `dashboards` tab you can watch the already implemented dashboard 
(shows information from Prometheus server).