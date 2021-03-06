---
title: A crystal clear book draw
authors: maelle
type: post
date: 2018-06-01
spacious_page_layout:
  - default_layout
categories:
  - Data Science
  - R
tags:
  - r

---

As you might know, every month, a random Locke Data Twitter follower wins an excellent data science book! This month's gift was ["An Introduction to Statistical Learning: with Applications in R"](http://geni.us/introtostatslearning), a classic and useful textbook. In this post I'll give you some `magick`-al tips from behind-the-scenes of this month's winner announcement. It'll feature learning from my mistakes, and reading from a crystal ball... or more seriously, image manipulation in R!

## An Introduction to Learning from my Mistakes

In this month's instalment, I corrected two of my previous mistakes, here is what I learnt...

### Package your code right away!

This book draw was the fourth one I was in charge of. The first three times I simply (or so I thought) put an R script and pictures in a GitHub repo, merely listing the dependencies in a DESCRIPTION file... how suboptimal! This month I transformed [the repo](https://github.com/lockedata/twitterbookdraw) into a package, moving the old scripts to a subfolder after naming them correctly in order to no longer have one called... "code.R", and creating a function to draw the winner.

Now the repo looks good which is nice but I can't but regret not having organized it right away. I'd have saved time and energy and my pride. Steph actually maintains a nifty package helping with proper project setup, [`pRojects`](https://github.com/lockedata/pRojects), that'll soon get some love and will probably be featured on this blog. Stay tuned!

### Automate what can be automated

As I confessed [last month](https://itsalocke.com/blog/a-particles-arly-fun-book-draw/), in the last announcement tweet the winner's Twitter handle was different in the tweet text and the gif. Now it won't happen ever again because I wrote an `announce_winner` function so that the worfklow now is

* Draw the winner via `twitterbookdraw::draw_winner()`

* Automatically create tweet text using that winner `twitterbookdraw::announce_winner()`

* Automatically create visualization using that winner via  `twitterbookdraw::show_winner()`

You can witness this [in `twitterbookdraw` README](https://github.com/lockedata/twitterbookdraw#2018-06-01).

Writing `announce_winner` was quite pleasing thanks to using the nice [`glue` package](https://github.com/tidyverse/glue) by RStudio [Jim Hester](http://www.jimhester.com/):

```r
announce_winner <- function(winner, book, book_url){
  glue::glue('This month\'s winner is {winner$name} (@{winner$screen_name})! DM us to receive "{book}"!

             \n{book_url}

             \n#datascience')
}

```

## An Introduction to Crystal Ball Reading

I try to vary the viz used each month to keep it interesting for Twitter readers but also for anyone interested in playing with the code. Now that the GitHub repo is tidier, finding previous month's scripts for inspiration has gotten easier! But still, blogging a few tips is probably the best way to digest that information.

This month, the challenge was to create a crystall ball that'd progressively reveal the Twitter avatar of the winner, as if chibi Steph were reading it to announce the winner.

I prepared this gif using the [`magick` package](https://cran.r-project.org/web/packages/magick/vignettes/intro.html) for image manipulation, developed by [Jeroen Ooms](https://github.com/jeroen) at [rOpenSci](https://ropensci.org/). It wraps the famous image manipulation library ImageMagick, allowing the user to use it in pipelines within R. Using `magick` is in my opinion a great geometry and logic training: what size and form should each piece have, which one should you put below/above the other etc. So on top of scripting your image manipulation to make it reproducible, you get to play!

### Step 1: create a face-in-hole picture prop

I designed the gif skeleton as a face-in-hole photo prop, where the hole was the crystal ball.

```r
june_background <- function(){
  # create a blue rectangle as background
  background <-  magick::image_blank(400, 300, '#2165B6')

  # activate it as a plot background
  img <- magick::image_draw(background)
  # add stars using base plot!
  points(runif(n = 42, min = 0, max = 400),
         runif(n = 42, min = 0, max = 300),
         cex = runif(42, min = 2, max = 4),
         col = "white",
         pch = 8)

  # add ball support using base plot as well
  rect(250, 250, 350, 150,
       border = "white", lwd = 5,
       col = "white")

  # add crystal ball, its background is a random color
  symbols(300, 150, circles = 50,
          fg = "white", inches = 1, add = TRUE,
          bg = "#B657A3", lwd = 2)

  dev.off()

  # get and resize wizard chibi
  chibi <- magick::image_read(system.file("assets/wizard_steph.png",
                                          package="twitterbookdraw")) %>%
    magick::image_resize("200x200")


  # add chibi on background
  img <- magick::image_composite(img, chibi, offset = "+10+50",
                                 operator = "Over")

  # make the crystal ball transparent by replacing its color
  # by transparency. the hole is done!
  img <- magick::image_transparent(img, "#B657A3")

  # return face-in-hole photo prop
  img
}
```

{{< figure src="../img/2018-06-01-faceinhole.png" title="Face in hole photo prop">}}

## Step 2: add the winner's face behind the hole and an evolving opacity veil

Now, I needed to get the winner's face behind that photo prop! For this I first downloaded the winner's avatar from Twitter, using the winner's information previously drawn.

```r
# winner <- twitterbookdraw::draw_winner()
winner_face <- magick::image_read(winner$profile_image_url) %>%
    magick::image_resize("150x150")
```

Then I wrote a helper function placing the winner's face behind the photo prop and behind a veil of a given opacity.

```r
june_colorized_frame <- function(opacity, winner_face, background){

  # add opacity veil in front of the winner's avatar
  winner_face <- winner_face %>%
    magick::image_colorize(opacity = opacity,
                           color = "black")

  # put the winner's avatar on a white rectangle
  # which will help put the avatar right behind the hole
  winner_face <- magick::image_blank(400, 300, "white") %>%
    magick::image_composite(winner_face, offset = "+220+80")

  # put the carefully placed and veiled winner's avatar
  # behind the photo prop
  magick::image_composite(winner_face, background)
}
```

After this, I created a sequence of evolving opacity (from very dark to lighter and to very dark again, before the big reveal of the avatar, because crystal balls blink, don't they?).

```r
show_june_winner <- function(winner, path = "june.gif"){
  # get winner's avatar
  winner_face <- magick::image_read(winner$profile_image_url) %>%
    magick::image_resize("150x150")

  # create a sequence of varying opacities
  # and for each opacity create a frame
  # then join and animate frames
  frames <- purrr::map(c(seq(from = 100, to = 50, by = -5),
                         seq(from = 50, to = 100, by = 5),
                         seq(from = 100, to = 50, by = -5),
               rep(0, 5)),
             june_colorized_frame,
             winner_face = winner_face,
             background = june_background())

  frames %>%
    magick::image_join() %>%
    magick::image_animate() %>%
    magick::image_write(path)

}
```

Imagine the winner were Amy, [Locke Data's operation manager](https://twitter.com/AmyMcDougall96) (post written before the actual draw... Locke Data team members actually can't win, we'd re-draw!):

```r
winner <- rtweet::search_users("AmyMcDougall96", n = 1)
twitterbookdraw::show_june_winner(winner, path = "2018-06-01-winner.gif")
```

{{< figure src="../img/2018-06-01-winner.gif" title="Winner gif">}} 

Not too shabby, good crystal ball reading skills Wizard Steph!

## Future plans?

Next month, again a random Locke Data follower will win a great book: you should follow [Locke Data on Twitter](https://twitter.com/LockeData) to get a chance! Besides, do not hesitate to ping us there if this post inspired you to play with magick
