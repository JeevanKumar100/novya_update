pipeline {
  agent any

  stages {

    stage('Checkout') {
      steps {
        git url: 'https://github.com/srikrishna206/novya_update.git', branch: 'main'
      }
    }
    stage("Sonarqube Analysis "){
            steps{
                withSonarQubeEnv('SonarQube') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=novya \
                    -Dsonar.projectKey=novya '''
                }
            }
        }
        stage("quality gate"){
           steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token' 
                }
            } 
        }

    stage('cleanup of images and containers'){
    steps{
          sh '''
docker system prune -a -f --volumes
'''
    }
  }

    stage('Build images') {
      steps {
        // Pass AI key only to AI backend build (optional)
        withCredentials([
          string(credentialsId: 'novya-ai-key', variable: 'AI_KEY')
        ]) {
          sh '''
          docker build -t srikrishna206/novya-backend:latest ./backend

          docker build --build-arg AI_KEY="$AI_KEY" \
            -t srikrishna206/novya-ai-backend:latest ./backend/ai_backend

          docker build -t srikrishna206/novya-frontend:latest ./novya-frontend-main
          '''
        }
      }
    }

    stage('Push images') {
      steps {
        withCredentials([
          usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')
        ]) {
          sh '''
          echo "$REG_PASS" | docker login -u "$REG_USER" --password-stdin

          docker push srikrishna206/novya-backend:latest
          docker push srikrishna206/novya-ai-backend:latest
          docker push srikrishna206/novya-frontend:latest
          '''
        }
      }
    }

    stage('Deploy (docker compose on Jenkins)') {
      steps {

        // <-- This block creates .env file
        withCredentials([
          string(credentialsId: 'novya-ai-key', variable: 'AI_KEY'),
          string(credentialsId: 'novya-secret-key', variable: 'SECRET_KEY')
        ]) {

          sh '''
          echo "===== Creating .env file ====="

          cat > .env <<EOF
AI_API_KEY=${AI_KEY}
SECRET_KEY=${SECRET_KEY}
EOF

          chmod 600 .env
          echo ".env created successfully"
          cat .env

          echo "===== Deploy using docker compose ====="

          docker compose down || true
          docker compose pull || true
          docker compose --env-file .env up -d

          echo "Cleaning up .env file..."
          rm -f .env
          '''
        }
      }
    }
  }

  post {
    success { echo 'Deployment finished successfully' }
    failure { echo 'Pipeline failed — check logs' }
  }
}

