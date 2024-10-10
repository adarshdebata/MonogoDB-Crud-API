pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // Refers to the NodeJS installation on Jenkins
    }

    environment {
        MONGO_URI = credentials('MONGO_URI') 
        DB_NAME = credentials('DB_NAME')         
        DOCKER_HUB_USER = credentials('dockerhub-username')  
        DOCKER_HUB_TOKEN = credentials('dockerhub-access-token') 
        EMAIL_RECIPIENTS = credentials('email-recipients')  // Secure email recipients
    }

    stages {
        // 1. User 2 needs to approve the "Clone Repository" stage.
        stage('Clone Repository') {
            steps {
                script {
                    // Request approval from User 2 before cloning the repository.
                    def user2Approval = input message: 'User 2: Approve Clone Repository stage?', submitter: 'user2'
                    echo "Stage approved by User: ${user2Approval}"
                }
                echo 'Cloning repository...'
                git branch: 'main', url: 'https://github.com/adarshdebata/MonogoDB-Crud-API.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'  // Run tests
            }
        }

        stage('Login to DockerHub') {
            steps {
                script {
                    echo 'Logging in to DockerHub...'
                    sh """
                    echo $DOCKER_HUB_TOKEN | docker login -u $DOCKER_HUB_USER --password-stdin
                    """
                }
            }
        }

        // 2. User 3 needs to approve the "Build Docker Image" stage.
        stage('Build Docker Image') {
            steps {
                script {
                    // Request approval from User 3 before building the Docker image.
                    def user3Approval = input message: 'User 3: Approve Build Docker Image stage?', submitter: 'user3'
                    echo "Stage approved by User: ${user3Approval}"
                }
                echo 'Building Docker image...'
                sh 'docker build -t mongodb-crud-nodejs .'  // Build Docker image using Dockerfile
            }
        }

        stage('Push Docker Image to DockerHub') {
            steps {
                script {
                    echo 'Tagging Docker image...'
                    sh 'docker tag mongodb-crud-nodejs $DOCKER_HUB_USER/mongodb-crud-nodejs:latest'

                    echo 'Pushing Docker image to DockerHub...'
                    sh 'docker push $DOCKER_HUB_USER/mongodb-crud-nodejs:latest'
                }
            }
        }

        stage('Run Application (Optional)') {
            steps {
                echo 'Running the app in the background...'
                sh 'nohup node server.js &'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'pkill -f "node server.js"'  // Ensure the server is stopped after the build completes
        }
        success {
            echo 'Build and Docker Push completed successfully!'
            // Send email notification securely
            script {
                def recipients = env.EMAIL_RECIPIENTS
                def subject = "Jenkins Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
                def body = "Good news! The build was successful. Check it out at: ${env.BUILD_URL}"
                mail to: recipients, subject: subject, body: body
            }
        }
        failure {
            echo 'Build failed!'
            // Send failure email notification
            script {
                def recipients = env.EMAIL_RECIPIENTS
                def subject = "Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
                def body = "Unfortunately, the build failed. Please check the logs at: ${env.BUILD_URL}"
                mail to: recipients, subject: subject, body: body
            }
            
        }
    }
}
