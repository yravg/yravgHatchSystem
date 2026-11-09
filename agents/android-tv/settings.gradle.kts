// :contracts = generated protocol (T01), :core = pure Kotlin TV core (T51), :app = Android module id.yravg.hatch (T51).
pluginManagement {
    // Maven Central and Google only: the plugin portal redirects Kotlin jars to github.com, which flaked on CI (T51 fix1).
    repositories { google(); mavenCentral() }
    resolutionStrategy {
        eachPlugin {
            val id = requested.id.id
            if (id == "org.jetbrains.kotlin.plugin.serialization") useModule("org.jetbrains.kotlin:kotlin-serialization:${requested.version}")
            else if (id.startsWith("org.jetbrains.kotlin.")) useModule("org.jetbrains.kotlin:kotlin-gradle-plugin:${requested.version}")
        }
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "hatch-android-tv"

include(":contracts")
include(":core")
include(":app")
