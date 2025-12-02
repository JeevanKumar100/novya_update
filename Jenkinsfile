pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // clone your repo so docker-compose.yml is available in workspace
        git url: 'https://github.com/srikrishna206/novya_update.git', branch: 'main'
      }
    }

    stage('Build images') {
      steps {
        sh '''
        docker build -t srikrishna206/novya-backend:latest ./backend
        docker build -t srikrishna206/novya-ai-backend:latest ./backend/ai_backend
        docker build -t srikrishna206/novya-frontend:latest ./novya-frontend-main
        '''
      }
    }

    stage('Push images') {
      steps {
        // replace 'docker-registry-creds' with your Jenkins credentials id
        withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
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
        sh '''
        # Ensure we are in workspace where docker-compose.yml exists
        pwd
        ls -la

        # Bring down old containers, pull latest images, and start upgraded stack
        docker compose down || true
        docker compose pull || true
        docker compose up -d
        '''
      }
    }
  }

  post {
    success { echo 'Deployment finished successfully' }
    failure { echo 'Pipeline failed — check logs' }
  }
}
