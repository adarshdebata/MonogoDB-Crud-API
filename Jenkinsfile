node {
    def MONGO_URI = credentials('MONGO_URI') 
    def DB_NAME = credentials('DB_NAME')         
    def DOCKER_HUB_USER = credentials('dockerhub-username')  
    def DOCKER_HUB_TOKEN = credentials('dockerhub-access-token') 
    def EMAIL_RECIPIENTS = 'adarshdebata00@gmail.com'

    try {
        stage('Clone Repository') {
            // Request approval from User 2 before cloning the repository
            def approver = input message: 'User 2: Approve Clone Repository stage?', 
                                   submitter: 'aaditdebata', 
                                   submitterParameter: 'APPROVER'
            echo "Approval for Clone Repository provided by: ${approver}"
            
            // Clone the Git repository
            echo 'Cloning repository...'
            git branch: 'main', url: 'https://github.com/adarshdebata/MonogoDB-Crud-API.git'
        }

        stage('Install Dependencies') {
            echo 'Installing Node.js dependencies...'
            sh 'npm install'
        }

        stage('Unit Test') {
            echo 'Running tests...'
            sh 'npm test'  // Run tests
        }

        stage('Login to DockerHub') {
            echo 'Logging in to DockerHub...'
            sh """
            echo $DOCKER_HUB_TOKEN | docker login -u $DOCKER_HUB_USER --password-stdin
            """
        }

        stage('Build Docker Image') {
            // Request approval from User 3 before building the Docker image
            def approver = input message: 'User 3: Approve Build Docker Image stage?', 
                                   submitter: 'naruto', 
                                   submitterParameter: 'APPROVER'
            echo "Approval for Build Docker Image stage provided by: ${approver}"
            
            echo 'Building Docker image...'
            sh 'docker build -t mongodb-crud-nodejs .'  // Build Docker image using Dockerfile
        }

        stage('Push Docker Image to DockerHub') {
            echo 'Tagging Docker image...'
            sh 'docker tag mongodb-crud-nodejs $DOCKER_HUB_USER/mongodb-crud-nodejs:latest'
            
            echo 'Pushing Docker image to DockerHub...'
            sh 'docker push $DOCKER_HUB_USER/mongodb-crud-nodejs:latest'
        }

        stage('Run Application (Optional)') {
            echo 'Running the app in the background...'
            sh 'nohup node server.js &'
        }
    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        echo "Build failed: ${e.message}"
        throw e
    } finally {
        stage('Cleanup') {
            echo 'Cleaning up...'
            sh 'pkill -f "node server.js"'
        }
    }

    // Post-build email notification
    if (currentBuild.result == 'SUCCESS') {
        emailext subject: "Jenkins Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Good news! The build was successful. Check it out at: ${env.BUILD_URL}",
                 to: EMAIL_RECIPIENTS
    } else {
        emailext subject: "Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Unfortunately, the build failed. Please check the logs at: ${env.BUILD_URL}",
                 to: EMAIL_RECIPIENTS
    }
}
