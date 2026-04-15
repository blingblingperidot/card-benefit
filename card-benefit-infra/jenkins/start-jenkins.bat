@echo off
echo Jenkins 컨테이너 확인 중...

docker ps -a --format "{{.Names}}" | findstr /X "jenkins" > nul 2>&1
if %errorlevel% == 0 (
    echo Jenkins 컨테이너 존재 - 시작합니다.
    docker start jenkins
) else (
    echo Jenkins 컨테이너 없음 - 새로 생성합니다.
    docker run -d ^
        --name jenkins ^
        --restart=always ^
        -p 8088:8080 ^
        -p 50000:50000 ^
        -v jenkins_home:/var/jenkins_home ^
        jenkins/jenkins:lts
)

echo Jenkins 시작 완료! http://localhost:8088 접속
pause