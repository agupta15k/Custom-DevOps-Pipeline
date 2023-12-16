# Custom DevOps Pipeline

## Problem Statement

### Testing

Developers dedicating effort to writing test cases and analyzing code coverage is crucial, but this manual process hinders the development flow. It takes unnecessary time and effort as developers take on the dual role of test implementers and gatekeepers, to assess if their code meets the required test coverage before merging. However, if this decision is automated, the developers can focus on writing tests for their code and need not worry about analyzing overall code coverage requirements.

This automation can be achieved using the Jest GitHub Action. This Action analyzes the code coverage after the tests have been run, and assists the merge decision-making process. We have a target percentage for the overall code coverage and the new code. If the threshold is met, the code becomes eligible to be merged, else an override from the Service Owner/Release Engineer would be required.

<img width="369" alt="image" src="https://media.github.ncsu.edu/user/26492/files/7d72853f-f24a-4a7a-aa81-7867c418c54f">

### Phased Deployment

Big bang deployments, where all users receive an update simultaneously, can present several challenges. If there are unforeseen issues, they can affect all the users at once, leading to a widespread disruption in the user experience, and it can be challenging for developers to roll back the changes.

To counter this problem, we have implemented a phased deployment approach across global regions. We start with one region, say Asia-Pacific, and if the deployment succeeds and customer feedback is positive/neutral, we’ll consider moving further, else we can quickly roll it back. That way, we will ensure that the users affected by any unforeseen circumstances are limited and that the rolling back is seamless for developers


<img width="290" alt="image" src="https://media.github.ncsu.edu/user/26492/files/c2a944ca-6315-4ae4-bb9f-df82e046c12b">

## Pipeline Design

<img width="800" height="900" alt="image" src="https://media.github.ncsu.edu/user/26492/files/1717c9c3-0ca9-40db-8323-34638994e743">

## Specifications

