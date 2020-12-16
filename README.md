# SOCIAL SCRAPER DOWNLOADER ORGANIZER

This project was made using another tools (to don't reinvent the wheel, for now) or own code.

If you liked the repo then kindly support it by giving it a star ⭐!

## Important Message

This tool is for research purposes only. Hence, the developers of this tool won't be responsible for any misuse of data collected using this tool.

## My social network

- Facebook: https://www.facebook.com/josemanuel.casaniguerra/
- Twitter: https://twitter.com/MrJmpl3

## Special thanks

- Instaloader team: https://github.com/instaloader/instaloader
- Tiktok Scraper: https://github.com/drawrowfly/tiktok-scraper

If you liked that repos then kindly support it by giving it a star ⭐!

## Contributions Welcome

If you find any bug in the code or have any improvements in mind then feel free to generate a pull request.

## How to use:
- Clone this repo
- Install the dependencies with `yarn install`
- For Instagram, need install Python and install the package **Instaloader** (`pip3 install instaloader`)
- Copy .env.example to .env 
- Fill .env
- Build the project with `yarn run build`

### Social supported

### Facebook commands (Mobile mode, my recommendation is the best mode to scrap)

- Download a profile

`yarn run facebookMobile [profile1] [profile2] [--dev]`

### Facebook commands (Desktop)

- Download a profile

`yarn run facebook [profile1] [profile2] [--fast-scroll] [--dev]`

### Tiktok commands

- Download a profile

`yarn run tiktok [profile1] [profile2]`

### Instagram commands

- Download stories of your feed

`yarn run instagram --stories`

- Download the feed from the last 3 days

`yarn run instagram --feed`

- Download a profile

`yarn run instagram [profile1] [profile2] [--not-stories] [--not-highlights] [--not-tagged] [--not-igtv]`