sudo docker build -t pokemon-api .

sudo docker stop pokemon-api

sudo docker rm -f pokemon-api

sudo docker run -p 3000:3000 --restart=always -e DATABASE_NAME=pokemons -e DATABASE_USER=root -e DATABASE_PASSWORD=root -e DATABASE_HOST=localhost  --name pokemon-api pokemon-api &