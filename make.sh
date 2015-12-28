cordova build --release android
rm ~/learing/phodalapp/platforms/android/build/outputs/apk/blog.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/phodal.keystore ~/learing/phodalapp/platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk phodal
~/android-sdk/build-tools/22.0.0/zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk ~/learing/phodalapp/platforms/android/build/outputs/apk/blog.apk
