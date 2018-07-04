cat groups.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > groups.png
cat NTP.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > NTP.png
cat labels.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > labels.png
cat relative_positions.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > relative_positions.png
cat urls.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > urls.png
cat coffee.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > coffee.png
cat curves.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > curves.png
cat group_connections.yaml | curl -v -X POST -H "Content-Type: text/yaml" --data-binary @- http://localhost:3030 > group_connections.png

