#[gulp](https://github.com/wearefractal/gulp)-glob-resources

> Extracts js/css/less resources from html

## Installation

```
npm install --save-dev gulp-resources
```

## Information

With this gulp plugin you can extract js/css/less resources from your html and pipe them to other plugins.

```js

var gulp = require('gulp'),
    resources = require('glob-resources');

gulp.task('default', function () {
    return gulp.src('./template.html')
        .pipe(resources())
        .pipe(gulp.dest('./tmp'));
});
```

Running this task for such html

```html

<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">

	<link href="css/style1.css" rel="stylesheet" type="text/css">
    <script src="scripts/script1.js"></script>
    <script src="scripts/script2.js"></script>
    <script>
        console.log("inline script should not be touched by gulp-resources");
    </script>
</head>
<body>
    <span>&quot;</span>
</body>
</html>
```

will produce such folder with sources:

```
tmp
└─css
    └─style1.css
└─scripts
    ├─script1.js
    └─script2.js
```
## License

[MIT](http://en.wikipedia.org/wiki/MIT_License) @ Eugene Gluhotorenko
