pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Refers to the NodeJS installation on Jenkins
    }
    environment {
        MONGO_URI = credentials('MONGO_URI')   // Fetch MONGO_URI from Jenkins credentials
        DB_NAME = credentials('DB_NAME')       // Fetch DB_NAME from Jenkins credentials
        JENKINS_ENV = 'true'  // Set a variable to prevent server from running
    }
    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }
        stage('Run Application') {
            steps {
                echo 'Running the app...'
                sh 'node server.js'
            }
        }
    }
    post {
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
