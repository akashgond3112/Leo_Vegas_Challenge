```markdown
# Leo Vegas Challenge

## Prerequisites

The prerequisites or dependencies that needed to be installed and configured for the application to work. Include software, libraries, or services.

- Node.js (version v20.3.0)
- NPM (version 9.6.7)
- Docker
- Mysql

## Getting Started

Instructions on how to get the application up and running.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akashgond3112/Leo_Vegas_Challenge.git
   checkout main branch
   cd your-app
   ```

2. If you want to run the app and test without using Docker:

   a. Install dependencies:
      ```bash
      npm install
      ```

   b. Create a `.env` file and set the required environment variables, such as database connection details:

      ```env
      NODE_ENV=development
      DATABASE_URL="mysql://root:root_password@localhost:3306/test_database" # Change the user/password/database name accordingly
      PORT=8000
      JWT_SECRET=XbIC77xtdTOmR6ENRKdQyeUJc70UFiEK
      ```

   c. Make sure the user has the necessary privileges:

      ```sql
      GRANT ALL PRIVILEGES ON *.* TO 'test_user'@'%' WITH GRANT OPTION; -- If any other user is used.
      FLUSH PRIVILEGES;
      ```

   d. To map your data model to the database schema, use the Prisma migrate CLI commands:

      ```bash
      npx prisma migrate dev --name init
      ```

   e. To run only the application:

      ```bash
      npm run dev
      ```

   f. To run the tests:

      ```bash
      npm run test
      ```

3. If you want to run the tests using Docker:

   a. Create a `.env` file and set the required environment variables, such as database connection details:

      ```env
      NODE_ENV=development
      PORT=8000
      JWT_SECRET=XbIC77xtdTOmR6ENRKdQyeUJc70UFiEK
      DATABASE_URL="mysql://root:root_password@mysql-container:3306/test_database"
      ```

   b. Build the application image:

      ```bash
      docker build -t leo_vegas .
      ```

   c. To run the tests:

      ```bash
      docker-compose run node-app npm test # Currently having some issue; try to run the command 2 times, need more debugging.
      ```
```
Create a cluster.
- minikube start --nodes 2 -p local-cluster --driver=docker
Check status of cluster.
- minikube status -p local-cluster
Check the context.
- kubectl config get-contexts
Set the context.
- kubectl config set-context local-cluster
Add a new node.
- minikube node add --worker -p local-cluster(cluster name)
How to get the node IP address
- minikube ip -p local-cluster(cluster name)
Delete a node.
- minikube node delete <node-name> local-cluster(cluster name)
How to aacess the minikube dashboard.
- minikube dashboard --url -p local-cluster
How to get pods labels details
- kubectl get pod --show-labels
How to filter the pods based on the labels
- kubectl get pod -l team=integrations
How to get the pod information
- kubectl get pod <pod-name> -o wide
How to get the pod information in yaml format
- kubectl get pod <pod-name> -o yaml
How to get the full description of the pod
- kubectl describe pod <pod-name>
How to get into the pod
- kubectl exec -it <pod-name> -- bash/sh
How to get into a specific container inside the pod
- kubectl exec -it <pod-name> -c <container-name> -- bash/sh
How we can port forward
- kubectl port-forward <pod-name> <local-port>:<container-port> 
How to check the pod logs
- kubectl logs <pod-name>
How to get the replica sets
- kubectl get rs
How to delete all the resources e.g pods/services/replicasets.
- kubectl delete all --all
How to scale the replica set without editing the deployment file (not adviceable)
- kubectl scale --replicas=4 <deployment-name>
How to update the image version
- kubectl set image <deployment-name> <container-name>=version-number --record
How to check the history of the rollout
- kubectl rollout history <deployment-name>
How to rollout to the previous version
- kubectl rollout undo <deployment-name>
How to rollout to the specific version
- kubectl rollout undo <deployment-name> --to-revision=1
How to get the endpoints
- kubectl get endpoints