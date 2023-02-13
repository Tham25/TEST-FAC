SSH_USERNAME_STAGING_2=ubuntu
SSH_HOST_STAGING_2=54.151.183.120
CI_COMMIT_TAG=fac-toan
PEM_KEY=xor_factory.pem
LOCAL_DEST=builds/web

echo "This file must run on root project"
echo "Create local folder"
# read -p "Copy git"
mkdir -p $LOCAL_DEST
mkdir -p $LOCAL_DEST/src/

read -p "Debug 1-Copy .git"
cp -a .git/ $LOCAL_DEST

read -p "Debug 2-Copy pem and ignore file"
cp $PEM_KEY $LOCAL_DEST
cp yarn.lock $LOCAL_DEST
cp src/url.js $LOCAL_DEST/src/

read -p "Debug 3-Reset git"
cd $LOCAL_DEST && git reset --h
cd ../..

cp Dockerfile $LOCAL_DEST

# read -p "Press enter to continue"
pwd
read -p "Checking existed folder"
ssh -i $PEM_KEY $SSH_USERNAME_STAGING_2@$SSH_HOST_STAGING_2 "mkdir -p ~/odin_factory/web"
echo "Check create folder ota server"
ssh -i $PEM_KEY $SSH_USERNAME_STAGING_2@$SSH_HOST_STAGING_2 "sudo cd ~/odin_factory/web && rm -rf .git && ls | grep -v deploy | grep -v cert | xargs rm -rf"
rm -rf $LOCAL_DEST/.git
echo "Copy code to server , local dir must web/"
scp -r -i $PEM_KEY $LOCAL_DEST $SSH_USERNAME_STAGING_2@$SSH_HOST_STAGING_2:/home/ubuntu/odin_factory/
read -p "Copy source to server done -> build docker"
echo "Check docker build for $SSH_USERNAME_STAGING_2@$SSH_HOST_STAGING_2"
ssh -i $PEM_KEY $SSH_USERNAME_STAGING_2@$SSH_HOST_STAGING_2 "ls -la odin_factory/web"
read -p "building docker"
ssh -i $PEM_KEY $SSH_USERNAME_STAGING_2@$SSH_HOST_STAGING_2 "cd ~/odin_factory/web && docker build . -t odin_fac_web ; docker stop odin_fac_web ; docker rm odin_fac_web ; docker run -d --name odin_fac_web -p 8084:80 odin_fac_web --restart=always && exit"
 
read -p "Finish"