# Overall guidelines
1. Feel free to use the internet

# Setup
1. Clone the repository to local machine

# Question 1
1. Create a script to load `santa-cruz-nature-team-retreat.json`
2. Add arguments to take an integer input for number of guests and calculate total cost.
3. Add arguments `--display_agenda` to print the full agenda
4. Add arguments to download the images in the `agenda` and store it in a folder locally.

## Hints
Consider using argparse and boto
S3 link: https://retrera-images.s3.us-west-2.amazonaws.com/

# Question 2
1. Create a separate environment
2. Go to /backend and run `pip install -r requirements.txt`
3. Run `python application.py`
3. Go to localhost:5000/graphql
4. Go to /frontend and run `npm install` 
5. Run `npm run start`
6. Go to `localhost:3000`

Add the company to the signup page

## Hints
### DB migration
0. Delete data.sqlite and migrations folder
1. python db_utils.py db init
1. python db_utils.py db migrate
2. python db_utils.py db upgrade
