plugins {
    id("com.android.application")
    kotlin("plugin.serialization")
}

android {
    namespace = "id.yravg.hatch"
    compileSdk = 36
    buildToolsVersion = "36.0.0"
    defaultConfig {
        applicationId = "id.yravg.hatch"
        minSdk = 26 // D04: Android 8 candidate floor; only allowlisted firmware is ever certified
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0-t51"
    }
    buildTypes { release { isMinifyEnabled = false } }
    sourceSets {
        getByName("main").java.srcDir("src/main/kotlin")
        getByName("test").java.srcDir("src/test/kotlin")
        getByName("test").resources.srcDir("../../../packages/contracts/leases")
    }
    testOptions { unitTests.isReturnDefaultValues = true }
}

dependencies {
    implementation(project(":core"))
    implementation("org.bouncycastle:bcprov-jdk18on:1.85") // Ed25519 below API 33; lightweight API, no provider registration
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:2.4.20")
    testImplementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
}

// One command runs everything for this ticket: `./gradlew testDebugUnitTest assembleDebug :contracts:test`.
tasks.matching { it.name == "testDebugUnitTest" }.configureEach { dependsOn(":core:test") }
