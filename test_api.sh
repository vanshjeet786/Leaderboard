#!/bin/bash

# Configuration
PROJECT_URL="https://mpzmyzgsprxexqbfnqsj.supabase.co"
API_KEY="super-secret-api-key-123"

echo "=== Testing API Key Authentication (Invalid Key) ==="
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" \
  -H "x-api-key: wrong-key" \
  -H "Content-Type: application/json" \
  -d '{"game_id":"G001", "player_id":"P001", "score":100}' | grep -q "Unauthorized" && echo "PASS: Correctly rejected invalid API key" || echo "FAIL: Should have rejected invalid API key"

echo -e "\n=== Testing Insert First Score (G001, P001, 100) ==="
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"game_id":"G001", "player_id":"P001", "score":100}'

echo -e "\n=== Testing Update with Higher Score (G001, P001, 200) ==="
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"game_id":"G001", "player_id":"P001", "score":200}'

echo -e "\n=== Testing Attempt Lower Score (G001, P001, 150) ==="
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"game_id":"G001", "player_id":"P001", "score":150}'

echo -e "\n=== Testing Invalid Player ==="
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"game_id":"G001", "player_id":"NON_EXISTENT", "score":100}'

echo -e "\n=== Testing Invalid Game ==="
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"game_id":"NON_EXISTENT", "player_id":"P001", "score":100}'

echo -e "\n=== Seeding More Scores for G001 Leaderboard ==="
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" -H "x-api-key: $API_KEY" -H "Content-Type: application/json" -d '{"game_id":"G001", "player_id":"P002", "score":500}' > /dev/null
curl -s -X POST "$PROJECT_URL/functions/v1/enter-leaderboard" -H "x-api-key: $API_KEY" -H "Content-Type: application/json" -d '{"game_id":"G001", "player_id":"P003", "score":300}' > /dev/null

echo -e "\n=== Testing Leaderboard Retrieval (G001) ==="
curl -s -X GET "$PROJECT_URL/functions/v1/get-game-leaderboard?game_id=G001&limit=5" | jq .
