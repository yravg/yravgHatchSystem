// :contracts = generated protocol (T01), :core = pure Kotlin TV core (T51), :app = Android module id.yravg.hatch (T51).
pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "hatch-android-tv"

include(":contracts")
include(":core")
include(":app")
