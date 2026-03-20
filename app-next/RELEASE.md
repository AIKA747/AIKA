# iOS

```
  cd ios/

  # archive ipa
  xcodebuild archive -workspace aika.xcworkspace -scheme aika -archivePath aika.xcarchive

  # export ipa
  xcodebuild -exportArchive -exportOptionsPlist export.plist -archivePath aika.xcarchive -exportPath aika -allowProvisioningUpdates

  # upload to app store
  xcodebuild -exportArchive -exportOptionsPlist upload.plist -archivePath aika.xcarchive -exportPath aika -allowProvisioningUpdates
```

# Android

```
  cd android/

  # assemble release
  ./gradlew assembleRelease

  # bundle release
  ./gradlew bundleRelease


```
