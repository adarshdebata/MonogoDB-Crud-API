pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // Refers to the NodeJS installation on Jenkins
    }

    environment {
        // fetch from Jenkins credentials
        MONGO_URI = credentials('MONGO_URI') 
        DB_NAME = credentials('DB_NAME')         
        DOCKER_HUB_USER = credentials('dockerhub-username')  
        DOCKER_HUB_TOKEN = credentials('dockerhub-access-token')  
        EMAIL_RECIPIENTS = 'adarshdebata00@gmail.com'
    }

    stages {
        stage('Clone Repository') {
            steps {
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
                sh 'npm test'  // Run test
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

       stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh 'docker build -t mongodb-crud-nodejs .'  // Build Docker image using Dockerfile
                }
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
            sh 'pkill -f "node server.js"' // Ensure the server is stopped after the build completes
        }
        success {
            echo 'Build and Docker Push completed successfully!'
            mail to: "${EMAIL_RECIPIENTS}",
                 subject: "Jenkins Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Good news! The build was successful. Check it out at: ${env.BUILD_URL}"
        }
        failure {
            echo 'Build failed!'
        }
    }
}
