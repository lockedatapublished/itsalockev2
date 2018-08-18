
const gulp = require('gulp')
 
require('hugo-search-index/gulp')(gulp)
 


gulp.task('default', ['hugo-search-index'])