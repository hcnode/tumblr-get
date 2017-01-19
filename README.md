
## Usage

install tumblr-get globally

`npm install tumblr-get -g`

### Cli

options
```bash
harry$ tumblr-get -h

  Usage: tumblr-get [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -i, --id [String]      id of tumblr
    -o, --output [String]  Optional, dir to save the images, default is current path
    -t, --timeout [n]      Optional, timeout of requesting image, default is 10s
    -c, --category [String]  Optional, video or image, default is both

```

sample

`tumblr-get -i movieposteroftheday -o /Users/harry -t 2000 -c image`

this command mean: 

 * get all images from [http://movieposteroftheday.tumblr.com/archive](http://movieposteroftheday.tumblr.com/archive)
 * save images to /Users/harry
 * image request timeout is 2000ms
 * get image only

### code
see [test](https://github.com/hcnode/tumblr-get/blob/master/test/test.js)