### Directory Structure

	.
	├── .github									Contains workflows folder
	| 	├── workflows								Contains workflows for GitHub Actions
	| 	| 	├── build.yml							GitHub Action for deployment phase which triggers on merge to main
	| 	| 	├── dev.yml							GitHub Action which triggers on PR to dev
	| 	| 	├── release.yml							GitHub Action which triggers on PR to release or main
	├── coffee-project								Default code for coffee project
	|	├── public								Frontend code for coffee project
	|	|	├── index.html							Entry point for frontend code
	|	|	├── script.js							Helper script for frontend
	|	├── test								Contains unit tests files
	|	|	├── app.test.js							Unit tests for app.js
	|	├── .eslintignore							Ignore file for eslint configuration
	|	├── .eslintrc.js							Eslint configuration for coffee project code
	|	├── README.md								Readme for coffee project
	|	├── app.js								Backend code for coffee project
	|	├── data.js								Data file for coffee project
	|	├── jest.config.js							Jest test utility configuration
	|	├── package.json							Metadata for coffee project
	├── config									Configuration folders for all servers
	|	├── build_server							Configuration for build server
	|	|	├── ansible							Ansible folder for build server
	|	|	|	├── playbooks						Playbooks folder for build server
	|	|	|	|	├── build-server.yaml				Playbook for build server
	|	|	|	├── hosts.yaml						Inventory for build server
	|	|	├── code							Code for build server
	|	|	|	├── .eslintignore					Ignore configuration for eslint
	|	|	|	├── .eslintrc.js					Eslint configuration file
	|	|	|	├── app.js						Code for build server
	|	|	|	├── package.json					Metadata for build server
	|	├── central_server							Configuration for central server
	|	|	├── ansible							Ansible folder for central server
	|	|	|	├── playbooks						Playbooks folder for central server
	|	|	|	|	├── central-server.yaml				Playbook for central server
	|	|	|	├── hosts.yaml						Inventory for central server
	|	|	├── code							Code folder for central server
	|	|	|	├── .eslintignore					Ignore configuration for eslint
	|	|	|	├── .eslintrc.js					Eslint configuration file
	|	|	|	├── app.js						Code for central server
	|	|	|	├── package.json					Metadata for central server
	|	├── preprod_server							Configuration for preprod server
	|	|	├── ansible							Ansible folder for preprod server
	|	|	|	├── playbooks						Playbooks folder for preprod server
	|	|	|	|	├── preprod-server.yaml				Playbook for preprod server
	|	|	|	├── hosts.yaml						Inventory for preprod server
	|	|	├── code							Code folder for preprod server
	|	|	|	├── .eslintignore					Ignore configuration for preprod server
	|	|	|	├── .eslintrc.js					Eslint configuration for preprod server
	|	|	|	├── app.js						Code for preprod server
	|	|	|	├── package.json					Metadata for preprod server
	|	├── prod1_server							Configuration for prod1 server
	|	|	├── ansible							Ansible folder for prod1 server
	|	|	|	├── playbooks						Playbooks folder for prod1 server
	|	|	|	|	├── prod1-server.yaml				Playbook for prod1 server
	|	|	|	├── hosts.yaml						Inventory for prod1 server
	|	|	├── code							Code folder for prod1 server
	|	|	|	├── .eslintignore					Ignore configuration for prod1 server
	|	|	|	├── .eslintrc.js					Eslint configuration for prod1 server
	|	|	|	├── app.js						Code for prod1 server
	|	|	|	├── package.json					Metadata for prod1 server
	|	├── prod2_server							Configuration for prod2 server
	|	|	├── ansible							Ansible folder for prod2 server
	|	|	|	├── playbooks						Playbooks folder for prod2 server
	|	|	|	|	├── prod2-server.yaml				Playbook for prod2 server
	|	|	|	├── hosts.yaml						Inventory for prod2 server
	|	|	├── code							Code folder for prod2 server
	|	|	|	├── .eslintignore					Ignore configuration for prod2 server
	|	|	|	├── .eslintrc.js					Eslint configuration for prod2 server
	|	|	|	├── app.js						Code for prod2 server
	|	|	|	├── package.json					Metadata for prod2 server
	|	├── prod3_server							Configuration for prod3 server
	|	|	├── ansible							Ansible folder for prod3 server
	|	|	|	├── playbooks						Playbooks folder for prod3 server
	|	|	|	|	├── prod3-server.yaml				Playbook for prod3 server
	|	|	|	├── hosts.yaml						Inventory for prod3 server
	|	|	├── code							Code folder for prod3
	|	|	|	├── .eslintignore					Ignore configuration for prod3 server
	|	|	|	├── .eslintrc.js					Eslint configuration for prod3 server
	|	|	|	├── app.js						Code for prod3 server
	|	|	|	├── package.json					Metadata for prod3 server
	|	├── qa_server								Configuration for QA server
	|	|	├── ansible							Ansible folder for QA server
	|	|	|	├── playbooks						Playbooks folder for QA server
	|	|	|	|	├── qa-server.yaml				Playbook for QA server
	|	|	|	├── hosts.yaml						Inventory for QA server
	|	|	├── code							Code folder for QA server
	|	|	|	├── .eslintignore					Ignore configuration for QA server
	|	|	|	├── .eslintrc.js					Eslint configuration for QA server
	|	|	|	├── app.js						Code for QA server
	|	|	|	├── package.json					Metadata for QA server
	|	├── ansible-lint-config.yml						Ansible linting configuration
	├── .gitignore									Git ignore file
	├── PROJECT_PROPOSAL.md								Project proposal
	├── README.md									Readme file for project
	├── status_report_1.md								Status report 1
	└── status_report_2.md								Status report 2

### Workflow and Code description and steps for testing

#### Workflows

* Create new `feature` and `release` branchs from `dev`. Ensure to follow the case, as the rules are case-sensitive.
* Push some changes to the `feature` branch.
* Create a PR from the `feature` branch to the `dev` branch. This should trigger the GitHub Action which pulls the code from `feature` and runs lint and unit tests.
* Create a PR from the `dev` branch to the `release` branch. This should trigger the GitHub Action which pulls the code from `dev` and runs lint, unit, and code coverage tests.
* Create a PR from the `release` branch to the `main` branch. This should trigger the GitHub Action which pulls the code from `dev` and runs lint, unit, and code coverage tests.
* Merge the PR into main. This should trigger the deployment workflow, which first checks for the Ansible and code linting in the configuration and code for all the stages' servers, then packages the code and uploads it to a `central server`, which is then sequentially pulled by each stages' server (QA, preprod, prod1, prod2, and prod3). Currently approvals are required from the development team and wait (bake) times are configured, but you should see the changes deploying in each stage.

