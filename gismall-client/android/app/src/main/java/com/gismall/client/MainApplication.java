package com.gismall.client;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.codepush.react.CodePush;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
// import com.google.firebase.database.FirebaseDatabase;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new ImagePickerPackage(), new RNFirebasePackage(), new RNFirebaseAuthPackage(),
          new RNFirebaseDatabasePackage(), new RNFirebaseStoragePackage(), new RNFirebaseFirestorePackage(),
          new AppCenterReactNativeCrashesPackage(MainApplication.this,
              getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
          new AppCenterReactNativeAnalyticsPackage(MainApplication.this,
              getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
          new AppCenterReactNativePackage(MainApplication.this),
          new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey),
              getApplicationContext(), BuildConfig.DEBUG),
          new RNLocalizePackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // FirebaseDatabase.getInstance().setPersistenceEnabled(true);
  }
}
