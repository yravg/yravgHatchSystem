// T01 shell: only the generated-contracts module. The Android application module (namespace id.yravg.hatch)
// is added by the Kotlin TV core ticket; it needs the Android SDK, which T01 does not.
// shortcut: no Gradle wrapper committed (needs a local Gradle to generate); CI uses setup-gradle with a pinned version.
rootProject.name = "hatch-android-tv"

include(":contracts")
include(":core")
