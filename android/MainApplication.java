import com.reactnativecommunity.geolocation.GeolocationPackage;

public class MainApplication extends Application implements ReactApplication {
  // ... other code
  
  @Override
  protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // Add the following line:
    packages.add(new GeolocationPackage());
    return packages;
  }
}