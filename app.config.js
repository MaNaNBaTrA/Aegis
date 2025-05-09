export default {
  expo: {
    name: "Aegis",
    slug: "aegis",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/App-Icon-01.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/App-Icon-01.png",
        backgroundColor: "#ffffff"
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/App-Icon-01.png",
        backgroundColor: "#ffffff"
      },
      package: "com.arthur.aegis"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/Web-Icon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/Splash-Screen.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "expo-secure-store",
      "expo-font",
      "expo-asset"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "334e0440-4231-4715-a4be-1dd4b1c25d14"
      },
      myEnvVar: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    owner: "mananbatra16"
  }
};