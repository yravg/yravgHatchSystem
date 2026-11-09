package id.yravg.hatch.core

import java.io.File
import java.io.FileOutputStream
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.time.Instant

// Contract: pure ports the TV core depends on. Android supplies real implementations in :app; JVM tests supply fakes.
// Invariant: nothing here can grant a permission, call ADB, touch root, or switch console power.

/** Boot id changes on every reboot; monotonic ms resets on reboot; wall clock is NOT evidence of time. */
interface DeviceClock {
    fun bootId(): String
    fun monotonicMs(): Long
    fun wallUtc(): Instant
}

/** Durable key/value store. save() must be durable before it returns (persist before acknowledging). */
interface StateStore {
    fun load(key: String): String?
    fun save(key: String, value: String)
}

enum class PermissionState { GRANTED, MISSING, REVOKED }

/** Read-only probe of the normal overlay permission. Deliberately no grant/request method. */
interface OverlayPermissionProbe { fun state(): PermissionState }

enum class LockRoute { NATIVE_OVERLAY, HDMI_FALLBACK, IR_FALLBACK, NONE }

/** A certified independent lock route used when the overlay is unavailable. It never needs CEC or console mains. */
interface FallbackLockRoute {
    val route: LockRoute
    fun available(): Boolean
}

object NoFallback : FallbackLockRoute {
    override val route = LockRoute.NONE
    override fun available() = false
}

enum class PowerCapability { SUPPORTED, UNSUPPORTED }

/** Optional CEC power driver. Never consulted by the lock path. */
interface CecPowerDriver {
    fun capability(): PowerCapability
    fun powerOff(): Boolean
}

object UnsupportedCecDriver : CecPowerDriver {
    override fun capability() = PowerCapability.UNSUPPORTED
    override fun powerOff() = false
}

/** File-backed store: write temp, fsync, atomic rename. Survives process death. */
class FileStateStore(private val dir: File) : StateStore {
    init { dir.mkdirs() }
    override fun load(key: String): String? = File(dir, "$key.json").takeIf { it.exists() }?.readText()
    override fun save(key: String, value: String) {
        val tmp = File(dir, "$key.json.tmp")
        FileOutputStream(tmp).use { it.write(value.toByteArray()); it.fd.sync() }
        Files.move(tmp.toPath(), File(dir, "$key.json").toPath(), StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING)
    }
}
