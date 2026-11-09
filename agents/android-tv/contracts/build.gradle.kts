plugins {
    kotlin("jvm")
    kotlin("plugin.serialization")
}

repositories { mavenCentral() }

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    testImplementation(kotlin("test"))
}

sourceSets {
    main { kotlin.srcDir("../../../packages/contracts/generated/kotlin") }
    test { resources.srcDir("../../../packages/contracts/fixtures") }
}

tasks.test { useJUnitPlatform() }
