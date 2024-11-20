# api-cats


curl -X POST http://localhost:9000/api/gatos \
-H "Content-Type: application/json" \
-d '{
    "name": "Oliver",
    "image": "/images/oliver.jpg",
    "description": "Un gato cariñoso y juguetón",
    "gender": "Macho",
    "observations": "Le encanta jugar con otros gatos"
}'