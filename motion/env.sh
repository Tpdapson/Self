export NODE_PATH=$(npm root -g)
export FFMPEG=/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2
sheet(){ $FFMPEG -v error -y -framerate 1 -pattern_type glob -i "out/$1/*.png" -vf "scale=360:360,tile=${2:-7x4}:padding=4:color=white" -frames:v 1 out/$1.png; }