#### Code

**Note**: We haven't pushed any changes to the code of the `coffee-project` apart from integrating `Jest` (for testing and code coverage) and `Eslint` (for lint test). These required changes to `package.json` as well, however, the application code was left untouched.

* After the `Ansible lint` and `code lint` is satisfied, the `central server` (emulating cloud storage) is [configured](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/central_server/ansible/playbooks/central-server.yaml) using Ansible and Docker. Its [code](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/central_server/code/app.js) creates an `HTTP server` on port `8080`, which accepts `POST` and `GET` requests. The `build server` would use the `POST` request to upload artifacts to the `central server`, while the `preprod`, `QA`, and `prod-*` servers would use `GET` request to get the artifacts. The final deployment workflow
* After the `central server` is configured, the [configuration](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/build_server/ansible/playbooks/build-server.yaml) of `build server` starts, which includes pulling the code and saving it in a zipped file on its local disk. Its [code](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/build_server/code/app.js) reads the zipped artifacts from the local disk, and uses an HTTP client to upload it to the central server.
* This is followed by the [configuration](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/qa_server/ansible/playbooks/qa-server.yaml) of the `QA server`. Its [code](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/qa_server/code/app.js) uses an HTTP client to get the zipped artifacts from the central server, which is then unzipped and prepared for testing by Ansible.
* After this, the `preprod server` is [configured](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/preprod_server/ansible/playbooks/preprod-server.yaml). Its [code](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/preprod_server/code/app.js) uses an HTTP client to get the zipped artifacts from the central server, which is then unzipped and prepared for testing by Ansible.
* This triggers the `phased deployment`. The `prod1 server` is [configured](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/prod1_server/ansible/playbooks/prod1-server.yaml) first. Its [code](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/prod1_server/code/app.js) uses an HTTP client to get the zipped artifacts from the central server, which is then unzipped and exposed to the users in region handled by prod-1 phase.
* Following this, the `prod2 server` is [configured](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/prod2_server/ansible/playbooks/prod2-server.yaml). Its [code](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/prod2_server/code/app.js) uses an HTTP client to get the zipped artifacts from the central server, which is then unzipped and exposed to the users in region handled by prod-2 phase.
* Finally, the `prod3 server` is [configured](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/prod3_server/ansible/playbooks/prod3-server.yaml). Its [code](https://github.ncsu.edu/CSC-519-Project/DevOps-project/blob/main/config/prod3_server/code/app.js) uses an HTTP client to get the zipped artifacts from the central server, which is then unzipped and exposed to the users in region handled by prod-3 phase.

### Sample deployment output

<img width="805" alt="image" src="https://media.github.ncsu.edu/user/26492/files/1b4ccaf4-5afe-4d26-8b35-b4f62346b7ba">

### Releases

All the releases (along with the latest) for the project can be found [here](https://github.ncsu.edu/CSC-519-Project/DevOps-project/releases).

### Environments

GitHub Environments for the pipeline can be found [here](https://github.ncsu.edu/CSC-519-Project/DevOps-project/settings/environments).

### Environment Deployments

The deployment status in the GitHub Environments can be found [here](https://github.ncsu.edu/CSC-519-Project/DevOps-project/deployments).

### PRs and Issues

Issues and PRs involved in the project development can be found [here](https://github.ncsu.edu/CSC-519-Project/DevOps-project/issues?q=is%3Aissue+is%3Aclosed) and [here](https://github.ncsu.edu/CSC-519-Project/DevOps-project/pulls?q=is%3Apr+is%3Aclosed).

### Contributors ✨

* Aastha Singh (asingh59)
* Akash Gupta (agupta57)
