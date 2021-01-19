yq w -i deployment.yml spec.template.spec.containers[0].image jduimovich/github-runner-fd:latest 
yq w -i deployment.yml spec.template.spec.containers[0].env[0].value jduimovich 
yq w -i deployment.yml spec.template.spec.containers[0].env[1].value https://github.com/jduimovich/runnertest