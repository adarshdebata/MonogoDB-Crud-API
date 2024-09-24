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
        stage('Run Application') {
            steps {
                echo 'Running the app in the background...'
                // Run the server in the background and save the process ID (PID)
                sh 'nohup node server.js & echo $! > .pidfile'
            }
        }
    }
    post {
        success {
            echo 'Build completed successfully!'
            // Kill the background server process after successful build
            sh 'kill $(cat .pidfile)'
        }
        failure {
            echo 'Build failed!'
            // Kill the background server process if the build failed
            sh 'kill $(cat .pidfile) || true'
        }
        always {
            echo 'Cleaning up...'
            // Remove the PID file
            sh 'rm -f .pidfile'
        }
    }
}
