# Get new code
git pull

# Install new packages
# Run any python migrations
source pythonEnv/bin/activate
cd djangoapp
pip install -r requirements.txt
python manage.py migrate

# Make new react build
cd ../reactapp
npm install
npm run build

# Restart web server
cd ..
sudo service apache2 restart