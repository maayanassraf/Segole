# Segole Service - Capitolis Home Assignment

This project uses the code from this [Segole React App](https://github.com/LiorZinger123/Segole).

## Background

### About The App
The Segole App is a web application that shows the current Ethereum (cryptocurrency) value in dollars.
It shows a graph with the change in value in last 24 hours and offers a convertor between dollars to Ethereum.

### About The Implementation
I've run this project in VirtualBox machine, using Ubuntu Distro.

The application is containerized with new Dockerfile added to the app directory.

The Application runs as a pod in minikube environment (based on docker).

I have used a NodePort service to expose the application locally 
(by using `minikube service 'service-name' --url` - which runs as a process and creating a tunnel to the cluster).

## Step by Step for running the app

For running this app using the ansible deployment you need to have Ubuntu operating system.
Follow the below steps for running the app in an Ubuntu machine:

1. Clone this project using the command `git clone 'repo-url'`.
2. Install ansible (if not already installed) by `sudo apt install ansible`.
3. Enter the project's locally created folder.
4. Change in the `main.yaml` file under the `deployment` folder the `tag` variable to the desired version for running the app
   (you can look for existing images in [Segole Docker Hub repo](https://hub.docker.com/repository/docker/maayanassraf/segole/general)). 
5. Create your own encrypted `ansible_become_password` using the command `ansible-vault encrypt_string ''your-encripted-password'' --name 'ansible_become_password'`
for using the become method when running ansible. 
6. While running this command you will be asked to enter a vault password - saves this password locally in a file named
`vault_password.txt` under the `deployment` directory. 
7. Take the output from the above `ansible-vault` command and replace the `ansible_become_password` variable 
under the `main.yaml` file with your own generated value. 
8. Run in your terminal the command: `ansible-playbook deployment/main.yaml --vault-password-file deployment/vault_password.txt`. 
9. Enter to the generated url that will appear in the stdout when ansible ends running. 
10. Explore The app.

for using non-ubuntu operating system you can install all needed dependencies (docker, kubectl, minikube and ansible), 
edit the `main.yaml` file under the `deployment` folder and remove the task `Include dependencies install in playbook`
and then follow the above steps.

## CI Process

The CI process uses **Github Actions** as a CI tool.

- The workflow triggers automatically when pushing changes to the `app` folder to github (in Branch `master`).
- The workflow pulls from Docker Hub the application `latest` image and with using `docker inspect` 
retrieves his 'true version' (which represented by a `LABEL` instruction in the Dockerfile when building the image).
- The workflow takes the current version and increment his `patch version` by one 
(e.g. when the latest version was 1.2.3 it will increment to 1.2.4) 
- The workflow edits the Dockerfile - changes in the `LABEL` instruction the version to the new incremented version.
- The workflow builds new image version (tagged as the new incremented version and latest) and pushes it to Docker Hub.

## Deployment

The Deployment process for the app uses **Ansible**, everything implemented is under the `deployment` directory.

The deployment includes 2 main parts: 
1. Install required dependencies.
2. Run the app using Minikube.

Those 2 part separated to 2 different files for convenience.

The first part (the `install_dependencies.yaml` file under the `deployment` folder), 
includes:

- installs dependencies for installing docker. 
- Installs docker. 
- Adds the local user that running ansible to the docker group.
- Installs kubectl.
- Installs minikube.

The second part (the `deploy_to_minikube.yaml` file under the `deployment` folder), includes:

- Starts minikube. 
- Changes the tag version in the deployment file.
- Applies the deployment & service files using kubectl 
- Exposes the service using the `minikube service 'service-name' --url` command - which runs as a process and creating a tunnel 
to the cluster and generates a local url for use.
- Shows the url in the stdout for easy access to the web page.

I have used ansible vault for encrypting my `ansible_become_password` for running commands needed to be run as root.