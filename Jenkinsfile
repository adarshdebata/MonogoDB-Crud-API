node {
    // Tools and environment variables setup
    def mongoUri = credentials('MONGO_URI')
    def dbName = credentials('DB_NAME')
    def dockerHubUser = credentials('dockerhub-username')
    def dockerHubToken = credentials('dockerhub-access-token')
    def emailRecipients = 'adarshdebata00@gmail.com'

    try {
        // Clone Repository Stage - Requires approval from User 2
        stage('Clone Repository') {
            def approval = input message: "Waiting for approval from User 2 (aaditdebata) or Admin", 
                                 submitter: 'aaditdebata'
            echo "Approval provided by: ${approval}"

            echo 'Cloning repository...'
            git branch: 'main', url: 'https://github.com/adarshdebata/MonogoDB-Crud-API.git'
        }

        // Install Dependencies
        stage('Install Dependencies') {
            echo 'Installing Node.js dependencies...'
            sh 'npm install'
        }

        // Unit Test
        stage('Unit Test') {
            echo 'Running tests...'
            sh 'npm test'
        }

        // Login to DockerHub
        stage('Login to DockerHub') {
            echo 'Logging in to DockerHub...'
            sh """
                echo ${dockerHubToken} | docker login -u ${dockerHubUser} --password-stdin
            """
        }

        // Build Docker Image - Requires approval from User 3
        stage('Build Docker Image') {
            def approval = input message: "Waiting for approval from User 3 (naruto) or Admin", 
                                 submitter: 'naruto'
            echo "Approval provided by: ${approval}"

            echo 'Building Docker image...'
            sh 'docker build -t mongodb-crud-nodejs .'
        }

        // Push Docker Image to DockerHub
        stage('Push Docker Image to DockerHub') {
            echo 'Tagging Docker image...'
            sh "docker tag mongodb-crud-nodejs ${dockerHubUser}/mongodb-crud-nodejs:latest"

            echo 'Pushing Docker image to DockerHub...'
            sh "docker push ${dockerHubUser}/mongodb-crud-nodejs:latest"
        }

        // Run Application (Optional)
        stage('Run Application (Optional)') {
            echo 'Running the app in the background...'
            sh 'nohup node server.js &'
        }

    } catch (Exception e) {
        // Handle failures
        currentBuild.result = "FAILURE"
        echo "Build failed: ${e.getMessage()}"
        mail to: emailRecipients,
             subject: "Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
             body: "Unfortunately, the build failed. Please check the logs at: ${env.BUILD_URL}"
        throw e
    } finally {
        // Cleanup and send notifications
        stage('Post Build Cleanup') {
            echo 'Cleaning up...'
            sh 'pkill -f "node server.js"'

            if (currentBuild.result == "SUCCESS") {
                echo 'Build and Docker Push completed successfully!'
                mail to: emailRecipients,
                     subject: "Jenkins Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "Good news! The build was successful. Check it out at: ${env.BUILD_URL}"
            }
        }
    }
}
