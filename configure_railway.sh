#!/bin/bash
# Configura variáveis de ambiente no Railway via API

TOKEN="17dda851-4ff6-4d37-a585-6e0418478878"
PROJECT="0751a11e-2edd-45b3-8be8-2d4e42c30a47"
ENV="production"

echo "Configurando variáveis no Railway..."

# Lista de variáveis a configurar
declare -a VARS=(
    "ADMIN_USER:admin"
    "ADMIN_PASS:admin123"
    "SITE_NAME:SPER Framework"
    "DEBUG:false"
)

for var in "${VARS[@]}"; do
    IFS=':' read -r name value <<< "$var"
    echo -n "Setting $name... "
    
    curl -s -X POST "https://backboard.railway.app/graphql" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"mutation UpsertVariable(\$input: UpsertVariableInput!) { upsertVariable(input: \$input) { id name value } }\",
            \"variables\": {
                \"input\": {
                    \"projectId\": \"$PROJECT\",
                    \"environmentId\": \"$ENV\",
                    \"name\": \"$name\",
                    \"value\": \"$value\"
                }
            }
        }" > /dev/null 2>&1 && echo "OK" || echo "FAIL"
done

echo ""
echo "Verificando variáveis..."
curl -s "https://backboard.railway.app/graphql" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"query\": \"query GetProject(\$id: String!) { project(id: \$id) { environments { edges { node { variables { edges { node { name } } } } } } } }\",
        \"variables\": { \"id\": \"$PROJECT\" }
    }" | grep -o '"name":"[^"]*"' | sort -u
