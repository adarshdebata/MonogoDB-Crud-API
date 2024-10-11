node {
    // Load tools
    def nodeHome = tool name: 'NodeJS'

    // Setup environment variables
    def MONGO_URI = credentials('MONGO_URI')
    def DB_NAME = credentials('DB_NAME')
    def DOCKER_HUB_USER = credentials('dockerhub-username')
    def DOCKER_HUB_TOKEN = credentials('dockerhub-access-token')
    def emailRecipients = 'adarshdebata00@gmail.com'

    try {
        env.PATH = "${nodeHome}/bin:${env.PATH}"

        stage('Clone Repository') {
            // Request approval from User 2
            def inputApproval = input message: 'User 2: Approve Clone Repository stage?', submitter: 'aaditdebata'
            
            echo 'Cloning repository...'
            git branch: 'main', url: 'https://github.com/adarshdebata/MonogoDB-Crud-API.git'
        }

        // 2. Install Dependencies Stage
        stage('Install Dependencies') {
            echo 'Installing Node.js dependencies...'
            sh 'npm install'
        }

        // 3. Unit Test Stage
        stage('Unit Test') {
            echo 'Running tests...'
            sh 'npm test -- --forceExit'
        }

        // 4. Login to DockerHub Stage
        stage('Login to DockerHub') {
            echo 'Logging in to DockerHub...'
            sh """
                echo ${DOCKER_HUB_TOKEN} | docker login -u ${DOCKER_HUB_USER} --password-stdin
            """
        }

        // 5. Build Docker Image Stage
        stage('Build Docker Image') {
            // Request approval from User 3
            def inputApproval = input message: 'User 3: Approve Build Docker Image stage?', submitter: 'naruto'
          
            echo 'Building Docker image...'
            sh 'docker build -t mongodb-crud-nodejs .'
        }

        // 6. Push Docker Image to DockerHub Stage
        stage('Push Docker Image to DockerHub') {
            echo 'Tagging Docker image...'
            sh 'docker tag mongodb-crud-nodejs ${DOCKER_HUB_USER}/mongodb-crud-nodejs:latest'

            echo 'Pushing Docker image to DockerHub...'
            sh 'docker push ${DOCKER_HUB_USER}/mongodb-crud-nodejs:latest'
        }

        // 7. Run Application Stage (Optional)
        stage('Run Application (Optional)') {
            echo 'Running the app in the background...'
            sh 'nohup node server.js &'
        }

    } catch (Exception e) {
        // Handle build failure
        currentBuild.result = 'FAILURE'
        echo "Build failed: ${e.getMessage()}"
        mail to: emailRecipients,
             subject: "Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
             body: "Unfortunately, the build failed. Please check the logs at: ${env.BUILD_URL}"
    } finally {
        // Cleanup stage
        stage('Cleanup') {
            echo 'Cleaning up...'
            sh 'pkill -f "node server.js"'

            // Success email notification
            if (currentBuild.result == 'SUCCESS') {
                echo 'Build and Docker Push completed successfully!'
                mail to: emailRecipients,
                     subject: "Jenkins Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "Good news! The build was successful. Check it out at: ${env.BUILD_URL}"
            }
        }
    }
}
