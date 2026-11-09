// Plugin versions live here once, so JVM and Android modules share one Kotlin classpath.
plugins {
    kotlin("jvm") version "2.4.20" apply false
    kotlin("plugin.serialization") version "2.4.20" apply false
    id("com.android.application") version "9.5.1" apply false
}
