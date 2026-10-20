plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.puranbazar.marketplace"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.puranbazar.marketplace"
        minSdk = 28 // Android 9.0 (Pie) and above
        targetSdk = 34 // Required for Google Play Store
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    signingConfigs {
        create("release") {
            // Can be configured via environment variables or gradle.properties
            val keystoreFile = project.rootProject.file("app/puranbazar-release-key.jks")
            if (keystoreFile.exists()) {
                storeFile = keystoreFile
                storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "puranbazar2026"
                keyAlias = System.getenv("KEY_ALIAS") ?: "puranbazar"
                keyPassword = System.getenv("KEY_PASSWORD") ?: "puranbazar2026"
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            val keystoreFile = project.rootProject.file("app/puranbazar-release-key.jks")
            if (keystoreFile.exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.webkit:webkit:1.10.0")
    implementation("androidx.activity:activity-ktx:1.8.2")
}
