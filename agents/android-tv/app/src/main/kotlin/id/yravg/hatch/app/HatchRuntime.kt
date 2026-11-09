package id.yravg.hatch.app

import android.app.admin.DevicePolicyManager
import android.content.Context
import android.os.SystemClock
import android.provider.Settings
import id.yravg.hatch.core.DeviceClock
import id.yravg.hatch.core.FileStateStore
import id.yravg.hatch.core.NoFallback
import id.yravg.hatch.core.OverlayPermissionProbe
import id.yravg.hatch.core.PermissionState
import id.yravg.hatch.core.TvCore
import kotlinx.serialization.json.Json
import java.io.File
import java.time.Instant

/** Boot id from the OS boot counter (changes every cold boot); monotonic from elapsedRealtime (resets on reboot). */
class AndroidClock(private val ctx: Context) : DeviceClock {
    override fun bootId(): String = Settings.Global.getInt(ctx.contentResolver, Settings.Global.BOOT_COUNT, -1).toString()
    override fun monotonicMs(): Long = SystemClock.elapsedRealtime()
    override fun wallUtc(): Instant = Instant.now()
}

/** Read-only. If the overlay permission is missing the app reports it; it never requests or grants it by itself. */
class AndroidOverlayProbe(private val ctx: Context) : OverlayPermissionProbe {
    private val prefs = ctx.getSharedPreferences("overlay", Context.MODE_PRIVATE)
    override fun state(): PermissionState {
        val can = Settings.canDrawOverlays(ctx)
        if (can) prefs.edit().putBoolean("everGranted", true).apply()
        return Adapters.permissionStateFor(can, prefs.getBoolean("everGranted", false))
    }
}

object HatchRuntime {
    @Volatile private var core: TvCore? = null

    fun isDeviceOwner(ctx: Context): Boolean =
        (ctx.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager).isDeviceOwnerApp(ctx.packageName)

    /** The trust bundle (keyId -> raw public key) is written by venue provisioning into app storage; it is never in the repo or APK. */
    private fun trustBundle(ctx: Context): Map<String, String> =
        File(ctx.filesDir, "trust.json").takeIf { it.exists() }?.let { runCatching { Json.decodeFromString<Map<String, String>>(it.readText()) }.getOrNull() } ?: emptyMap()

    fun get(ctx: Context): TvCore = core ?: synchronized(this) {
        core ?: TvCore(
            profile = Adapters.profileFor(isDeviceOwner(ctx)),
            deviceId = File(ctx.filesDir, "device-id").takeIf { it.exists() }?.readText()?.trim().orEmpty(),
            clock = AndroidClock(ctx), store = FileStateStore(File(ctx.filesDir, "state")),
            trust = trustBundle(ctx), permission = AndroidOverlayProbe(ctx),
            fallback = NoFallback, // no certified fallback route exists yet; reported honestly as UNSUPPORTED if the overlay is lost
            verifier = BcEd25519Verifier,
        ).also { it.boot(); core = it }
    }
}
