# Decent looking diagrams for engineers - headless

Send dld4e.com yaml files to this service to obtain server side rendered network diagrams.

See dld4e.com

## Usage

So far it does not work properly. Test with

        npm install
        node src/index.js
        curl -X POST -d examples/groups.yml http://localhost:3030 > test.svg


## License

This project is licensed under the MIT License. [MIT License](http://www.opensource.org/licenses/MIT).