package com.dpa_me.mashinchi;
import android.support.multidex.MultiDexApplication;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.reactlibrary.RNPushePackage;
import com.rnfs.RNFSPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.github.douglasjunior.reactNativeGetLocation.ReactNativeGetLocationPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.brentvatne.react.ReactVideoPackage;
import org.wonday.orientation.OrientationPackage;
import java.util.Arrays;
import java.util.List;



public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new RNDeviceInfo(),
            new NetInfoPackage(),
            new AsyncStoragePackage(),
            new FastImageViewPackage(),
            new SnackbarPackage(),
            new RNPushePackage(),
            new RNFSPackage(),
            new ReactNativeAudioPackage(),
            new RNSoundPackage(),
            new ReactNativeGetLocationPackage(),
              new RNFetchBlobPackage(),
              new MapsPackage(),
              new OrientationPackage(),
              new RNExitAppPackage(),
              new LottiePackage(),
              new PickerPackage(),
              new ReactVideoPackage(),
              new RNSendIntentPackage(),
              new RNBuildConfigPackage(BuildConfig.class)

      );
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

      I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
      sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);

      SoLoader.init(this, /* native exopackage */ false);
  }
}
