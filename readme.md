# Decent looking diagrams for engineers - headless

Send dld4e.com yaml files to this service to obtain server side rendered network diagrams.

![Groups](https://raw.githubusercontent.com/bonndan/dld4e-headless/master/examples/groups.png)


See dld4e.com

## Usage

Run with

        docker run -p 3030:3030 bonndan/dld4e-headless:latest 

Test SVG generation ((send accept header) with

        cat examples/groups.yaml | curl -v -X POST -H "Content-Type: text/yaml" -H "Accept: image/svg+xml" --data-binary @- http://localhost:3030 > /tmp/groups.svg

Test PNG generation (default) with

        cat examples/groups.yaml | curl -v -X POST -H "Content-Type: text/yaml"  --data-binary @- http://localhost:3030 > /tmp/groups.png

## Development

This app requires imagemagick.

        sudo apt-get install imagemagick
        npm install

 Run with

        node --inspect src/index.js

or for debugging in docker

        docker run -p 3030:3030 -p 9229:9229 bonndan/dld4e-headless:latest

## License

This project is licensed under the MIT License. [MIT License](http://www.opensource.org/licenses/MIT).
