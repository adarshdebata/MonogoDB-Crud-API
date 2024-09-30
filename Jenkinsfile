pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Refers to the NodeJS installation on Jenkins
    }
    environment {
        MONGO_URI = credentials('MONGO_URI')   // Fetch MONGO_URI from Jenkins credentials
        DB_NAME = credentials('DB_NAME')       // Fetch DB_NAME from Jenkins credentials
    }
    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }
       stage('Run Tests') {
            steps {
                echo 'Running Playwright tests...'
                sh 'npx jest --forceExit'
            }
        }

        stage('Run Application') {
            steps {
                echo 'Running the app in the background...'
                sh 'nohup node server.js &'  
            }
        }

    }
    post {
        always {
            echo 'Cleaning up...'
            sh 'pkill -f "node server.js"' // Ensure the server is stopped
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
