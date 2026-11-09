plugins {
    kotlin("jvm") version "2.0.21"
    kotlin("plugin.serialization") version "2.0.21"
}

repositories { mavenCentral() }

dependencies {
    api(project(":contracts"))
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    testImplementation(kotlin("test"))
}

sourceSets {
    // Fault scenarios live under tests/faults/android-tv and run with the unit tests of this pure module.
    test {
        kotlin.srcDir("../../../tests/faults/android-tv/kotlin")
        resources.srcDir("../../../packages/contracts/leases")
    }
}

tasks.test { useJUnitPlatform() }
