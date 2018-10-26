const gulp = require('gulp')
require('hugo-search-index/gulp')(gulp)
 
gulp.task('cpindex', function() {
    gulp.src('search*')
        .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['hugo-search-index', 'cpindex' ])
