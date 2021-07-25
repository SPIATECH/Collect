#THIS IS A ONE TIME ACTION:
#Download the Open API generator
wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/4.3.0/openapi-generator-cli-4.3.0.jar 
sudo apt install node-typescript
sudo apt install node-url
sudo apt install node-axios sudo apt install openjdk-8-jre-headless
#Do the steps below, everytime to update the API Download the latest API definition file:
wget http://127.0.0.1:8090/openapi.yaml 

#Re create the API
java -jar openapi-generator-cli-4.3.0.jar generate -g typescript-axios -i openapi.yaml -o /tmp/openjs/
cd /tmp/openjs/

# Build the .js (javascript) apis
#You can ignore URL and axios module missing errors 
tsc *.ts
cp *.ts *.js i4Suite/Alerts/AlertUI/alert-ui-react/src/api

